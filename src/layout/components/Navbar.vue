<template>
  <div class='navbar'>
    <div
      class='flex justify-start'
      v-if="device === 'mobile' || settingsStore.layout === 'left'"
    >
      <hamburger
        :is-active='appStore.sidebar.opened'
        @toggleClick='toggleSideBar'
      />
      <!-- 面包屑导航栏 -->
      <breadcrumb />
    </div>

    <mix-nav v-if="device !== 'mobile' && settingsStore.layout === 'mix'" />

    <div
      v-if="device === 'mobile' || settingsStore.layout === 'left'"
      class='flex justify-start'
    >


      <el-dropdown trigger='click'>
        <div class='flex justify-center items-center pr-[20px]'>
          <img
            :src="userStore.avatar + '?imageView2/1/w/80/h/80'"
            class='w-[40px] h-[40px] rounded-lg'
          />
          <CaretBottom class='w-3 h-3' />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to='/'>
              <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
            </router-link>

            <a target='_blank' @click='openDrawer(1)'>
              <el-dropdown-item>更换头像</el-dropdown-item>
            </a>
            <a target='_blank' @click='openDrawer(2)'>
              <el-dropdown-item>修改密码</el-dropdown-item>
            </a>

            <el-dropdown-item divided @click='logout'>
              {{ $t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <el-drawer v-model='drawer' :with-header='false'>
    <Upload v-if='drawerTypes === 1' @uploadSuccess='uploadSuccess' uploadFolderName='avatar'
            uploadBtnName='上传头像'></Upload>
    <password v-if='drawerTypes === 2'></password>
  </el-drawer>

</template>


<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

import password from '@/components/password/index.vue';
import Upload from '@/components/Upload/Index.vue';
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
import { setUserAvator } from '@/api/user/index'
import { Message } from 'postcss';
const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();

const drawer = ref(false);
const drawerTypes = ref(1);

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

const openDrawer = (type) => {
  drawerTypes.value = type;
  drawer.value = true;
};

function uploadSuccess(param: avatarSuccess[]) {
  if (param.length !== 0) {
    setUserAvator({ 'avatar': param[0]['url'] }).then(()=>{
      ElMessage.success('头像上传成功!');
      setTimeout(() => {
        drawer.value = false
      })
    }).finally(()=>{
      userStore.getInfo()
    })
  }
}


interface avatarSuccess {
  url: String;
}
</script>

<style lang='scss' scoped>
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
