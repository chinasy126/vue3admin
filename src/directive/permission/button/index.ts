import {useUserStoreHook} from '@/store/modules/user';
import {Directive, DirectiveBinding ,getCurrentInstance } from 'vue';

import { useRoute } from 'vue-router';

import {usePermissionStore} from "@/store/modules/permission";
const permissionStore = usePermissionStore();

/**
 * 按钮权限校验
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding,vnode) {


    // console.log(permissionStore.permissionButton)

    // const {value} = binding // 解构绑定权限内容 以数组形式
    // // 获取所有菜单
    // //console.log(router)
    // console.log(el)
    // console.log(value)
  }
};
