<template>
  <div>
    <!-- S 搜索面板 -->
    <SearchPanel
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
          <Upload :uploadImgList='uploadImgList' @uploadSuccess='uploadSuccess' uploadFolderName='product'></Upload>
        </el-form-item>
      </template>
      <template v-slot:4>
        <el-form-item label='相关内容'>
          <Editor v-model='opCustomFormItems.contents'></Editor>
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
import Editor from '@/components/Editor/index.vue';
import Upload from '@/components/Upload/Index.vue';
import { computed, onMounted, reactive, ref, Ref, getCurrentInstance } from 'vue';
import { ElForm } from 'element-plus';
// S 搜索+表格
import TablePannel from '@/components/TablePannel/index.vue';
import SearchPanel from '@/components/SearchPanel/index.vue';
import queryListComponent from '@/mixins/queryListComponent';
import FormPannel from '@/components/FormPannel/index.vue';
import opFormComponent from '@/mixins/opFormComponent';
import CommonAction from '@/components/CommonAction/index.vue';
import comActionComponent from '@/mixins/comActionComponent';
import { dataListByPage, dataInsert, dataDelete, saveOrUpdate, dataModify } from '@/api/product/index';
import { category } from '@/api/product/classify';
import { parseTime, transformClassPower } from '@/utils';

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);
const opCustomFormItems = reactive({ pic: '', contents: '' });

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
// E 搜索+表格


let { opFormDialog, opFnName, onFormSubmit, opCloseForm, opFormItems } = opFormComponent();
// E 新增+修改
// S 弹框操作


const { comActionDialog, comActionCondition, comFnName } = comActionComponent();
// E 弹框操作

// 调取API
// 搜索输入框列表
const searchPannelList = ref([
  { type: 'input', name: '产品名称', prop: 'name' }
]);
// 列表字段
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '分类名称', prop: 'classname' },
  { label: '名称', prop: 'name' },
  { label: '图片', prop: 'pic' },
  { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
]);
// 正则验证
const opFormRules = ref({
  pid: [
    { required: true, trigger: 'change', message: '请选择所属分类' }
  ],
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ]
});

const uploadImgList: Ref<{ url: string }[]> = ref([]);

/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = async (opera: string, param: any) => {
  opFnName.value = saveOrUpdate;
  if (opera === 'add') {
    opFormItems.value = opFormItems.value.map((item: any) => {
      if (item.prop !== 'update')
        item.value = '';
      return item;
    });
    opFormDialog.value.title = '新增';
    opFormDialog.value.buttonTitle = '新增';
    uploadImgList.value = [];
  } else if (opera === 'edit') {
    opFormItems.value = opFormItems.value.map((item: any) => {
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
  comActionDialog.value = { title: '', visible: false, buttonTitle: '', message: '' };
  getItemList();
};

/**
 *  删除
 */
const comDelete = (params:any) => {
  comFnName.value = dataDelete;
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
const getBtnList = (title:string, data:any) => {
  if (data.menubuttonList && data.menubuttonList.length !== 0) {
    return data.menubuttonList.map( (item:any) => {
      return {
        id: title + ',' + item.type + ',' + item.name,
        label: item.name
      };
    });
  }
  return [];
};


/**
 *  获取当前菜单下边的按钮
 */
const insertBunList = (data:string, menuList:any[]) => {
  let res = menuList.filter( (item:any) => {
    return item.indexOf(data) > -1 && item !== data;
  }).map( (item:any) => {
    let arr = item.split(',');
    return {
      'buttonName': arr[3],
      'buttonType': arr[2]
    };
  });
  return res;
};

const getCategoryList = async () => {
  const result = await category();
  return result.data.data.map( (item:any) => {
    // let obj = {};
    let obj: { value: any; label: string } = {} as any;
    obj.value = item.classid;
    obj.label = transformClassPower(item.classpower) + item.classname;
    return obj;
  });
};

onMounted(async () => {
  getListFnName.value = dataListByPage;
  opFormItems.value = [
    { prop: 'id', value: '' },
    { label: '所属分类', prop: 'pid', type: 'select', selectValue: await getCategoryList() },
    { label: '分类名称', prop: 'name', type: 'input' },
    { label: '推荐值', prop: 'top', type: 'number' },
    { label: '访问量', prop: 'num', type: 'number' }
  ];
});

/**
 * 上传图片
 * @param params
 */
const uploadSuccess = (params:any[]) => {
  opCustomFormItems.pic = params[0].url;
};

/**
 *  导出excel
 */

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
const onSuccess = (response:any) => {
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
