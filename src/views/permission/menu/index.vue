<template>
  <div>
    <!-- S 搜索面板 -->
    <SearchPanel
      :searchBtnLoading='searchBtnLoading'
      :itemList='searchPannelList'
      @onSearch='handleEventSearch'
    >
      <template #operationButton>
        <el-button @click="opearDialog('add', '')" v-permission="['addMenu']"> 新增菜单</el-button>

        <el-button @click='opDialogAddBtn' v-permission="['addButton']"> 新增按钮</el-button>
        <el-button @click='batchDelete' v-permission="['batchDelete']" type='danger'>批量删除</el-button>
        <el-button v-permission="['batchSync']" type='warning' @click='handleBatch'>批量同步</el-button>
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
      <template #menubuttonList='{scope:{menubuttonList}}'>
        <template v-for='(item,index) in menubuttonList'>
          <Perbutton :btnType='item.type'
                     :btnId='item.id' :name='item.name'
                     @close='deleteBtnFn'>
          </Perbutton>

        </template>
      </template>

      <template #operation='{ scope }'>
        <el-button @click="opearDialog('edit', scope)" v-permission="['edit']"> 编辑</el-button>
        <el-button @click='comDelete(scope)' v-permission="['delete']" type='danger'> 删除</el-button>
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
      @onFormSubmit='onSubmit'
    >
      <template v-slot:-1>
        <template v-if='showMenuBtnVisible'>
          <!-- 一级菜单 -->
          <el-form-item label='父级菜单'>
            <el-select @change='getSecondsMenuByMenuId' v-model='opCustomFormItems.firMenuId' placeholder='请选择'
                       clearable
            >
              <el-option
                v-for='item in firMenuList'
                :key='item.id'
                :label='item.title'
                :value='item.id'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 二级菜单 -->
          <el-form-item label='二级菜单'>
            <el-select v-model='opCustomFormItems.menuId' placeholder='请选择' clearable>
              <el-option
                v-for='item in secMenuList'
                :key='item.id'
                :label='item.title'
                :value='item.id'
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 按钮名称 -->
          <el-form-item label='按钮名称' prop='name'>
            <el-input v-model='opCustomFormItems.name' clearable />
          </el-form-item>
          <!-- 按钮type -->
          <el-form-item label='按钮type' prop='name'>
            <el-input v-model='opCustomFormItems.type' clearable />
          </el-form-item>
        </template>
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
import { onMounted, ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);

const showMenuBtnVisible = ref<Boolean>(false);

// S 搜索+表格
import TablePannel from '@/components/TablePannel/index.vue';
import SearchPanel from '@/components/SearchPanel/index.vue';

import Perbutton from '@/components/Permission/Button/index.vue';
// import Perbutton from '@/components/Permission/Button/perButton';

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
//import FormPannel from '@/components/FormPannel/index.vue';
import opFormComponent from '@/mixins/opFormComponent';
import FormPannel from '@/components/FormPannel/FormPannel.vue';

let { opFormDialog, opFnName, onFormSubmit, opCloseForm, opFormItems } = opFormComponent();
// E 新增+修改
// S 弹框操作
import CommonAction from '@/components/CommonAction/index.vue';
import comActionComponent from '@/mixins/comActionComponent';

const { comActionDialog, comActionCondition, comFnName } = comActionComponent();
// E 弹框操作

// 调取API

import {
  menuList,
  allMultilevelClassification,
  batchMenuSave,
  dataDelete,
  category,
  getSecMenuList,
  saveOrUpdate, indertBtn, dataBatchDelete
} from '@/api/permission/menu/index';
import { deleteBtn } from '@/api/permission/role';


const searchPannelList = ref([
  { type: 'input', name: '菜单名称', prop: 'title' }
]);
// 列表字段
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '菜单名称', prop: 'title' },
  { label: '按钮', prop: 'menubuttonList', isSlot: true },
  { label: '菜单name', prop: 'name' },
  { label: '菜单排序', prop: 'menuOrder' },
  { label: '操作', isSlot: true, prop: 'operation', width: 170, fixed: 'right', dataIndex: '', align: 'center' }
]);
// 正则验证
const opFormRules = ref({
  roleName: [{ required: true, message: '请选输入角色名称', trigger: 'blur' }],
  roleDesc: [{ required: true, message: '请选输入角色描述', trigger: 'blur' }]
});

const menuDataList = ref([]); // 菜单复选框
// 菜单复选框默认选择
const defaultCheckedKeys = ref([]);
const tree = ref(ElForm);
// 插槽的表单内容
const opCustomFormItems = ref({});
/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = async (opera, param) => {
  getAddFormItem();
  defaultCheckedKeys.value = [];
  // await getAllmenus();
  let arrayDefaultCheck = [];

  const { data: { data: categoryList } } = await category();
  opFormItems.value[1].selectValue = categoryList.map(item => {
    return {
      value: item.id,
      label: item.title
    };
  });
  opFnName.value = saveOrUpdate;
  if (opera === 'add') {
    opFormItems.value = opFormItems.value.map(item => {
      item.value = '';
      return item;
    });
    opFormDialog.value.title = '新增';
    opFormDialog.value.buttonTitle = '新增';

  } else if (opera === 'edit') {
    opFormItems.value = opFormItems.value.map(item => {
      item.value = param[item.prop];
      return item;
    });

    opFormDialog.value.title = '修改';
    opFormDialog.value.buttonTitle = '修改';
  }
  defaultCheckedKeys.value = arrayDefaultCheck;
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

/**
 *  获取所有菜单
 */
const getAllmenus = async () => {
  const { data } = await allMultilevelClassification();
  menuDataList.value = data.data.map(item => {
    let res = {};
    res.id = item.id + ',' + item.title;
    res.label = item.title;
    res.children = [];
    item.children.forEach(it => {
      let title = it.id + ',' + it.title;
      res.children.push({
        id: title,
        label: it.title,
        children: getBtnList(title, it)
      });
    });
    return res;
  });
};

/**
 *  多级选择函数
 */
const handleCheckChange = () => {
  let selectAllIds = [...tree.value.getHalfCheckedKeys(), ...tree.value.getCheckedKeys()];
  opCustomFormItems.value = {};
  const selectMenus = selectAllIds.filter(item => {
    return item.split(',').length === 2;
  }).map((item) => {
    const data = item.split(',');
    return { menuId: data[0], menuTitle: data[1], rolebuttonsList: insertBunList(item, selectAllIds) };
  });

  if (selectMenus.length !== 0) {
    opCustomFormItems.value = { 'roleMenus': selectMenus };
  }
};

/**
 *  获取当前菜单下边的按钮
 */
const insertBunList = (data, menuList) => {
  let res = menuList.filter(item => {
    return item.indexOf(data) > -1 && item !== data;
  }).map(item => {
    let arr = item.split(',');
    return {
      'buttonName': arr[3],
      'buttonType': arr[2]
    };
  });
  return res;
};

/**
 * 删除按钮
 * @param param
 */
const deleteBtnFn = (param) => {
  comActionCondition.value = { id: param };
  comFnName.value = deleteBtn;
  comActionDialog.value = {
    title: '删除按钮',
    visible: true,
    buttonTitle: '按钮删除',
    message: '是否确认删除该按钮?'
  };
};

import { dynamicRoutes } from '@/router';

/**
 *  批量新增菜单
 */
const handleBatch = () => {
  const routesList = getMenuLevel(dynamicRoutes);

  function getMenuLevel(dynamicRoutes: any) {
    return dynamicRoutes.map(item => {
      return {
        name: item.name,
        title: item.meta.title,
        button: getBtnFn(item.meta.btnPermissions),
        meta: { title: item.meta.title, icon: item.meta.icon, btnPermissions: item },
        children: getMenuLevel(item.children || [])
      };
    });

    /**
     * 转换按钮列表
     * @param buttonList
     */
    function getBtnFn(buttonList: any) {
      let btnList: any[] = [];
      if (typeof (buttonList) !== 'undefined' && buttonList.length !== 0) {
        btnList = buttonList.map(item => {
          return {
            title: item.title,
            type: item.type
          };
        });
      }
      return btnList;
    }

  }

  batchMenuSave(routesList);
  ElMessage.success(`批量新增菜单成功!`);
  setTimeout(() => {
    getItemList();
  });

};

/**
 * 表单提交
 * @param params
 */
const onSubmit = async (params: any) => {
  try {
    const actionFunction: Function = showMenuBtnVisible ? indertBtn : saveOrUpdate;
    const result: any = await actionFunction(params);
    if (result.code === 20000) {
      ElMessage({ message: `操作成功`, grouping: true, type: 'success' });
    } else {
      ElMessage({ message: `${result.message}`, grouping: true, type: 'error' });
    }
  } catch (e) {
    console.error(e);
  } finally {
    showMenuBtnVisible.value = false;
    opFormDialog.value.visible = false;
    setTimeout(() => {
      getItemList();
    });
  }
};

/**
 *  新增按钮
 */
const firMenuList = ref([]); // 一级菜单

const opDialogAddBtn = async () => {
  opFormItems.value = [];
  opFormDialog.value.visible = true;
  showMenuBtnVisible.value = true;
  const { data: { data: menuList } } = await category();
  firMenuList.value = menuList;

  opCustomFormItems.value = {
    firMenuId: '',
    menuId: '',
    name: '',
    type: ''
  };
};

/**
 * 切换二级菜单
 * @param param
 */
const secMenuList = ref([]); // 二级菜单
const getSecondsMenuByMenuId = async (param: Number | String) => {
  if (param === 0 || param === '')
    secMenuList.value = [];
  const { data: { data: menuList } } = await getSecMenuList({ id: param });
  secMenuList.value = menuList;
};

/**
 * 批量删除
 */
const batchDelete = () => {
  const ids = selectItemList.value.map(item => item.id);
  comFnName.value = dataBatchDelete;
  comActionDialog.value = {
    title: '批量删除',
    visible: true,
    buttonTitle: '批量删除',
    message: '是否确认批量删除内容?'
  };
  comActionCondition.value = { 'ids': ids };
};


const getAddFormItem = () => {
  opFormItems.value = [
    { prop: 'id', value: '' },
    { label: '父级菜单', prop: 'fid', type: 'select' },
    { label: '菜单名称', prop: 'title', type: 'input' },
    { label: '菜单Name', prop: 'name', type: 'input' },
    { label: '菜单排序', prop: 'menuOrder', type: 'input' }
  ];
};

onMounted(() => {
  getListFnName.value = menuList;


});
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
