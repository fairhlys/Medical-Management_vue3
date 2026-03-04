import { defineStore } from "pinia"
import { ref } from 'vue'
// 用户模块 token setToken removeToken
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }
  const userInfo = ref({})
  // const getUser = async () => {
  //   const res = await userGetUserInfo()
  //   userInfo.value = res.data.data
  // }
  const setUserInfo = (obj) => {
    userInfo.value = obj
  }
  const clearUserInfo = () => {
    userInfo.value = {}
  }

  return { token, setToken, removeToken, userInfo, setUserInfo, clearUserInfo }
}, {
  persist: true
})
