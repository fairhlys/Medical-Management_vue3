<script setup>
import { ref,  defineExpose} from 'vue'
import { defineEmits,defineProps } from 'vue'
import { rules } from '@/utils/validate'
import { adminUpdate } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { createRequestLock } from '@/utils/lock'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const formRef = ref()
const dialogTableVisible = ref(false)
const rule = {
  name:rules.name
}
const props = defineProps({
  options:{
    type:Object,
    required:true
  }
})
const form = ref({
  name:'',
  permissions_id:'',
  mobile:'',
  id:''
})

const emits = defineEmits(['statechange'])
const open = (data) => {
  dialogTableVisible.value = true
  form.value = {
    name:data.rowData.name,
    mobile:data.rowData.mobile,
    permissions_id:data.rowData.permissions_id,
    id:data.rowData.id
  }
}
const beforeClose = () => {
  dialogTableVisible.value = false
  formRef.value.resetFields()
  form.value.id = ''
}
//选中权限
//还是需要请求锁
let signal = false
const lockedRequest = createRequestLock(adminUpdate)
const confirm = async () => {
  try{
  await formRef.value.validate()
  if(form.value.name !== userStore.userInfo.name){
    signal = true
  }
  const res = await lockedRequest(form.value)
  if(res.code !== 10000){
    throw new Error(res)
  }
  ElMessage.success(res.message)
  emits('statechange',true)
  } catch(err){
    ElMessage.error(err.message || '添加失败')
  } finally {
    if(signal){
      userStore.userInfo.name = form.value.name
    }
    signal = false
    dialogTableVisible.value = false
    formRef.value.resetFields()
    form.value.id = ''
  }
}
defineExpose({
  open
})
//注意，按照element-plus的设计，dialog的展示是根据v-show的，也就是说，关闭该组件依旧没有销毁，而default-checked-keys只在第一次渲染的时候有用，后面就不会改变了
</script>
<template>
  <el-dialog v-model="dialogTableVisible" :before-close="beforeClose" title="编辑用户" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rule" hide-required-asterisk="true">
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled="true"> </el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"> </el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
           <el-option
             v-for="item in props.options.data"
             :key="item.id"
             :label="item.name"
             :value="item.id"
           />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
