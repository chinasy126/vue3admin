<template>
  <div>
    <el-upload class='upload-demo'
               :action='uploadImageApi'
               :on-preview='handlePreview'
               :on-remove='handleRemove'
               multiple
               :limit='limit'
               :on-exceed='handleExceed'
               :on-success='handleAvatarSuccess'
               :on-change='handleChange'
               :file-list='fileList'
               :headers='headers'
               v-model:file-list='fileList'
    >
      <el-button type='primary'>上传图片</el-button>
    </el-upload>
    <el-dialog v-model='dialogVisible' :modal="false">
      <el-image width="100%" :src="dialogImageUrl"></el-image>
    </el-dialog>
  </div>

</template>
<script lang='ts' setup>
import {computed, ref, defineEmits, watch} from 'vue';
import type {UploadProps, UploadUserFile} from 'element-plus';
import {ElForm, ElMessage, ElMessageBox} from 'element-plus';

const emit = defineEmits(['uploadSuccess', 'uploadSuccess']);
const dialogImageUrl = ref('')
const limit = ref(1);
const dialogVisible = ref(false);

const imageUrl = import.meta.env.VITE_APP_BASE_IMAGE_URL

const prop = defineProps({
  img: {
    type: String,
    default: () => {
      return ''
    }
  }
})

const headers = computed(() => {
  const jwt = window.localStorage.getItem('token');
  return {'X-Token': jwt};
});

const fileList = ref<UploadUserFile[]>([]);
const uploadImageApi = '/api' + '/uploadimg';

watch(() => prop.img, (newVal) => {
  if (newVal) {
    fileList.value = [{name: newVal, response: {returnObj: {fileName: newVal}}}]
  } else {
    fileList.value = []
  }
}, {
  immediate: true
})

/**
 * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
 * @param file
 * @param fileList
 */
const handleChange = (file, fileList) => {
  fileList.value = fileList.slice(-3);
};

/**
 * 文件列表移除文件时的钩子
 * @param file
 * @param uploadFiles
 */

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  emit('uploadSuccess', '')
};

/**
 * 文件上传成功时的钩子
 * @param res
 * @param file
 */

const handleAvatarSuccess = (res, file) => {
  emit('uploadSuccess', res.returnObj.fileName);
};

/**
 * 点击文件列表中已上传的文件时的钩子
 * @param file
 */

const handlePreview: UploadProps['onPreview'] = (file: any) => {
  dialogVisible.value = true
  dialogImageUrl.value = `${imageUrl}${file.response.returnObj.fileName}`
};

/**
 * 当超出限制时，执行的钩子函数
 * @param files
 * @param uploadFiles
 */

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `当前限制选择 ${limit.value} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.value.length} 个文件`
  )
};

</script>
