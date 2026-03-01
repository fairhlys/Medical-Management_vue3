import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import './assets/main.css'
import { createApp } from 'vue'
import  pinia from './stores'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
//路由挂载
app.use(pinia)
//状态管理挂载
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}
app.mount('#app')
