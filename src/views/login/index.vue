<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>

      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginData.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-tooltip
        :disabled="capslockTooltipDisabled"
        content="Caps lock is On"
        placement="right"
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            ref="passwordRef"
            :key="passwordType"
            v-model="loginData.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup="checkCapslock"
            @blur="capslockTooltipDisabled = true"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <div class="codeBd">
        <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
          <el-input placeholder="验证码"
                    tabindex="3"
                    type="text"
                    name="code"
                    v-model="loginData.code"/>
        </el-form-item>
        <img :src="imgSrc" @click="getLoginCode()"/>
      </div>


      <el-button
        size="default"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.prevent="handleLogin"
      >{{ $t('login.login') }}
      </el-button>

    </el-form>

  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, toRefs, watch, nextTick} from 'vue';

// 组件依赖
import {ElForm, ElInput} from 'element-plus';
import router from '@/router';
import LangSelect from '@/components/LangSelect/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

// 状态管理依赖
import {useUserStore} from '@/store/modules/user';

// API依赖
import {useRoute} from 'vue-router';
import {LoginData} from '@/api/auth/types';
import {getVerificationCode} from "@/api/user";

const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

import {getToken, setToken, removeToken} from '@/utils/auth';
import * as console from "console";

const state = reactive({
  imgSrc: '',
  redirect: '',
  loginData: {
    username: '',
    password: '',
    code: ''
  } as LoginData,
  loginRules: {
    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
    password: [{
      required: true, message: '密码不能为空', trigger: 'blur',
      validator: validatePassword
    }],
    code: [{
      require: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }]
  },
  loading: false,
  passwordType: 'password',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showCopyright: true,
  showDialog: false
});

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 1) {
    callback(new Error('The password can not be less than 6 digits'));
  } else {
    callback();
  }
}

const {
  imgSrc,
  loginData,
  loginRules,
  loading,
  passwordType,
  capslockTooltipDisabled,
  showCopyright,
} = toRefs(state);

function checkCapslock(e: any) {
  const {key} = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z';
}

function showPwd() {
  if (passwordType.value === 'password') {
    passwordType.value = '';
  } else {
    passwordType.value = 'password';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

/**
 *  登录
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      userStore
        .login(state.loginData)
        .then(() => {
          router.push({path: state.redirect || '/', query: state.otherQuery});
          state.loading = false;
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

function getLoginCode() {
  getVerificationCode().then(({data}) => {
    const myBlob = new window.Blob([data], {type: 'image/jpeg'});
    const qrUrl = window.URL.createObjectURL(myBlob);
    state.imgSrc = qrUrl;
  })
  //   .catch(err => {
  //   console.log(err);
  // })

}

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  getLoginCode();
  window.onresize = () => {
    if (state.clientHeight > document.documentElement.clientHeight) {
      state.showCopyright = false;
    } else {
      state.showCopyright = true;
    }
  };
});
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    height: 36px;
    width: 85%;

    .el-input__wrapper {
      padding: 0;
      background: transparent;
      box-shadow: none;

      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        height: 36px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: var(--el-input-hover-border, var(--el-border-color-hover));
      box-shadow: none;
    }

    box-shadow: none;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}

.thirdparty-button {
  position: absolute;
  right: 40px;
  bottom: 6px;
}

@media only screen and (max-width: 470px) {
  .thirdparty-button {
    display: none;
  }
}

.codeBd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  div:nth-child(1) {
    margin-bottom: 0px;
    flex: 1;
  }

  img {
    cursor: pointer;
    margin-left: 10px;
  }
}

</style>
