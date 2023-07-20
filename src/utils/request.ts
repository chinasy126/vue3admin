import axios, {AxiosRequestConfig, AxiosResponse,InternalAxiosRequestConfig} from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getToken} from '@/utils/auth';
import {useUserStoreHook} from '@/store/modules/user';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: {'Content-Type': 'application/json;charset=utf-8'}
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const user = useUserStoreHook();
    if (user.token) {
     // (config.headers as any).Authorization = getToken();
      (config.headers as any)['X-Token'] = getToken();
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const {code, message} = response.data;
    if (code === 20000) {
      return response.data;
    } else {
      // 判断二进制
      const indexs = response.config.responseType
      if (indexs === 'blob') {
        return Promise.resolve(response)
      }

      // 响应数据为二进制流处理(Excel导出)
      // if (response.data instanceof ArrayBuffer) {
      //   return response;
      // }

      ElMessage({
        message: message || '系统出错',
        type: 'error'
      });
      return Promise.reject(new Error(message || 'Error'));
    }
  },
  (error: any) => {
    if (error.response.data) {
      const {code, message} = error.response.data;
      // token 过期,重新登录
      if (code === 'A0230') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).then(() => {
          localStorage.clear();
          window.location.href = '/';
        });
      } else {
        ElMessage({
          message: message || '系统出错',
          type: 'error'
        });
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
