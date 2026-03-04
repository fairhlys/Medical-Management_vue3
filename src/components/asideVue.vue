<script setup>
import treeMenu from './treeMenu.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useMenuStore,useAuthStore } from '@/stores';
const menuStore = useMenuStore();
const route = useRoute()
const authStore = useAuthStore()
const menudata = computed(() => authStore.route)
const handleOpen = () => {

}
const handleClose = () => {

}
</script>
<template>
<el-menu
  collapse-transition = 'true'
  :collapse="!menuStore.menuState"
  :style="{width: menuStore.menuState ? '230px' : '64px'}"
  active-text-color="#ffd04b"
  background-color="#545c64"
  class="aside-container"
  :default-active="route.path"
  text-color="#fff"
  @open="handleOpen"
  @close="handleClose"
>
<p class="logo-lg">{{ menuStore.menuState ? 'DIDI陪诊' : 'DIDI' }}</p>
<treeMenu  :index="1" :menudata="menudata"></treeMenu>
</el-menu>
</template>
<style scoped lang="less">
.aside-container {
  width: 200px;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}

</style>
