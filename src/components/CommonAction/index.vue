<template>
  <el-dialog
    v-model="comActionDialog.visible"
    :title="comActionDialog.title"
    width="30%"
    :before-close="handleClose"
  >
    <slot></slot>
    <span v-if="comActionDialog.message !== ''" v-html="comActionDialog.message"></span>
    <template #footer>
          <span class="dialog-footer">
    <el-button @click="handleClose()">取 消</el-button>
    <el-button @click="comConfirm" type="primary" :loading="comActionBtnLoading">
      {{ comActionDialog.buttonTitle }}
    </el-button>
  </span>
    </template>

  </el-dialog>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, onMounted} from "vue";
import {ElForm, ElMessage, ElMessageBox} from 'element-plus';

const emit = defineEmits(['refresh', 'cancel'])
const comActionBtnLoading = ref(false)
const visible1 = ref(true)

const prop = defineProps({
  // 弹出框显示条件
  comActionDialog: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 弹框操作里边的数据条件
  comActionCondition: {
    type: null,
    required: false
  },
  // 操作方法名称
  comFnName: {
    type: Function,
    default: () => {
      return () => {
      }
    }
  },
  // 显示文案
  message: {
    type: String,
    default: () => {
      return ''
    }
  },
  visible: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})

/**
 * 点击确认操作
 */
const comConfirm = () => {

  comActionBtnLoading.value = true
  prop.comFnName(prop.comActionCondition).then((res) => {
    if (res.code === 20000) {
      ElMessage({
        message: `操作成功`,
        type: 'success',
      })
      emit('cancel') //关闭提示弹框
      emit('refresh') //刷新页面
    } else {
      ElMessage({
        message: `${res.message}`,
        type: 'error',
      })
    }
  }).catch((e) => {
    ElMessage({
      message: `${e}`,
      type: 'error',
    })
  }).finally(() => {
    comActionBtnLoading.value = false
  })
}

/**
 * 关闭弹框
 */
const handleClose = () => {
  comActionBtnLoading.value = false
  emit('refresh') //刷新页面
}
onMounted(() => {
})

</script>

<style scoped>

</style>
