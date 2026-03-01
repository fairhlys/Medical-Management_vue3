import { createRouter, createWebHistory } from 'vue-router'
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
          meta:{id:1,name:'控制台',icon:'Platform',path:'/dashboard'}
        },
        {
          path:'auth',
          meta:{id:2,name:'权限管理',icon:'Grid',path:'/auth'},
          children:[
            {
              path:'admin',
              alias:['admin'],
              meta:{id:1,name:'账号管理',icon:'Avatar',path:'/auth/admin'},
              component:()=>import('@/views/auth/admin/adminVue.vue')
            },
            {
              path:'group',
              meta:{id:2,name:'菜单管理',icon:'Memo',path:'/auth/group'},
              component:()=>import('@/views/auth/group/groupVue.vue')
            }
          ]
        },
        {
          path:'vppz',
          meta:{id:3,name:'DIDI陪诊',icon:'UserFilled',path:'/vppz'},
          children:[
            {
              path:'staff',
              meta:{id:1,name:'陪护管理',icon:'List',path:'/vppz/staff'},
              component:()=>import('@/views/vppz/staff/indexVue.vue')
            },
            {
              path:'order',
              meta:{id:2,name:'订单管理',icon:'Wallet',path:'/vppz/order'},
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

export default router
