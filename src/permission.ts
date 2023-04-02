import router from '@/router';
import { RouteRecordRaw } from 'vue-router';
import { useUserStoreHook } from '@/store/modules/user';
import { usePermissionStoreHook } from '@/store/modules/permission';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getRouterToShow } from '@/utils/router';

NProgress.configure({ showSpinner: false }); // 进度条

const permissionStore = usePermissionStoreHook();

// 白名单路由
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const userStore = useUserStoreHook();

  // 检测是否有token / 没有token 跳转登录携带者当前URl
  if (userStore.token) {
    // 如果存在token 是登录页页面直接跳转首页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      // 登录页后获取不到用户名重新获取用户信息
      const hasGetUserInfo = userStore.nickname;
      if (hasGetUserInfo) {
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name as any }) : next('/401');
        } else {
          next();
        }
      } else {
        try {
          // 获取用户信息
          await userStore.getInfo();
          // 获取角色菜单
          await permissionStore.generateRoutes();
          // 获取所有后端返回菜单
          const permissionRoutes = permissionStore.permissionRoutes;
          // 生成可用的路由
          const accessRoutes: RouteRecordRaw[] = getRouterToShow(permissionRoutes);

          // const accessRoutes: RouteRecordRaw[] = await permissionStore.generateRoutes();
          // const accessRoutes1: RouteRecordRaw[] = await permissionStore.generateRoutes1();

          accessRoutes.forEach((route: any) => {
            router.addRoute(route);
          });

          next({ ...to, replace: true });
        } catch (error) {
          // 移除 token 并跳转登录页
          await userStore.resetToken();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
