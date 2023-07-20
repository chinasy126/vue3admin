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
      :draggable='true'
      v-if='tableVisible'
      :rowKey='(record:any) =>{ return  record.id}'
      :columns='columns'
      :data-source='dataSource'
      @selection-change='handleSelectionChange'
      @changeSize='changeSize'
      @changeNum='changeNum'
      :table-loading='searchBtnLoading'
      @moveIndex='moveSortFn'
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
      @onChangeSelect='onChangeMenuSelect'
      @opCloseForm='opCloseForm'
      @onFormSubmit='onSubmit'
    >
      <!--      <template v-slot:-1>-->
      <!--        <template v-if='showMenuBtnVisible'>-->
      <!--          &lt;!&ndash; 一级菜单 &ndash;&gt;-->
      <!--          <el-form-item label='父级菜单' prop='parentMenu'-->

      <!--          >-->
      <!--            <el-select @change='getSecondsMenuByMenuId' v-model='opCustomFormItems.parentMenu' placeholder='请选择'-->
      <!--                       clearable-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for='item in firMenuList'-->
      <!--                :key='item.id'-->
      <!--                :label='item.title'-->
      <!--                :value='item.id'-->
      <!--              >-->
      <!--              </el-option>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          &lt;!&ndash; 二级菜单 &ndash;&gt;-->
      <!--          <el-form-item label='二级菜单' prop='menuId'>-->
      <!--            <el-select v-model='opCustomFormItems.menuId' placeholder='请选择' clearable>-->
      <!--              <el-option-->
      <!--                v-for='item in secMenuList'-->
      <!--                :key='item.id'-->
      <!--                :label='item.title'-->
      <!--                :value='item.id'-->
      <!--              >-->
      <!--              </el-option>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          &lt;!&ndash; 按钮名称 &ndash;&gt;-->
      <!--          <el-form-item label='按钮名称' prop='name'>-->
      <!--            <el-input v-model='opCustomFormItems.name' clearable />-->
      <!--          </el-form-item>-->
      <!--          &lt;!&ndash; 按钮type                          :rules="[{ required: true, message: '请选输入按钮类别', trigger: 'blur' }]"-->
      <!-- &ndash;&gt;-->
      <!--          <el-form-item label='按钮type' prop='type'-->
      <!--          >-->
      <!--            <el-input v-model='opCustomFormItems.type' clearable />-->
      <!--          </el-form-item>-->
      <!--        </template>-->
      <!--      </template>-->
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
import { onMounted, Ref, ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import TablePannel from '@/components/TablePannel/index.vue';
import SearchPanel from '@/components/SearchPanel/index.vue';
// E 搜索+表格
//import FormPannel from '@/components/FormPannel/index.vue';
import opFormComponent from '@/mixins/opFormComponent';
import FormPannel from '@/components/FormPannel/FormPannel.vue';
import Perbutton from '@/components/Permission/Button/index.vue';
// import Perbutton from '@/components/Permission/Button/perButton';
import CommonAction from '@/components/CommonAction/index.vue';
import comActionComponent from '@/mixins/comActionComponent';
import queryListComponent from '@/mixins/queryListComponent';
import { dynamicRoutes } from '@/router/index';
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

const searchFormRef = ref(ElForm); // 重置
const insertFormDataRef = ref(ElForm);
const categoryAllList:Ref<any[]> = ref([]);
// 展示添加按钮表单
const showMenuBtnVisible = ref<Boolean>(false);

// S 搜索+表格


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


// 刷新table

const tableVisible: Ref<boolean> = ref(true);

let { opFormDialog, opFnName, onFormSubmit, opCloseForm, opFormItems } = opFormComponent();
// E 新增+修改
// S 弹框操作
const { comActionDialog, comActionCondition, comFnName } = comActionComponent();
// E 弹框操作

// 调取API
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
const opFormRules = ref({});

const menuDataList = ref([]); // 菜单复选框
// 菜单复选框默认选择
const defaultCheckedKeys: Ref<any[]> = ref([]);
const tree = ref(ElForm);
// 插槽的表单内容
const opCustomFormItems: any = ref({});


// 编辑表单的项目
const opAddFormItems = [
  { prop: 'id', value: '' },
  { label: '父级菜单', prop: 'parentMenu', type: 'select' },
  { label: '菜单名称', prop: 'title', type: 'input' },
  { label: '菜单Name', prop: 'name', type: 'input' },
  { label: '菜单排序', prop: 'menuOrder', type: 'number', value: 0 }
];

// 获取所有分类并且设置

const setAllCategory = async () => {
  const { data: { data: categoryList } } = await category();
  return categoryList;
};

/**
 *
 * 转换下拉框分类
 *
 */
const getSelectCategory = async () => {
  const categoryList = await setAllCategory();
  categoryAllList.value = categoryList;
  return categoryList.map((item: any) => {
    return {
      value: item.id,
      label: item.title
    };
  });
};


/**
 * 新增修改操作
 * @param opera
 * @param param
 */
const opearDialog = async (opera: string, param: any) => {
  opFormItems.value = [];
  opFormRules.value = {};
  // 设置表单内容
  setTimeout(async () => {
    // 用户区别一级菜单，二级菜单
    showMenuBtnVisible.value = false;
    // 表演验证规则
    opFormRules.value = {
      title: [{ required: true, message: '请选输入菜单名称', trigger: 'blur' }],
      name: [{ required: true, message: '请选输入菜单name', trigger: 'blur' }]
    };
    opFormItems.value = opAddFormItems;
    // 设置下拉框
    opFormItems.value[1].selectValue = await getSelectCategory();
    // 设置保存方法
    opFnName.value = saveOrUpdate;
    if (opera === 'add') {
      // 新增操作
      opFormItems.value = opFormItems.value.map(item => {
        item.value = item.prop !== 'menuOrder' ? '' : 0;
        return item;
      });
      opFormDialog.value.title = '新增';
      opFormDialog.value.buttonTitle = '新增';
    } else if (opera === 'edit') {
      // 赋值初始值
      opFormItems.value = opFormItems.value.map(item => {
        item.value = param[item.prop];
        return item;
      });
      opFormDialog.value.title = '修改';
      opFormDialog.value.buttonTitle = '修改';
    }
    opFormDialog.value.visible = true;
  });

};

/**
 *  操作后刷新列表
 */
const refreshList = () => {
  // comActionDialog.value = { visible: false };
  comActionDialog.value.visible = false;
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
  comActionCondition.value = { id: params.id };
};


/**
 * 删除按钮
 * @param param
 */
const deleteBtnFn = (param: any) => {
  comActionCondition.value = { id: param };
  comFnName.value = deleteBtn;
  comActionDialog.value = {
    title: '删除按钮',
    visible: true,
    buttonTitle: '按钮删除',
    message: '是否确认删除该按钮?'
  };
};


/**
 *  批量新增菜单
 */
const handleBatch = () => {
  const routesList = getMenuLevel(dynamicRoutes);

  function getMenuLevel(dynamicRoutes: any) {
    return dynamicRoutes.map((item: any) => {
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
        btnList = buttonList.map((item: { title: string; type: string }) => {
          return {
            title: item.title,
            type: item.type
          };
        });
      }
      return btnList;
    }

  }

  batchMenuSave(routesList).finally(() => {
    ElMessage.success(`批量新增菜单成功!`);
    setTimeout(() => {
      getItemList();
    });
  });


};

/**
 * 表单提交
 * @param params
 */
const onSubmit = async (params: any) => {
  try {
    const actionFunction: Function = showMenuBtnVisible.value ? indertBtn : saveOrUpdate;
    // 名称 name 转换一下
    params.parentMenu = categoryAllList.value.filter((item: any) => item.id === params.parentMenu).map((item: any) => `${item.title},${item.name}`).join('');
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
 *
 * 添加按钮的验证规则
 *
 */
const addBtnRule = {
  parentMenu: [{ required: true, message: '请选选择父级菜单', trigger: 'change' }],
  name: [{ required: true, message: '请选输入按钮名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选输入按钮类别', trigger: 'blur' }]
};

/**
 *
 * 添加按钮的弹窗
 *
 */
const opDialogAddBtn = async () => {
  opFormItems.value = [];
  opFormRules.value = {};
  // 按钮验证规则
  opFormRules.value = addBtnRule;
  // 从接口获取一级菜单列表
  const { data: { data: menuList } } = await category();
  const menuBtnMenuSelect = menuList.map((item: any) => {
      return {
        value: item.id,
        label: item.title
      };
    }
  );
  // 设置表单每一项
  opFormItems.value = [
    { label: '父级菜单', prop: 'parentMenu', type: 'select', selectValue: menuBtnMenuSelect },
    { label: '二级菜单', prop: 'menuId', type: 'select' },
    { label: '按钮名称', prop: 'name', type: 'input' },
    { label: '按钮type', prop: 'type', type: 'input' }
  ];
  // 展示弹窗显示表单
  opFormDialog.value.visible = true;
  showMenuBtnVisible.value = true;
};

/**
 *
 *  切换下拉框的方法用于一些操作
 *
 */

const onChangeMenuSelect = async (val: any, item: any, opForm: any) => {


  // 判断一级切换
  if (item.prop === 'parentMenu' && showMenuBtnVisible.value) {
    // 给与表单赋值
    opFormItems.value[1].value = '';
    opFormItems.value[0].value = val; // 默认赋值
    opFormItems.value[2].value = opForm['name'];
    opFormItems.value[3].value = opForm['type'];

    // 二级菜单下拉查询
    if (val !== '') {
      const { data: { data: menuList } } = await getSecMenuList({ id: val });
      opFormItems.value[1].selectValue = menuList.map( (item:any) => {
        return {
          value: item.id,
          label: item.title
        };
      });
    } else {
      opFormItems.value[1].selectValue = [];
    }
  }
};


/**
 * 批量删除
 */
const batchDelete = () => {
  const ids = selectItemList.value.map((item: any) => item.id);
  comFnName.value = dataBatchDelete;
  comActionDialog.value = {
    title: '批量删除',
    visible: true,
    buttonTitle: '批量删除',
    message: '是否确认批量删除内容?'
  };
  comActionCondition.value = { 'ids': ids };
};

/**
 *  移动的排序
 */
// S 移动排序
const moveSortFn = (param: any) => {
  tableVisible.value = false;
  let { newIndex, oldIndex } = param;

  /**
   *  将table数据展开
   */
  const expandData = function() {
    let tableData: any[] = [];
    dataSource.value.map((item) => {
      tableData.push(...expandArray(item));
    });

    /**
     * 子项数据展开
     */
    function expandArray(param: any) {
      let subArray = [];
      subArray.push(param);
      if (param.children.length !== 0) {
        param.children.map((item: any) => {
          subArray.push(item);
        });
      }
      return subArray;
    }

    return tableData;
  };


  // 自下而上 oldIndex 原有数据   newIndex 新排位置的数据
  let postData = expandData()[oldIndex];
  if (expandData()[oldIndex]['fid'] !== expandData()[newIndex]['fid']) {
    postData['fid'] = expandData()[newIndex]['fid'];
  }

  if (oldIndex > newIndex) {
    // 先查看 fid  如果原有fid是0 目标fid0 则修改menuOrder ，  原有fid不是 0   目标是0  则修改fid menuOrder ,  原有fid 与目标 fid 不一样
    postData['menuOrder'] = expandData()[newIndex]['menuOrder'] + 1;
  } else if (oldIndex < newIndex) { // 自上而下
    if (expandData()[newIndex]['menuOrder'] > 0) {
      postData['menuOrder'] = expandData()[newIndex]['menuOrder'] - 1;
    } else {
      postData['menuOrder'] = 0;
    }
  }
  saveOrUpdate(postData).finally(() => {
    getItemList();
  }).finally(() => {
    tableVisible.value = true;
  });
};

// E 移动排序

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
