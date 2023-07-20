<template>
  <div>
    <!-- S 搜索面板 -->
    <SearchPanel
      :searchBtnLoading='searchBtnLoading'
      :itemList='searchPannelList'
      @onSearch='handleEventSearch'
    >
      <template #operationButton>
        <el-button @click="opearDialog('add', '')" v-permission="['add']"> 新增</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索面板 -->

    <!-- S 列表面板 -->
    <TablePannel
      :rowKey='(record:any) =>{ return  record.id}'
      :columns='columns'
      :data-source='dataSource'
      @selection-change='handleSelectionChange'
      :table-loading='searchBtnLoading'
    >
      <template #roleMenus='{scope}'>
        <RolePermission :permission='scope.roleMenus'></RolePermission>
      </template>
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
      <template #-1>
        <el-form-item label='菜单'>
          <el-tree
            ref='tree'
            :data='menuDataList'
            show-checkbox
            :default-checked-keys='defaultCheckedKeys'
            node-key='id'
            :render-after-expand='false'
            @check-change='handleCheckChange'
          >
          </el-tree>
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
import { onMounted, ref, Ref } from 'vue';
import { ElForm } from 'element-plus';
// S 搜索+表格
import TablePannel from '@/components/TablePannel/index.vue';
import SearchPanel from '@/components/SearchPanel/index.vue';
import queryListComponent from '@/mixins/queryListComponent';
import FormPannel from '@/components/FormPannel/index.vue';
import opFormComponent from '@/mixins/opFormComponent';
import CommonAction from '@/components/CommonAction/index.vue';
import comActionComponent from '@/mixins/comActionComponent';
import RolePermission from './RolePermission.vue';
import { allMultilevelClassification } from '@/api/permission/menu/index';
import { getRolePages, insertRole, modifyRole, deleteData } from '@/api/permission/role';
import { RoleMenu } from '@/views/permission/role/type';

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);


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
const searchPannelList = ref([
  { type: 'input', name: '角色名称', prop: 'roleName' }
]);
// 列表字段
const columns = ref([
  { label: 'ID', prop: 'id' },
  { label: '角色名称', prop: 'roleName' },
  { label: '角色说明', prop: 'roleDesc' },
  { label: '角色权限', prop: 'roleMenus', isSlot: true },
  { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
]);
// 正则验证
const opFormRules = ref({
  roleName: [{ required: true, message: '请选输入角色名称', trigger: 'blur' }],
  roleDesc: [{ required: true, message: '请选输入角色描述', trigger: 'blur' }]
});

const menuDataList = ref([]); // 菜单复选框
// 菜单复选框默认选择
const defaultCheckedKeys: Ref<any[]> = ref([]);
const tree = ref(ElForm);
// 插槽的表单内容
const opCustomFormItems = ref({});
/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = async (opera: string, param: any) => {
  //console.log(opCustomFormItems.value,'*****')

  /**
   *  菜单按钮
   */
   const roleMeus:any[] = (function() {
    let mItemArr: { menuId: number; menuTitle: string; rolebuttonsList: any[] }[] = [];
    if (param !== "" && param.roleMenus.length !== 0) {
      mItemArr = param.roleMenus.map((item: RoleMenu) => {
        let mItem : any = {}
        mItem.menuId = item.menuId;
        mItem.menuTitle = item.menuTitle;
        mItem.rolebuttonsList = item.rolebuttonsList;
        return mItem;
      });
    }
    return mItemArr;
  })();

  opCustomFormItems.value = {'roleMenus':roleMeus}

  defaultCheckedKeys.value = [];
  await getAllmenus();
  let arrayDefaultCheck = [];
  if (opera === 'add') {
    opFnName.value = insertRole;
    opFormItems.value = opFormItems.value.map((item: any) => {
      item.value = '';
      return item;
    });
    opFormDialog.value.title = '新增';
    opFormDialog.value.buttonTitle = '新增';

  } else if (opera === 'edit') {
    opFnName.value = modifyRole;
    opFormItems.value = opFormItems.value.map((item: any) => {
      item.value = param[item.prop];
      return item;
    });
    // 转换显示自定义所属按钮

    // param.roleMenus.forEach(item => {
    //   if (item.menuFid !== 0) {
    //     arrayDefaultCheck.push(item.menuId + ',' + item.menuTitle);
    //   }
    // });

    arrayDefaultCheck = getBelongMenu(param.roleMenus);

    opFormDialog.value.title = '修改';
    opFormDialog.value.buttonTitle = '修改';
  }
  defaultCheckedKeys.value = arrayDefaultCheck;
  opFormDialog.value.visible = true;


  function getBelongMenu(menuList: any[]) {
    let btnBelongList: any[] = [];
    if (menuList && menuList.length !== 0) {
      menuList.forEach(item => {
        const btns: any[] = item.rolebuttonsList.map((i: any) => {
          return `${item.menuId},${item.menuTitle},${i.buttonType},${i.buttonName}`;
        });
        btnBelongList.push(...btns);
      });
    }
    return btnBelongList;
  }


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
  comFnName.value = deleteData;
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
const getBtnList = (title: string, data: any) => {
  if (data.menubuttonList && data.menubuttonList.length !== 0) {
    return data.menubuttonList.map((item: any) => {
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
  menuDataList.value = data.data.map((item: any) => {
    let res: { id: string; label: string; children: any[] } = { id: '', label: '', children: [] };
    res.id = item.id + ',' + item.title;
    res.label = item.title;
    res.children = [];
    item.children.forEach((it: any) => {
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
const insertBunList = (data: any, menuList: any[]) => {
  let res = menuList.filter((item: any) => {
    return item.indexOf(data) > -1 && item !== data;
  }).map((item: any) => {
    let arr = item.split(',');
    return {
      'buttonName': arr[3],
      'buttonType': arr[2]
    };
  });
  return res;
};

onMounted(() => {
  getListFnName.value = getRolePages;

  opFormItems.value = [
    { prop: 'id', value: '' },
    { label: '角色名称', prop: 'roleName', type: 'input' },
    { label: '角色描述', prop: 'roleDesc', type: 'input' }
  ];
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
