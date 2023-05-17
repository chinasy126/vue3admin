<template>
  <div>
    <!-- S 上传按钮 -->
    <el-upload class='upload-demo'
               :http-request='httpRequest'
               :show-file-list='false'
               :file-list='fileList'
               v-model:file-list='fileList'
    >
      <el-button type='primary'>{{ uploadBtnName }}</el-button>
    </el-upload>
    <!-- E 上传按钮 -->

    <!-- S 文件列表显示区域 -->
    <div v-if="uploadDisplayType === 'file'">
      <ul class='el-upload-list el-upload-list--text' v-if='uploadImgUrl' v-for='(item,index) in uploadImgUrl'
          :key='index'
      >
        <li class='el-upload-list__item is-success'>
          <a class='el-upload-list__item-name' @click='showImgDialog(item)'>
            <el-icon>
              <Document />
            </el-icon>
            {{ item.url }}
          </a>
          <label class='el-upload-list__item-status-label'>
            <i class='el-icon-upload-success el-icon-circle-check'></i>
          </label>
          <el-icon>
            <CircleClose @click='deleteImg(item)' />
          </el-icon>
        </li>
      </ul>
    </div>
    <!-- E 文件列表显示区域 -->

    <!-- S 图片列表显示区域 -->
    <div v-if="uploadDisplayType === 'picture'">
      <ul class='el-upload-list el-upload-list--picture-card' v-if='uploadImgUrl'>
        <li class='el-upload-list__item is-ready' v-for='(item,index) in uploadImgUrl' :key='index'>
          <div>
            <el-image
              :src='item.url' name='uploadImgUrl'
              class='el-upload-list__item-thumbnail'
            ></el-image>
            <span class='el-upload-list__item-actions'>
              <!-- 放大 -->
                <span class='el-upload-list__item-preview' @click='showImgDialog(item)'>
                  <i class='el-icon-zoom-in'></i>
                </span>
              <!-- 删除 -->
                <span class='el-upload-list__item-delete' @click='deleteImg(item)'>
                  <i class='el-icon-delete'></i>
                </span>
              </span>
          </div>
        </li>
      </ul>
      <el-progress style='margin: 5px;' v-else-if='uploadImgIsUploading' type='circle'
                   :percentage='uploadImgPercentage'
      ></el-progress>
    </div>
    <!-- E 图片列表显示区域 -->

    <!-- S 放大图片显示区域 -->
    <el-dialog title='查看图片' v-model='dialogVisible' :modal='false'>
      <el-image width='100%' :src='dialogImg'></el-image>

    </el-dialog>
    <!-- E 放大图片显示区域 -->

  </div>

</template>
<script lang='ts' setup>
import { watchEffect, computed, ref, defineEmits, watch, onMounted } from 'vue';
import type { UploadProps, UploadUserFile } from 'element-plus';
import { ElForm, ElMessage, ElMessageBox, UploadRequestOptions } from 'element-plus';
import { uploadImg } from '@/api/upload/uploadFile';
import { Message } from 'postcss';

const emit = defineEmits(['uploadSuccess', 'uploadSuccess']);
const prop = defineProps({
  uploadBtnName: {
    type: String,
    default: () => {
      return '上传图片';
    }
  },
  uploadImgList: {
    type: Array,
    default: () => {
      return [];
    }
  },
  uploadFolderName: {
    type: String,
    default: 'images'
  },
  // 允许上传个数
  uploadLimit: {
    type: Number,
    default: () => {
      return 1; // -1 无限制
    }
  },
  // 上传之后显示的类型
  uploadDisplayType: {
    type: String,
    default: () => {
      return 'file'; // picture
    }
  }
});


const dialogVisible: boolean = ref(false);
const dialogImg: string = ref('');
const uploadImgUrl: String[] = ref([]);
const supportType = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * 上传图片接口
 * @param param
 */
const httpRequest = (param: UploadRequestOptions): Promise<any> => {
  const isLt10M = param.file.size / 1024 / 1024 < 4;
  /* 对上传图片的大小和格式校验 */
  if (supportType.indexOf(param.file.type) == -1) {
    let supportType = supportType;
    let msg = '';
    supportType.map(res => {
      msg += res.substring(6) + '/';
    });
    let newMsg = msg.slice(0, (msg.length) - 1);
    ElMessage.error(`请上传正确的文件格式！支持的格式有：` + newMsg);
    return;
  }
  if (!isLt10M) {
    ElMessage.error(`上传图片大小不能超过 ${limitSize} MB!`);
    return;
  }

  const form = new FormData();
  form.append('file', param.file);
  form.append('type', prop.uploadFolderName); // 文件类型拆分文件夹

  uploadImg(form, {
    // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
    headers: {
      // 表示上传的是文件,而不是普通的表单数据
      'Content-Type': 'multipart/form-data',
      'X-Token': window.localStorage.getItem('token')
    }
  }).then(res => {
    if (res.data.file) {
      // 显示图片上传
      if (prop.uploadLimit > 1) {
        uploadImgUrl.value.push({ 'url': res.data.file });
      } else {
        uploadImgUrl.value = [{ 'url': res.data.file }];
      }
      emit('uploadSuccess', uploadImgUrl.value, 'upload');
    } else {
      ElMessage.error(`上传文件错误`);
    }
  });
};

/**
 *  删除图片
 */
const deleteImg = (item: any) => {
  uploadImgUrl.value = uploadImgUrl.value.filter(i => {
    return i.url !== item.url;
  });
  emit('uploadSuccess', uploadImgUrl.value, 'upload');
};
/**
 *  打开图片对话框
 */
const showImgDialog = (item) => {
  dialogVisible.value = true;
  dialogImg.value = item.url;
};


const fileList = ref<UploadUserFile[]>([]);

watch(
  () => prop.uploadImgList,
  (newVal, oldVal) => {
    uploadImgUrl.value = newVal;
  }, { deep: true, immediate: true }
);
</script>
