import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import {usePermissionStoreHook} from '@/store/modules/permission';

export const Layout = () => import('@/layout/index.vue');

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {hidden: true},
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {hidden: true}
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {hidden: true}
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'homepage', affix: true}
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {hidden: true}
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    meta: {hidden: true},
    component: () => import('@/views/error-page/404.vue')//这个是我自己的路径
  },

];

export const adminRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {title: 'dashboard', icon: 'homepage', affix: true}
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        meta: {hidden: true}
      }
    ]
  },
];

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    'name': 'permissions',
    component: Layout,
    "meta": {
      "title": "系统管理",
      "icon": "system",
      "hidden": false,
      "alwaysShow": true,
      "keepAlive": true
    },
    "children": [
      {
        "path": "menu",
        "name": "menu",
        component: () => import('@/views/permission/menu/index.vue'),
        "meta": {
          "title": "菜单管理",
          "icon": "menu",
          'btnPermissions': [
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' },
            { title: '新增菜单', type: 'addMenu' },
            { title: '新增按钮', type: 'addButton' },
            { title: '批量删除', type: 'batchDelete' },
            { title: '批量同步', type: 'batchSync' }

          ]
        }
      },
      {
        "path": "role",
        component: () => import('@/views/permission/role/index.vue'),
        "name": "role",
        "meta": {
          "title": "角色管理",
          "icon": "role",
          btnPermissions: [
            { title: '新增', type: 'add' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      },
      {
        "path": "user",
        component: () => import('@/views/permission/user.vue'),
        "name": "user",
        "meta": {
          "title": "用户管理",
          "icon": "role",
          btnPermissions: [
            { title: '新增', type: 'add' },
            { title: '批量删除', type: 'batchDelete' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      }
    ]
  },
  {
    path: "/news",
    'name': 'news',
    component: Layout,
    "meta": {
      "title": "新闻管理",
      "icon": "system",
      "hidden": false,
      "menuOrder": 0
    },
    "children": [
      {
        "path": "newsindex",
        component: () => import('@/views/news/index.vue'),
        "name": "newsindex",
        "meta": {
          "title": "新闻管理",
          "icon": "role",
          "menuOrder": 0,
          btnPermissions: [
            { title: '添加', type: 'add' },
            { title: '导入', type: 'import' },
            { title: '导出', type: 'export' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' },
            { title: '批量删除', type: 'batchDeletion' }
          ]
        }
      }
    ]
  },

  {
    path: "/product",
    'name': 'product',
    component: Layout,
    "meta": {
      "title": "产品管理",
      "icon": "system",
      "hidden": false,
      "alwaysShow": true,
    },
    "children": [
      {
        "path": "classify",
        component: () => import('@/views/productClass/index.vue'),
        "name": "productclass",
        "meta": {
          "title": "分类管理",
          "icon": "role",
          "menuOrder": 0,
          btnPermissions: [
            { title: '添加', type: 'add' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      },
      {
        "path": "index",
        component: () => import('@/views/proudct/index.vue'),
        "name": "productindex",
        "meta": {
          "title": "产品管理",
          "icon": "role",
          "menuOrder": 0,
          btnPermissions: [
            { title: '添加', type: 'add' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      }
    ]
  }
];

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({left: 0, top: 0})
});

// 重置路由
export function resetRouter() {
  const permissionStore = usePermissionStoreHook();
  permissionStore.routes.forEach(route => {
    const name = route.name;
    if (name && router.hasRoute(name)) {
      router.removeRoute(name);
    }
  });
}

export default router;
