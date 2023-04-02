<template>
  <el-upload :on-success='onSuccess' :show-file-list='false'
             :http-request='httpRequest'
             :headers='headers'>
    <el-button type='primary' style='margin-left: 10px; margin-right: 10px;'>
      <slot></slot>
    </el-button>
  </el-upload>
</template>

<script setup lang='ts'>
import { defineProps, defineEmits, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['onUploadFileSuccess']);

const props = defineProps({
  // 弹出框显示条件
  buttonName: {
    type: String,
    default: '导入'
  },
  fileUploadFnName: {
    type: Function,
    default: () => {
      return () => {
      };
    }
  }
});

const importExcelUrl = () => {

};

const onSuccess = () => {

};

const httpRequest = (param) => {

  const form = new FormData();
  form.append('file', param.file);
  console.log(form);
  props.fileUploadFnName(
    form,
    {
      // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
      headers: {
        // 表示上传的是文件,而不是普通的表单数据
        'Content-Type': 'multipart/form-data',
        'X-Token': window.localStorage.getItem('token')
      }
    },
    progress => {
      console.log(progress);
    }
  ).then(res => {
    ElMessage.success('导入成功!');
    emit('onUploadFileSuccess', 'success');
  });
};

onMounted(() => {

});

// 上传文件HEADER传递内容
const headers = computed(() => {
  const jwt = window.localStorage.getItem('token');
  return { 'X-Token': jwt };
});

</script>

<style scoped>


</style>
