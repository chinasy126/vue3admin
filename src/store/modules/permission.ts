import {RouteRecordRaw} from 'vue-router';
import {defineStore} from 'pinia';
import {constantRoutes, dynamicRoutes} from '@/router';
import {store} from '@/store';
import {listRoutes} from '@/api/menu';
import {ref} from 'vue';
import {getToken} from '@/utils/auth';
import {routerListToRank, filterAsyncRoute, changePeriBtnList} from '@/utils/router';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');

const hasPermission = (roles: string[], route: RouteRecordRaw) => {

  if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      return true;
    }
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }
  return false;
};


// setup
export const usePermissionStore = defineStore('permission', () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);
  const addRoutes = ref<RouteRecordRaw[]>([]);

  const permissionRoutes = ref<any[]>([]);
  // 按钮权限
  const permissionButton = ref<any[]>([])

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    addRoutes.value = newRoutes;
    permissionRoutes.value = newRoutes;
    routes.value = constantRoutes.concat(newRoutes);
  }

  /**
   * 通过用户获取动态路由信息
   * @param roles
   */
  function generateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      listRoutes()
        .then(response => {
          const {data: {data: {menusList}}} = response;
          // const asyncRoutes = response.data;
          // 给导航使用
          const menuRoute = filterAsyncRoute(menusList);
          setRoutes(menuRoute);

          // 导航变成层级结构
          const accessedRoutes: any[] = routerListToRank(menusList);
          permissionRoutes.value = accessedRoutes;

          // 组成按钮权限
          permissionButton.value = changePeriBtnList(menusList)

          resolve(accessedRoutes);
        })
        .catch(error => {
          reject(error);
        });
    });
  }


  return {routes, setRoutes, generateRoutes, permissionRoutes, permissionButton};
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
