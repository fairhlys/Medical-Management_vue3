<script setup>
import treeMenu from './treeMenu.vue';
import { defineExpose } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import { reactive } from 'vue';
import { useMenuStore } from '@/stores/modules/menu';
const menuStore = useMenuStore();
const router = useRouter();
const route = useRoute()
const menudata = reactive(router.options.routes[0].children);
defineExpose({
  name: 'AsideVue'
})
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
