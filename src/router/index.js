import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore,useAuthStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path:'/',
      component:()=>import('@/views/MainVue.vue'),
      name:'main',
      // redirect:to => {
      //   if(JSON.parse(localStorage.getItem('auth'))){
      //     const child = JSON.parse(localStorage.getItem('auth')).auth[0].children
      //     if(child && child.length > 0){
      //       return child[0].component
      //     }else {
      //       return JSON.parse(localStorage.getItem('auth')).auth[0].component
      //      } }
      //     else{
      //       return '/'
      //     } },
      children:[
        // {
        //   path:'dashboard',
        //   component:()=>import('@/views/dashboard/indexVue.vue'),
        //   meta:{id:1,name:'控制台',icon:'Platform',path:'/dashboard',describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据'}
        // },
        // {
        //   path:'auth',
        //   meta:{id:2,name:'权限管理',icon:'Grid',path:'/auth'},
        //   children:[
        //     {
        //       path:'admin',
        //       alias:['admin'],
        //       meta:{id:1,name:'账号管理',icon:'Avatar',path:'/auth/admin',describe: '管理员可以进行编辑，权限修改后需要登出才会生效'},
        //       component:()=>import('@/views/auth/admin/indexVue.vue')
        //     },
        //     {
        //       path:'group',
        //       meta:{id:2,name:'菜单管理',icon:'Memo',path:'/auth/group',describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取'},
        //       component:()=>import('@/views/auth/group/indexVue.vue')
        //     }
        //   ]
        // },
        // {
        //   path:'vppz',
        //   meta:{id:3,name:'DIDI陪诊',icon:'BellFilled',path:'/vppz'},
        //   children:[
        //     {
        //       path:'staff',
        //       meta:{id:1,name:'陪护管理',icon:'List',path:'/vppz/staff', describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择'},
        //       component:()=>import('@/views/vppz/staff/indexVue.vue')
        //     },
        //     {
        //       path:'order',
        //       meta:{id:2,name:'订单管理',icon:'Checked',path:'/vppz/order',describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改'},
        //       component:()=>import('@/views/vppz/order/indexVue.vue')
        //     }
        //   ]
        // }
      ]
    },
    {
      path:'/login',
      component:()=>import('@/views/login/IndexVue.vue')
    }
  ]
})
let isAddRoute = false
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  const hasToken = Boolean(userStore.token)
  const hasAuth = Array.isArray(authStore.auth) && authStore.auth.length > 0

  // 未登录：除 /login 外一律去登录页
  if (!hasToken) {
    if (to.path !== '/login') return { path: '/login', replace: true }
    return true
  }

  // 已登录：访问登录页则回首页
  if (to.path === '/login') {
    return { path: '/', replace: true }
  }

  // 有 token 但没有权限数据：视为异常登录态，回登录页
  if (!hasAuth) {
    return { path: '/login', replace: true }
  }

  // 刷新恢复动态路由
  if (!isAddRoute) {
    authStore.route = authStore.generateRoutes(authStore.auth)
    authStore.route.forEach(r => router.addRoute('main', r))
    isAddRoute = true

    if (to.path === '/') {
      const first = authStore.auth[0]
      if (first?.children?.length > 0) return { name: first.children[0].name, replace: true }
      return { name: first.name, replace: true }
    }

    return { ...to, replace: true }
  }

  return true
})
// 用户鉴权和全局路由守卫和刷新恢复机制
export default router

//浏览器刷新时，persist:true，所以pinia的数据还在，但是所有的js会重新加载
// 浏览器重新加载整个 Vue 应用
// 这一步非常关键：
// 刷新 ≠ 页面重新渲染
// 刷新 = 整个 JS 重新执行
// 也就是说：
// main.js 重新执行
// createApp() 重新执行
// createRouter() 重新执行
// createPinia() 重新执行
// 所有 store 重新初始化
// 内存全部清空。

// 刷新完整时间线（真实发生顺序）
// 刷新
// ↓
// 服务器返回 index.html
// ↓
// main.js 执行
// ↓
// createApp
// ↓
// createPinia
// ↓
// createRouter
// ↓
// Pinia 从 localStorage 恢复数据
// ↓
// router 解析当前 URL (/dashboard)
// ↓
// beforeEach 执行
// ↓
// addRoute
// ↓
// replace 重新匹配
// ↓
// 页面正常

// 如果缺少：
// replace
// 就会：
// 第一次匹配失败
// 页面空
