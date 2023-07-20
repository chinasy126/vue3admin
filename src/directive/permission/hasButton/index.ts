import { Directive, DirectiveBinding, getCurrentInstance, VNode } from 'vue';
import router from '@/router';

import { usePermissionStore } from '@/store/modules/permission';


export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { permissionButton } = usePermissionStore();  //  获取全亮路由菜单

    // 当前路由name router.currentRoute.value.name
    const currentRouter = router.currentRoute.value; // 当前路由信息

    const rouBtnList = permissionButton.find(item => item.name === currentRouter.name); // 缓存中拿到当前路由按钮信息

    if (permissionButton.length === 0) {
      el.parentNode && el.parentNode.removeChild(el);
      return true;
    }

    // 获取路由META信息
    const { value } = binding;
    // let btnPermissions: any[] = router.currentRoute.value.meta.btnPermissions;
    const btnPermissions = rouBtnList.menubuttonList;
    if (value && btnPermissions && btnPermissions.length !== 0) {
      const hasPermission: Boolean = btnPermissions.some((role: { type: any; }) => {
        return value.includes(role.type);
      });
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }


  },

  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {
  },
  // 在绑定元素的父组件

  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {
  },
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {
  },
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {
  }
};
