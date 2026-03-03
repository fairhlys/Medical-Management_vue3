import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path:'/',
      component:()=>import('@/views/MainVue.vue'),
      redirect:'/dashboard',
      children:[
        {
          path:'dashboard',
          component:()=>import('@/views/dashboard/indexVue.vue'),
          meta:{id:1,name:'控制台',icon:'Platform',path:'/dashboard',describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据'}
        },
        {
          path:'auth',
          meta:{id:2,name:'权限管理',icon:'Grid',path:'/auth'},
          children:[
            {
              path:'admin',
              alias:['admin'],
              meta:{id:1,name:'账号管理',icon:'Avatar',path:'/auth/admin',describe: '管理员可以进行编辑，权限修改后需要登出才会生效'},
              component:()=>import('@/views/auth/admin/adminVue.vue')
            },
            {
              path:'group',
              meta:{id:2,name:'菜单管理',icon:'Memo',path:'/auth/group',describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取'},
              component:()=>import('@/views/auth/group/groupVue.vue')
            }
          ]
        },
        {
          path:'vppz',
          meta:{id:3,name:'DIDI陪诊',icon:'BellFilled',path:'/vppz'},
          children:[
            {
              path:'staff',
              meta:{id:1,name:'陪护管理',icon:'List',path:'/vppz/staff', describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择'},
              component:()=>import('@/views/vppz/staff/indexVue.vue')
            },
            {
              path:'order',
              meta:{id:2,name:'订单管理',icon:'Checked',path:'/vppz/order',describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改'},
              component:()=>import('@/views/vppz/order/indexVue.vue')
            }
          ]
        }
      ]
    },
    {
      path:'/login',
      component:()=>import('@/views/login/IndexVue.vue')
    }
  ]
})
router.beforeEach( async (to, from) => {
const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') {
    return '/login'
  }
  return true
})
// 用户鉴权和全局路由守卫
export default router
