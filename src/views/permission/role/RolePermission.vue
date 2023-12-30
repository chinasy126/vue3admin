<template>
    <el-row v-for="(item,index) in permissionList" :key="item.id">
      <el-tag class="mx-1" type="success">{{ item.menuTitle }}</el-tag>
      <div v-for="(subItem,subIndex) in item.secondaryMenu" class="secondaryMenu">
        <el-tag class="mx-2" type="info">{{ subItem.menuTitle }}</el-tag>
        <el-tag class="mx-2" type="warning" v-for="(btnItem,btnIndex) in subItem.rolebuttonsList">{{ btnItem.buttonName }}</el-tag>
      </div>
    </el-row>
</template>


<script setup lang="ts">
import {defineProps, defineEmits, onMounted, watch, computed} from "vue";
import { RoleMenus } from '@/api/role/types'
const prop = defineProps({
  permission: {
    type: Object,
    required: true,
    default: () => {
      return []
    }
  }
})

const permissionList = computed(() => {
  // 一级菜单
  let primaryMenu = prop.permission.filter( (item:RoleMenus) => {
    return item.menuFid === 0
  })

  primaryMenu.forEach((item:RoleMenus, index:number) => {
    let secondaryMenu = prop.permission.filter( (i:RoleMenus) => {
      return item.menuId === i.menuFid
    })
    primaryMenu[index]['secondaryMenu'] = secondaryMenu
  })
  return primaryMenu

})

onMounted(() => {

})

</script>

<style scoped>
.el-tag{
  margin-right: 5px;
  margin-bottom: 5px;
}

.secondaryMenu{
  margin-left: 20px;
}
</style>
