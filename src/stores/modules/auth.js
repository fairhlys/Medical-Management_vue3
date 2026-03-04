import { defineStore } from "pinia";
import { ref, h } from 'vue'
import { RouterView } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const auth = ref([])
  const route = ref([])
  // 匹配所有 views 目录下的 vue 文件
  const allViews = import.meta.glob('../../views/**/**/*.vue')
  /*
   * 递归生成动态路由
   */
  function generateRoutes(list) {
    return list.map(ele => {
      const route = {
        path: ele.name,      // 子路由不要写 / 开头
        name: ele.name,
        meta: ele.meta
      }
      // ⭐ 如果有 children
      if (ele.children && ele.children.length > 0) {
        // ⭐ 给中间层一个 RouterView 占位组件
        route.component = {
          name: 'RouterViewContainer',
          render() {
            return h(RouterView)
          }
        }
        route.children = generateRoutes(ele.children)
      } else {
        // ⭐ 叶子节点才加载真实组件
        const url = `../../views${ele.meta.path}/indexVue.vue`
        if (allViews[url]) {
          route.component = allViews[url]
        } else {
          console.warn('未找到组件路径:', url)
        }
      }
      return route
    })
  }
  /**
   * 设置权限并生成路由
   */
  function setAuth(data) {
    auth.value = data
    route.value = generateRoutes(data)
    console.log('动态路由生成完成:', route.value)
  }

  /**
   * 清空权限
   */
  function clearAuth() {
    auth.value = []
    route.value = []
  }

  return {
  auth,
  route,
  setAuth,
  clearAuth,
  generateRoutes  // ⭐ 加上这个
}
}, {
  persist: {
  paths: ['auth']
}
})


  //结合auth权限进行和Vite 支持使用特殊的 import.meta.glob 函数从文件系统导入多个模块
  //利用import.meta.glob 函数，可以获取所有的views，然后根据auth进行动态路由加载
