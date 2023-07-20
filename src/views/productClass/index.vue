<template>
  <div>
    <!-- S 搜索面板 -->
    <SearchPanel
      ref='searchPanelRef'
      :searchBtnLoading='searchBtnLoading'
      :itemList='searchPannelList'
      @onSearch='handleEventSearch'
    >
      <template #operationButton>
        <el-button @click="opearDialog('add', '')"> 新增</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索面板 -->

    <!-- S 列表面板 -->
    <TablePannel
      :rowKey='(record:any) =>{ return  record.id}'
      :columns='columns'
      :data-source='dataSource'
      @selection-change='handleSelectionChange'
      @changeSize='changeSize'
      @changeNum='changeNum'
      :table-loading='searchBtnLoading'
    >
       <template #classname='{ scope }'>
         <span style="color: #20a0ff">{{ transformClassPower(scope.classpower) }}{{ scope.classname }}</span>
      </template>

      <template #operation='{ scope }'>
        <el-button @click="opearDialog('edit', scope)"> 编辑</el-button>
        <el-button @click='comDelete(scope)' type='danger'> 删除</el-button>
      </template>
    </TablePannel>
    <!-- E 列表面板 -->
    <Page :total='totalCount' :pageNum='pageNum' :pageSize='pageSize' @changeSize='changeSize'
          @changeNum='changeNum'></Page>
    <!-- S 新增编辑 -->
    <FormPannel
      :opFormRules='opFormRules'
      :opFormDialog='opFormDialog'
      :opFormItems='opFormItems'
      :opCustomFormItems='opCustomFormItems'
      :opFnName='opFnName'
      @opCloseForm='opCloseForm'
      @onFormSubmit='refreshList'
    >
      <template v-slot:3>
        <el-form-item label='相关图片'>
          <Upload :img='opCustomFormItems.classpic' @uploadSuccess='uploadSuccess'></Upload>
        </el-form-item>
      </template>

    </FormPannel>
    <!-- E 新增编辑 -->

    <!-- S 删除操作 -->
    <CommonAction
      :comActionDialog='comActionDialog'
      :comActionCondition='comActionCondition'
      :comFnName='comFnName'
      @refresh='refreshList'
    >
    </CommonAction>
    <!-- E 删除操作 -->
  </div>
</template>

<script setup lang='ts'>
// S 搜索+表格
import TablePannel from '@/components/TablePannel/index.vue';
import SearchPanel from '@/components/SearchPanel/index.vue';
import queryListComponent from '@/mixins/queryListComponent';
import Upload from '@/components/Upload/Index.vue';
import { computed, onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { ElForm } from 'element-plus';
// E 搜索+表格
import FormPannel from '@/components/FormPannel/index.vue';
import opFormComponent from '@/mixins/opFormComponent';
import CommonAction from '@/components/CommonAction/index.vue';
import comActionComponent from '@/mixins/comActionComponent';
// 调取API
import { dataListByPage, dataInsert, dataDelete, dataModify, category } from '@/api/product/classify';
import { downloadFile, parseTime, transformClassPower } from '@/utils';

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);
const opCustomFormItems = reactive({
  classpic: ''
});

const importExcelUrl = `${import.meta.env.VITE_APP_BASE_API}/news/import`;


// 解构方法
const {
  getListFnName,
  searchBtnLoading,
  pageNum,
  pageSize,
  totalCount,
  dataSource,
  handleEventSearch,
  getItemList,
  changeSize,
  changeNum,
  handleSelectionChange
} = queryListComponent();


let { opFormDialog, opFnName, onFormSubmit, opCloseForm, opFormItems } = opFormComponent();
// E 新增+修改
// S 弹框操作

const { comActionDialog, comActionCondition, comFnName } = comActionComponent();
// E 弹框操作


// 搜索输入框列表
const searchPannelList = ref([
  { type: 'input', name: '分类名称', prop: 'classname' },
  { type: 'date', name: '分类内容', prop: 'classcontents' }
]);
// 列表字段
const columns = ref([
  { label: 'ID', prop: 'classid' },
  { label: '分类名称', prop: 'classname',isSlot: true },
  { label: '图片', prop: 'classpic' },
  { label: '内容', prop: 'classcontents' },
  { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
]);
// 正则验证
const opFormRules = ref({
  classname: [{ required: true, message: '分类名称必填', trigger: 'blur' }
  ]
});

/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = async (opera: string, param: any) => {
  await getCategoryList(param);
  if (opera === 'add') {
    opFnName.value = dataInsert;
    opFormItems.value = opFormItems.value.map((item: any) => {
      if (item.prop !== 'update')
        item.value = '';
      return item;
    });
    opFormDialog.value.title = '新增';
    opFormDialog.value.buttonTitle = '新增';

  } else if (opera === 'edit') {
    opFnName.value = dataModify;
    opFormItems.value = opFormItems.value.map((item: any) => {
      item.value = (item.prop === 'rootid' &&  param[item.prop] === 0) ? '' : param[item.prop];
      return item;
    });
    opCustomFormItems.classpic = param.classpic;
    opFormDialog.value.title = '修改';
    opFormDialog.value.buttonTitle = '修改';
  }
  opFormDialog.value.visible = true;
};

/**
 *  操作后刷新列表
 */
const refreshList = () => {
  comActionDialog.value = { title: '', visible: false, buttonTitle: '', message: '' };
  getItemList();
};

/**
 *  删除
 */
const comDelete = (params: any) => {
  comFnName.value = dataDelete;
  comActionDialog.value = {
    title: '删除',
    visible: true,
    buttonTitle: '删除',
    message: '是否确认删除本条内容?'
  };
  comActionCondition.value = params;
};


const getCategoryList = async (param:any) => {
  let result = await category();
  const selectList = result.data.data.map((item: any) => {
    item.label =  transformClassPower(item.classpower) + item.classname;
    item.value = item.classid;
    item.disabled = item.classpower.indexOf(param.classpower) === 0 ? true : false;
    return item;
  });
  // 表格字段
  opFormItems.value = [
    { prop: 'classid', value: '' },
    { label: '所属分类', prop: 'rootid', type: 'select', selectValue: selectList },
    { label: '分类名称', prop: 'classname', type: 'input' },
    { label: '分类内容', prop: 'classcontents', type: 'textarea' }
  ];
};


onMounted(() => {
  // 列表接口名称
  getListFnName.value = dataListByPage;
});

/**
 * 上传图片
 * @param params
 */
const uploadSuccess = (params: any) => {
  opCustomFormItems.classpic = params;
};

// 上传文件HEADER传递内容
const headers = computed(() => {
  const jwt = window.localStorage.getItem('token');
  return { 'X-Token': jwt };
});

/**
 * 文件上传成功
 * @param response
 * @param file
 * @param fileList
 */
const onSuccess = (response: any) => {
  if (response.code === 20000) {
    getItemList();
  }
};

</script>

<style scoped lang='less'>
.el-card {
  margin-bottom: 20px;
}

.searchButtonList {
  ::v-deep(.el-form-item__content) {
    justify-content: flex-end;
  }
}
</style>
