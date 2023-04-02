<template>
  <el-card class='pagination'>
    <!--      v-model:current-page="prop.pageNum"-->
    <!--      v-model:page-size="prop.pageSize"-->
    <el-pagination
      v-if='prop.total > 0'
      background
      :model-value:current-page='prop.pageNum'
      :model-value:page-size='prop.pageSize'
      :page-sizes='prop.pageSizes'
      small='small'
      layout='total, sizes, prev, pager, next, jumper'
      :total='prop.total'
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
    />
  </el-card>
</template>

<script setup lang='ts'>

import { defineEmits, defineProps } from 'vue';

const prop = defineProps({

  // 修改页数
  pageSizes: {
    type: Array,
    default: () => {
      return [5, 10, 15, 20];
    }
  },
  // 总页数
  total: {
    type: Number,
    default: () => {
      return 0;
    }
  },
  // 当前页
  pageNum: {
    type: Number,
    default: () => {
      return 0;
    }
  },
  // 一共多少页
  pageSize: {
    type: Number,
    default: () => {
      return 0;
    }
  }
});

const emit = defineEmits(['changeSize', 'changeNum']);

/**
 * 改变每页显示数量
 * @param val
 */
const handleSizeChange = (val: Number) => {
  emit('changeSize', val);
};


/**
 * 改变页面
 * @param val
 */
const handleCurrentChange = (val: Number) => {
  emit('changeNum', val);
};

</script>

<style scoped>

</style>
