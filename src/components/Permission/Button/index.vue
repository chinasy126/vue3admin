<template>
  <el-tag closable :type='tagType' @close='closeTag'>{{ props.name }}</el-tag>
</template>

<script setup lang='ts'>
import { defineProps, defineEmits, computed } from 'vue';


const emit = defineEmits(['close']);


/**
 * 关闭删除事件
 */
const closeTag = () => {
  emit('close', props.btnId);
};

const props = defineProps({
  name: {
    type: String,
    default: () => {
      return '';
    }
  },
  btnType: {
    type: String,
    default: () => {
      return '';
    }
  },
  btnId: {
    type: String,
    default: ''
  }
});

const tagType = computed(() => {
  const btnType = props.btnType;
  let type = 'success';
  switch (btnType) {
    case 'delete':
      type = 'danger';
      break;
    case 'edit':
      type = 'warning';
      break;
    case 'export':
      type = 'info';
      break;
    case 'import':
      type = 'info';
      break;
    case 'add':
      type = 'success';
      break;
    case 'batchDeletion':
      type = 'danger';
      break;
    default:
      type = 'success';
  }
  return type;
});

</script>

<style scoped lang='less'>

.el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
}

</style>
