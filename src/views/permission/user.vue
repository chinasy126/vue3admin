<template>
  <div>
    <!-- S 搜索面板 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :itemList="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template #operationButton>
        <el-button @click="opearDialog('add','')" v-permission="['add']" > 新增</el-button>
        <el-button type='danger' v-permission="['batchDelete']" >批量删除</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索面板 -->

    <!-- S 列表面板 -->
    <TablePannel
      :rowKey="(record) => record.id"
      :columns="columns"
      :data-source="dataSource"
      @selection-change="handleSelectionChange"
      @changeSize="changeSize"
      @changeNum="changeNum"
      :row-key="(record)=> record.id "
      :table-loading="searchBtnLoading"
    >
      <template #operation="{scope}">
        <el-button @click="opearDialog('edit',scope)" v-permission="['edit']" > 编辑</el-button>
        <el-button @click="comDelete(scope)" type="danger" v-permission="['delete']" > 删除</el-button>
      </template>

    </TablePannel>
    <!-- E 列表面板 -->
    <Page :total='totalCount' :pageNum='pageNum' :pageSize='pageSize' @changeSize='changeSize'
          @changeNum='changeNum'></Page>
    <!-- S 新增编辑 -->
    <FormPannel
      :opFormRules="opFormRules"
      :opFormDialog="opFormDialog"
      :opFormItems="opFormItems"
      :opFnName="opFnName"
      @opCloseForm="opCloseForm"
      @onFormSubmit="refreshList"
    >
    </FormPannel>
    <!-- E 新增编辑 -->

    <!-- S 删除操作 -->
    <CommonAction
      :comActionDialog="comActionDialog"
      :comActionCondition="comActionCondition"
      :comFnName="comFnName"
      @refresh="refreshList"
    >
    </CommonAction>
    <!-- E 删除操作 -->

  </div>
</template>

<script setup lang="ts">

import {
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue'

import TablePannel from '@/components/TablePannel/index.vue'
import SearchPanel from '@/components/SearchPanel/index.vue'
import queryListComponent from "@/mixins/queryListComponent";

// 解构方法
const {
  getListFnName, searchBtnLoading, pageNum, pageSize,
  totalCount, dataSource, handleEventSearch, getItemList,
  changeSize, changeNum, handleSelectionChange} = queryListComponent()

import FormPannel from '@/components/FormPannel/index.vue'
import opFormComponent from "@/mixins/opFormComponent";

let {opFormDialog, opFnName, onFormSubmit, opCloseForm, opFormItems} = opFormComponent()

import CommonAction from '@/components/CommonAction/index.vue'
import comActionComponent from "@/mixins/comActionComponent";

const {comActionDialog, comActionCondition, comFnName} = comActionComponent()

import {dataListByPage, insertData, deleteData, saveOrUpdate} from '@/api/permission/user';

import {UserListType} from "@/api/permission/types";
import {UserForm} from "@/api/user/types";

import {ElForm, FormInstance} from "element-plus";

import {roleList} from "@/api/role";
import {parseTime} from "@/utils";

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);

const searchPannelList = ref([
  {type: 'input', name: '用户名', prop: 'username'},
  {type: 'date', name: '创建时间', prop: 'createTime'}
],)
// 列表字段
const columns = ref([
  {label: 'ID', prop: 'id'},
  {label: '用户名', prop: 'username'},
  {label: '出生年月', prop: 'birthday'},
  {label: '用户角色', prop: 'roleName'},
  {label: '添加时间', prop: 'createTime'},
  {label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center'}
])
// 正则验证
const opFormRules = ref({
  username: [{required: true, message: '用户名必填', trigger: 'blur'}
  ],
  roleId: [
    {required: true, message: '请选择用户角色', trigger: 'change'}
  ],
  birthday: [
    {required: true, message: '请填写出生年月', trigger: 'blur'}
  ]
})

// 角色下拉框
const roleOptions = ref([]) as OptionType[];


/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = (opera, param) => {
  opFormDialog.value.visible = true
  opFnName.value = saveOrUpdate
  if (opera === 'add') {
    opFormItems.value = opFormItems.value.map(item => {
      item.value = item.prop === 'birthday' ? parseTime(new Date(), '{y}-{m}-{d}') : ''
      return item
    })
    opFormDialog.value.title = '新增'
    opFormDialog.value.buttonTitle = '新增'
  } else if (opera === 'edit') {
    opFormItems.value = opFormItems.value.map(item => {
      item.value = param[item.prop]
      return item
    })
    opFormDialog.value.title = '修改'
    opFormDialog.value.buttonTitle = '修改'
  }
}

/**
 *  操作后刷新列表
 */
const refreshList = () => {
  comActionDialog.value = {visible: false}
  getItemList()
}

/**
 *  删除
 */
const comDelete = (params) => {
  comFnName.value = deleteData
  comActionDialog.value = {title: '删除', visible: true, buttonTitle: '删除', message: '是否确认删除本条内容?'}
  comActionCondition.value = {id: params.id}
}


onMounted(async () => {
  getListFnName.value = dataListByPage
  const result = await roleList();
  const roleOptions = result.data.data.map((item) => {
    return {
      'label': item.roleName,
      'value': item.id
    }
  })
  opFormItems.value = [
    {prop: 'id', value: ''},
    {label: '所属角色', prop: 'roleId', type: 'select', selectValue: roleOptions},
    {label: '用户名', prop: 'username', type: 'input'},
    {label: '用户密码', prop: 'password', type: 'input', showValue: false},
    {label: '出生年月', prop: 'birthday', type: 'date', value: parseTime(new Date(), '{y}-{m}-{d}')}
  ]
})

</script>

<style scoped lang="less">
.el-card {
  margin-bottom: 20px;
}

.searchButtonList {
  ::v-deep( .el-form-item__content ) {
    justify-content: flex-end;
  }
}
</style>
