import axios from 'axios'
const baseURL = 'https://v3pz.itndedu.com/v3pz'
import { ElMessage } from 'element-plus';
import { ElLoading } from 'element-plus'  // 手动导入服务（即使你用了 auto-import，这里建议显式导入以清晰）
import router from '@/router';
import { useUserStore } from '@/stores/index';
let loadingInstance = null
let loadingCount = 0  // 计数器，防止多个请求同时结束时 loading 闪烁
const request = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
    // 这里不要放任何 token 或 terminal，全部在拦截器里动态加
  }
})
const userStore = useUserStore()

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.showLoading !== false) {
      loadingCount++
      if (loadingCount === 1) {
        loadingInstance = ElLoading.service({
          fullscreen: true,
          text: '加载中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }
    }


    // ──────────────── 核心：根据 url 动态添加不同的 header ────────────────
    const whiltUrl = ['/login','/get/code','/user/authentication']
    if (whiltUrl.includes(config.url)) {
      // 白名单接口：加 terminal，不需要 token
      config.headers.terminal = 'h5'  // 或 'app'、'mini' 等，根据你的实际值
    } else {
      // 其他接口：需要加 x-token
      if (userStore.token) {
        config.headers['x-token'] = userStore.token
        // 或 config.headers.Authorization = `Bearer ${userStore.token}`
        // 看后端要求用哪种（x-token 或 Authorization）
      }
    }

    return config
  }, function (error) {
    loadingCount--
    if (loadingCount <= 0) {
      loadingInstance?.close()
      loadingCount = 0
    }
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
request.interceptors.response.use(
  response => {
    loadingCount--
    if (loadingCount <= 0) {
      loadingInstance?.close()
      loadingCount = 0
    }
    const res = response.data
    if (res.code === 10000) {
      return res  // 成功直接返回 data
    }

    // 业务错误
    return Promise.reject(res)
  },
  error => {
    loadingCount--
    if (loadingCount <= 0) {
      loadingInstance?.close()
      loadingCount = 0
    }

    // 401 处理
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      userStore.clearUserInfo?.() // 清空用户信息
      router.push('/login')
    } else {
      ElMessage.error(error.message || '网络异常')
    }

    return Promise.reject(error)
  }
)
export default request
export { baseURL }
