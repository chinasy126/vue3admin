<template>
  <el-form
    ref='ruleFormRef'
    :model='ruleForm'
    :rules='rules'
    label-width='80px'
    class='demo-ruleForm'
    status-icon
  >
    <el-form-item label='原密码' prop='oldPassword'>
      <el-input
        clearable
        type='password'
        v-model='ruleForm.oldPassword' show-password />
    </el-form-item>

    <el-form-item label='新密码' prop='newPassword'>
      <el-input
        clearable
        type='password'
        v-model='ruleForm.newPassword' show-password />
    </el-form-item>

    <el-form-item label='确认密码' prop='confirmPassword'>
      <el-input
        clearable
        type='password'
        v-model='ruleForm.confirmPassword' show-password />
    </el-form-item>


    <el-form-item>
      <el-button type='primary' @click='submitForm(ruleFormRef)'>
        修改
      </el-button>
      <el-button @click='resetForm(ruleFormRef)'>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { checkOldPassword, modifyPassword } from '@/api/user';
import { UserOldPassword } from '@/api/user/types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/modules/user';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const tagsViewStore = useTagsViewStore();
const route = useRoute();
const router = useRouter();

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const checkNewpassword = (rule, value, callback) => {
  if (value === '' || value.length < 6) {
    return callback(new Error('确认密码最小为6位数'));
  }
  return callback();
};

const checkConfirmPassword = (rule, value, callback) => {
  if (value === '' || value.length < 6) {
    return callback(new Error('确认密码最小为6位数'));
  }
  if (ruleForm.newPassword !== ruleForm.confirmPassword) {
    return callback(new Error('两次密码输入不一致'));
  }
  return callback();
};

const checkOldpassword = async (rule: any, value: string, callback: Function) => {
  if (value === '') {
    return callback(new Error('请输入旧密码!'));
  }
  const postData: UserOldPassword = { 'password': value };
  const result = await checkOldPassword(postData);
  if (result.code !== 20000) {
    return callback(new Error('旧密码输入错误!'));
  }
  return callback();
};

const rules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入旧密码!', trigger: 'blur' },
    { validator: checkOldpassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码!', trigger: 'blur' },
    { validator: checkNewpassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码!', trigger: 'blur' },
    { validator: checkConfirmPassword, trigger: 'blur' }
  ]

});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const postData: UserOldPassword = { 'password': ruleForm.newPassword };
      modifyPassword(postData).then(() => {
        ElMessage.success('修改密码成功!');
      }).finally(() => {
        userStore
          .logout()
          .then(() => {
            tagsViewStore.delAllViews();
          })
          .then(() => {
            setTimeout(() => {
              router.push(`/login?redirect=${route.fullPath}`);
            },1000);
          });
      });
    } else {
      // ElMessage.error('输入密码错误');
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

</script>
