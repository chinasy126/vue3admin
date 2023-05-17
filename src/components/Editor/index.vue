<template>
  <div class='editorBody'>
    <!-- 工具栏 -->
    <Toolbar :editor='editorRef' :defaultConfig='toolbarConfig' style='border-bottom: 1px solid #ccc' :mode='mode' />
    <!-- 编辑器 -->
    <Editor
      :defaultConfig='editorConfig'
      v-model='defaultHtml'
      @onChange='handleChange'
      style='height: auto; overflow-y: hidden'
      :mode='mode'
      @onCreated='handleCreated'
    />
  </div>
</template>

<script setup lang='ts'>

import { onBeforeUnmount, shallowRef, reactive, toRefs } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { uploadImg } from '@/api/upload/uploadFile';
// API 引用
import { uploadFileApi } from '@/api/file';

const props = defineProps({
  modelValue: {
    type: [String],
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const state = reactive({
  toolbarConfig: {},
  editorConfig: {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        // 自定义图片上传
        async customUpload(file: any, insertFn: any) {

          const form = new FormData();
          form.append('file', file);
          form.append('type', 'editor'); // 文件类型拆分文件夹

          const result = await uploadImg(form, {
            // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
            headers: {
              // 表示上传的是文件,而不是普通的表单数据
              'Content-Type': 'multipart/form-data',
              'X-Token': window.localStorage.getItem('token')
            }
          });
          insertFn(result.data.file);
        }


      }
    }
  },
  defaultHtml: props.modelValue,
  mode: 'default'
});

const { toolbarConfig, editorConfig, defaultHtml, mode } = toRefs(state);

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

function handleChange(editor: any) {
  emit('update:modelValue', editor.getHtml());
}


// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
</script>
<style src='@wangeditor/editor/dist/css/style.css'></style>
<style scoped lang='less'>
.editorBody {
  border: 1px solid #ccc;
  //width: 95%;
  margin: auto
}

</style>
