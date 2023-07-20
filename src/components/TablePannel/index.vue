<template>
  <div>
    <el-card class='box-card draggable'>
      <el-table
        :rowKey='rowKey'
        v-loading='tableLoading'
        :data='dataSource'
        ref='tableRef'
        @selection-change='handleSelectionChange'
        :header-cell-style="{ background:'#eee'}"
        border
        fit
        stripe
        highlight-current-row
        style='width: 100%'>

        <!-- 是否有多选 -->
        <el-table-column
          v-if='isSelection'
          :selectable='selectable'
          type='selection'
          :width='50'
          align='center'
        />
        <!-- 是否需要序号 -->
        <el-table-column v-if='isShowIndex' type='index' label='序号' width='55' align='center' />
        <!-- 插槽 -->
        <template v-for='item in columns'>
          <!-- 表格的列展示 特殊情况处理 比如要输入框 显示图片 插槽 -->
          <el-table-column v-if='item.isSlot' :key='item.prop' v-bind='item' :fixed='item.fixed' :width='item.width'>
            <template #default='scope'>
              <slot :name='item.prop' :scope='scope.row'></slot>
            </template>
          </el-table-column>
          <!-- 大部分适用 -->
          <el-table-column
            v-if='!item.isSlot'
            :key='item.prop'
            v-bind='item'
            align='center'
            show-overflow-tooltip
            :width='item.width'
          />
        </template>

      </el-table>
    </el-card>

  </div>


</template>

<script setup lang='ts'>

import { defineProps, defineEmits } from 'vue';

import Sortable from 'sortablejs/modular/sortable.core.esm.js';
//import Sortable from './index';

import { reactive, onMounted } from 'vue';
import { number } from 'echarts/core';


/**
 *
 * 行拖拽
 *
 */
const rowDrop = function() {
  // 要拖拽元素的父容器
  const tbody = document.querySelector('.draggable .el-table__body-wrapper tbody');
  Sortable.create(tbody, {
    //  可被拖拽的子元素
    draggable: '.draggable .el-table__row',
    onEnd({ newIndex, oldIndex }: { newIndex: number, oldIndex: number }) {
      emit('moveIndex', { 'newIndex': newIndex, 'oldIndex': oldIndex });
    }
  });
};


onMounted(() => {

  if (prop.draggable) {
    rowDrop();
  }
});

const prop = defineProps({
  rowKey: {},
  tableLoading: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  draggable: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  // 是否显示序列号
  isShowIndex: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  // 是否多选
  isSelection: {
    type: Boolean,
    default: () => {
      return true;
    }
  },
  // 有多少列
  columns: {
    type: Array,
    default: () => {
      return [];
    }
  },
  //  表格数据和表格部分属性的对象
  dataSource: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const emit = defineEmits(['selectionChange', 'moveIndex']);

/**
 * 哪一行不可选
 * @param row
 * @param index
 * @returns {boolean}
 */
const selectable = (row: any, index: number) => {
  return true;
  if (index == 1) {
    return false;
  } else {
    return true;
  }
};

/**
 * 多选，选择了哪些行
 * @param val
 */
const handleSelectionChange = (val: any) => {
  emit('selectionChange', val);
};


</script>

<style scoped lang='less'>
.pagination {
  padding: 0px 20px 0px 20px;
}
</style>
