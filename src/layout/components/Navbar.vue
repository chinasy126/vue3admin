<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

import Hamburger from '@/components/Hamburger/index.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Screenfull from '@/components/Screenfull/index.vue';
import SizeSelect from '@/components/SizeSelect/index.vue';
import LangSelect from '@/components/LangSelect/index.vue';
import MixNav from './Sidebar/MixNav.vue';
import { CaretBottom } from '@element-plus/icons-vue';

import { useAppStore } from '@/store/modules/app';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { useUserStore } from '@/store/modules/user';
import { useSettingsStore } from '@/store/modules/settings';

const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const device = computed(() => appStore.device);

function toggleSideBar() {
  appStore.toggleSidebar(true);
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>

<template>
  <div class="navbar">
    <div
      class="flex justify-start"
      v-if="device === 'mobile' || settingsStore.layout === 'left'"
    >
      <hamburger
        :is-active="appStore.sidebar.opened"
        @toggleClick="toggleSideBar"
      />
      <!-- 面包屑导航栏 -->
      <breadcrumb />
    </div>

    <mix-nav v-if="device !== 'mobile' && settingsStore.layout === 'mix'" />

    <div
      v-if="device === 'mobile' || settingsStore.layout === 'left'"
      class="flex justify-start"
    >
      <div v-if="device !== 'mobile'" class="flex justify-center items-center">
        <!--全屏 -->
        <screenfull id="screenfull" />

        <!-- 布局大小 -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select />
        </el-tooltip>

        <!--语言选择-->
        <lang-select />
      </div>

      <el-dropdown trigger="click">
        <div class="flex justify-center items-center pr-[20px]">
          <img
            :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
            class="w-[40px] h-[40px] rounded-lg"
          />
          <CaretBottom class="w-3 h-3" />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/hxrui">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/haoxr">
              <el-dropdown-item>{{ $t('navbar.gitee') }}</el-dropdown-item>
            </a>
            <a target="_blank" href="https://www.cnblogs.com/haoxianrui/">
              <el-dropdown-item>{{ $t('navbar.document') }}</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              {{ $t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-dropdown {
  font-size: 18px;
}

.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.2);
}
</style>
