<script setup>
import { defineExpose } from 'vue'
import { defineProps } from 'vue'
import { useRouter,useRoute } from 'vue-router';
const route = useRoute()
const props = defineProps({
  menudata: {
    type: Array,
    default: () => []
  },
  index: {
    type: [String, Number],
    default: ''
  }
})
defineExpose({
  name: 'TreeMenu'
})
//点击菜单
const router = useRouter();
const handleClick = (item) => {
  router.push(item.meta.path);
}
    /* 递归调用treeMenu组件，传递子菜单数据和新的索引值 */
    // 并且通过动态组件加载图标，使用Icons对象根据icon名称获取对应的组件
</script>
<template>
<template v-for="(item,index) in props.menudata" :key="`${props.index}-${index}`">
  <el-menu-item v-if="!item.children || item.children.length === 0" :index="`${props.index}-${index}`" @click="handleClick(item)" :class="{'is-active':route.path===item.meta.path} ">
    <el-icon size="20">
      <component :is="item.meta.icon" />
    </el-icon>
    <span>{{item.meta.name}}</span>
  </el-menu-item>
  <el-sub-menu v-else :index="`${props.index}-${index}`" >
    <template #title>
      <el-icon size="20">
        <component :is="item.meta.icon"  />
      </el-icon>
      <span>{{item.meta.name}}</span>
    </template>
    <treeMenu :index="`${props.index}-${index}`" :menudata="item.children"></treeMenu>
  </el-sub-menu>
</template>
</template>

