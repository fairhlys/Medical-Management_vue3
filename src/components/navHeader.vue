<script setup>
import { useMenuStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore,useAuthStore } from '@/stores';
import { ElMessage } from 'element-plus';
const userStore = useUserStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const deletTab = function(item, index){
  if(route.path !== item.path){
    menuStore.deletMenu(item,index)
    return
  }
  if(index === (menuStore.selectedMenu.length - 1 )){
    if(menuStore.selectedMenu.length === 1){
      menuStore.deletMenu(item,index)
      router.push('/')
    }else {
      menuStore.deletMenu(item,index)
      router.push(`${menuStore.selectedMenu[menuStore.selectedMenu.length - 1].path}`)
    }
  }
  else{
      menuStore.deletMenu(item,index)
      router.push(menuStore.selectedMenu[index].path)
  }
}
const handleCommand = (command) => {
  // remove extra whitespace just in case
  const cmd = command && command.toString().trim();
  if(cmd === '退出登录'){
    userStore.removeToken()
    userStore.clearUserInfo()
    auth.clearAuth()
    menuStore.clearMenu()
    router.push('/login')
    ElMessage.success(`${command}成功`)
  }
}
</script>
<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon size="20" class="fold-icon" @click="menuStore.menustateChange"><Fold /></el-icon>
      <ul class="flex-box">
        <li v-for="(item,index) in menuStore.selectedMenu" :key="index" class="tab flex-box" :class="{selected: item.path === route.path }">
          <el-icon  class="fold-icon" size="12"><component :is="item.meta.icon"></component></el-icon>
          <router-link :to="{path:item.path}" class="text flex-box">
          {{ item.meta.name }}
          </router-link>
          <el-icon class="fold-icon close"  size="12" @click="deletTab(item,index)"><close /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
    <el-dropdown @command="handleCommand">
      <span class="flex-box">
       <el-avatar :size="30" :src="userStore.userInfo.avatar" />
       <p class="user-name">{{ userStore.userInfo.name }}</p>
      </span>
      <template #dropdown >
       <el-dropdown-menu >
         <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
         <el-dropdown-item>Action 2</el-dropdown-item>
       </el-dropdown-menu>
      </template>
    </el-dropdown>
    </div>
  </div>
</template>
<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50%;
  background-color: #fff;
  padding: 0 10px;
  .header-left {
    .fold-icon {
      cursor: pointer;
      width: 25px;
      height: 100%;
    }
    .tab {
      padding: 0 10px;
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        color:#000
      }
    }

  }
  .header-right {
    .user-name {
      margin-left: 8px;
    }
  }
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}

</style>
