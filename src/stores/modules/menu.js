import { defineStore } from 'pinia'
import { ref } from 'vue'

// 使用组合式 API 定义 store
export const useMenuStore = defineStore('menu', () => {
  const menuState = ref(true)
  const selectedMenu = ref([])
  const menustateChange = () => {
    menuState.value = !menuState.value
  }
  const addMenu = function(playload){
    if( selectedMenu.value.findIndex(item => item.path === playload.path ) === -1 && playload.path !=='/') {
      selectedMenu.value.push(playload)
    }
  }
  const deletMenu = item => {
    const i = selectedMenu.value.findIndex(val => val.meta.name === item.meta.name)
    selectedMenu.value.splice(i,1)
  }
  function clearMenu() {
    selectedMenu.value = []
  }
  return {
    menuState,menustateChange,selectedMenu,addMenu,deletMenu,clearMenu
  }
},{
  persist:true
})

