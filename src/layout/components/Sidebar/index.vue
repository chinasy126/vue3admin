<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <el-input v-model='routeKeyword' clearable
              placeholder='菜单搜索'
              style=' margin: 20px; width: auto;' v-show='!isCollapse' />
    <!--    <logo v-if="sidebarLogo" :collapse="isCollapse" />-->
    <el-scrollbar>
      <el-menu
        :default-active='activeMenu'
        :collapse='isCollapse'
        :background-color='variables.menuBg'
        :text-color='variables.menuText'
        :active-text-color='variables.menuActiveText'
        :unique-opened='false'
        :collapse-transition='false'
        mode='vertical'
      >
        <sidebar-item
          v-for='route in menuList'
          :item='route'
          :key='route.path'
          :base-path='route.path'
          :is-collapse='isCollapse'
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import SidebarItem from './SidebarItem.vue';
import Logo from './Logo.vue';
import variables from '@/styles/variables.module.scss';

import { useSettingsStore } from '@/store/modules/settings';
import { usePermissionStore } from '@/store/modules/permission';
import { useAppStore } from '@/store/modules/app';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
// 菜单列表
const menuList = ref(permissionStore.routes);

const appStore = useAppStore();
const routeKeyword = ref('');
const { sidebarLogo } = storeToRefs(settingsStore);
const route = useRoute();

const isCollapse = computed(() => !appStore.sidebar.opened);

const activeMenu = computed<string>(() => {
  const { meta, path } = route;
  if (meta?.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});

watch(routeKeyword, (newValue) => {
  const newMenuList = JSON.parse(JSON.stringify(permissionStore.routes));
  console.log(newValue);
  if (newValue === '') {
    menuList.value = permissionStore.routes;
  } else {
    menuList.value = newMenuList.filter((item: any) => {
      if (typeof (item.meta) !== 'undefined' && typeof (item.meta.title) !== 'undefined') {
        if (item.meta.title.search(newValue.trim()) !== -1) {
          return item;
        } else {
          const subMenu = childMenuIsHas(item.children);
          if (subMenu.length > 0) {
            item.children = subMenu;
            return item;
          }

          function childMenuIsHas(menus: any[]) {
            return menus.filter((i) => {
              return i.meta.title.search(newValue.trim()) !== -1;
            });
          }
        }
      }


    });
  }


});


</script>


