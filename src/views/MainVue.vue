<script setup>
import {defineExpose} from 'vue'
import asideVue from '@/components/asideVue.vue'
import navHeader from '@/components/navHeader.vue'
defineExpose({
  name:'MainVue'
})
</script>
<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
       <asideVue></asideVue>
      <el-container>
        <el-header><navHeader></navHeader></el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.common-layout {
  height: 100vh;
}
</style>
