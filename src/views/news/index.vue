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
        <el-button @click="opearDialog('add', '')" v-permission='["add"]'> 新增</el-button>
        <FileUpload :fileUploadFnName='importFileData' @onUploadFileSuccess='onUploadFileSuccess'
                    v-permission="['import']">文件上传
        </FileUpload>
        <el-button type='danger' @click='exportData()' v-permission="['export']"> 导出</el-button>
        <el-button type='danger' @click='opBatchDelAialog()' v-permission="['batchDeletion']">批量删除</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索面板 -->

    <!-- S 列表面板 -->
    <TablePannel
      :rowKey='record => record.id'
      :columns='columns'
      :data-source='dataSource'
      @selection-change='handleSelectionChange'
      @changeSize='changeSize'
      @changeNum='changeNum'
      :row-key='record => record.id'
      :table-loading='searchBtnLoading'
    >
      <template #operation='{ scope }'>
        <el-button @click="opearDialog('edit', scope)" v-permission="['edit']"> 编辑</el-button>
        <el-button @click='comDelete(scope)' type='danger' v-permission="['delete']"> 删除</el-button>
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

      <template v-slot:4>
        <el-form-item label='相关内容'>
          <Editor v-model='opCustomFormItems.contents'></Editor>
        </el-form-item>
      </template>
      <template v-slot:3>
        <el-form-item label='相关图片'>
          <Upload :uploadImgList='uploadImgList' @uploadSuccess='uploadSuccess' uploadFolderName='news'></Upload>
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
import FileUpload from '@/components/Upload/FileUpload.vue';
import Upload from '@/components/Upload/Index.vue';
import { computed, onMounted, reactive, ref, getCurrentInstance } from 'vue';

import Editor from '@/components/Editor/index.vue';

import { ElForm } from 'element-plus';

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);
const opCustomFormItems = reactive({});
// 上传图片列表
const uploadImgList = ref([]);
const importExcelUrl = `${import.meta.env.VITE_APP_BASE_API}/news/import`;

// 文件上传接口

// S 搜索+表格
import TablePannel from '@/components/TablePannel/index.vue';
import SearchPanel from '@/components/SearchPanel/index.vue';
import queryListComponent from '@/mixins/queryListComponent';
// 解构方法
const {
  selectItemList,
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
// E 搜索+表格
import FormPannel from '@/components/FormPannel/index.vue';
import opFormComponent from '@/mixins/opFormComponent';

let { opFormDialog, opFnName, onFormSubmit, opCloseForm, opFormItems } = opFormComponent();
// E 新增+修改
// S 弹框操作
import CommonAction from '@/components/CommonAction/index.vue';
import comActionComponent from '@/mixins/comActionComponent';

const { comActionDialog, comActionCondition, comFnName } = comActionComponent();
// E 弹框操作

// 调取API

import {
  dataListByPage,
  exportExcelData,
  newsDelete,
  newsInsert,
  newsModify,
  batchDelete,
  importFileData
} from '@/api/news/index';
import { downloadFile, parseTime } from '@/utils';
// 搜索输入框列表
const searchPannelList = ref([
  { type: 'input', name: '标题', prop: 'title' },
  { type: 'date', name: '时间', prop: 'update' }
]);
// 列表字段
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '标题', prop: 'title' },
  { label: '图片', prop: 'pic' },
  { label: '推荐', prop: 'top' },
  { label: '时间', prop: 'update' },
  { label: '副标题', prop: 'fTitle' },
  { label: '操作', isSlot: true, width: 170, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
]);
// 正则验证
const opFormRules = ref({
  roleName: [{ required: true, message: '请选输入角色名称', trigger: 'blur' }],
  roleDesc: [{ required: true, message: '请选输入角色描述', trigger: 'blur' }]
});


/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = async (opera, param) => {
  uploadImgList.value = [];
  if (opera === 'add') {
    opFnName.value = newsInsert;
    opFormItems.value = opFormItems.value.map(item => {
      if (item.prop !== 'update')
        item.value = '';
      if (item.type === 'number') {
        item.value = 0;
      }
      return item;
    });
    opFormDialog.value.title = '新增';
    opFormDialog.value.buttonTitle = '新增';

  } else if (opera === 'edit') {
    opFnName.value = newsModify;
    opFormItems.value = opFormItems.value.map(item => {
      item.value = param[item.prop];
      return item;
    });
    opCustomFormItems.contents = param.contents;
    uploadImgList.value = [{ 'url': param.pic }];
    opFormDialog.value.title = '修改';
    opFormDialog.value.buttonTitle = '修改';
  }
  opFormDialog.value.visible = true;
};

/**
 *  操作后刷新列表
 */
const refreshList = () => {
  comActionDialog.value = { visible: false };
  getItemList();
};

/**
 *  删除
 */
const comDelete = params => {
  comFnName.value = newsDelete;
  comActionDialog.value = {
    title: '删除',
    visible: true,
    buttonTitle: '删除',
    message: '是否确认删除本条内容?'
  };
  comActionCondition.value = { id: params.id };
};

/**
 * 获取按钮列表
 * @param title
 * @param data
 */
const getBtnList = (title, data) => {
  if (data.menubuttonList && data.menubuttonList.length !== 0) {
    return data.menubuttonList.map(item => {
      return {
        id: title + ',' + item.type + ',' + item.name,
        label: item.name
      };
    });
  }
  return [];
};


onMounted(() => {
  getListFnName.value = dataListByPage;
  opFormItems.value = [
    { prop: 'id', value: '' },
    { label: '标题', prop: 'title', type: 'input' },
    { label: '副标题', prop: 'fTitle', type: 'input' },
    { label: '日期', prop: 'update', type: 'date', value: parseTime(new Date(), '{y}-{m}-{d}') },
    { label: '推荐值', prop: 'top', type: 'number' },
    { label: '访问量', prop: 'num', type: 'number' }
  ];
});

/**
 * 上传图片
 * @param params
 */
const uploadSuccess = (params) => {
  opCustomFormItems.pic = params[0].url;
};

/**
 *  导出excel
 */

const searchPanelRef = ref();
const exportData = () => {
  exportExcelData(searchPanelRef.value.searchForm).then(({ data }) => {
    downloadFile(data, '新闻');
  });
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
const onSuccess = (response, file, fileList) => {
  if (response.code === 20000) {
    getItemList();
  }

};

/**
 *  批量删除
 */
const opBatchDelAialog = () => {
  const ids = selectItemList.value.map(item => item.id);
  comFnName.value = batchDelete;
  comActionDialog.value = {
    title: '批量删除',
    visible: true,
    buttonTitle: '删除',
    message: '是否确认批量删除本条内容?'
  };
  comActionCondition.value = { id: ids };
};

/**
 * 上传成功
 */
const onUploadFileSuccess = () => {
  getItemList();
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
