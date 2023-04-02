import {defineStore} from 'pinia';

import {getToken, setToken, removeToken} from '@/utils/auth';
import {loginApi, logoutApi} from '@/api/auth';
import {getUserInfo} from '@/api/user';
import {resetRouter} from '@/router';
import {store} from '@/store';
import {LoginData} from '@/api/auth/types';
import {ref, reactive} from 'vue';
import {UserInfo} from '@/api/user/types';

export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string>(getToken() || '');
  const nickname = ref<string>('');
  const avatar = ref<string>('');
  // const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  // const perms = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限

  // actions

  // 登录
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      // 通过用户名密码获取用户登陆token
      loginApi(loginData)
        .then(async response => {
          const result = response.data;
          token.value = result.token;
          setToken(result.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getInfo() {
    return new Promise((resolve, reject) => {
      // let getToken = getToken();
      getUserInfo()
        .then((response: any) => {
          const {data} = response;
          let result = data;
          if (!data) {
            return reject('Verification failed, please Login again.');
          }
          nickname.value = data.name;
          avatar.value = data.avatar;
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 注销
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          resetRouter();
          resetToken();
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 重置
  function resetToken() {
    removeToken();
    token.value = '';
    nickname.value = '';
    avatar.value = '';
  }

  return {
    token,
    nickname,
    avatar,
    login,
    getInfo,
    logout,
    resetToken
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
