<script setup>
import { ref, onMounted, defineExpose} from 'vue'
import { watch, nextTick,defineEmits } from 'vue'
import { groupMenuData, groupNewMenu } from '@/api/groups'
import { rules } from '@/utils/validate'
import { ElMessage } from 'element-plus'
import { createRequestLock } from '@/utils/lock'
const dialogdata = ref({})
const treeRef = ref()
const formRef = ref()
const defauletKeys = [4,5]
const dialogTableVisible = ref(false)
const rule = {
  name:rules.name
}
const form = ref({
  name:'',
  permissions:'',
  id:''
})

const emits = defineEmits(['statechange'])
const open = (data) => {
  dialogTableVisible.value = true
  dialogdata.value.show = data.show
  dialogdata.value.row = data.rowData

  //不能在这里直接使用tree的api，因此此时tree的实例可能还未创建完成，应该应nexttick
//   Vue 是：
// 批量更新 DOM 的
// 当你改响应式数据：
// dialogTableVisible.value = true
// DOM 不会立刻更新。
// 它会：
// 加入更新队列
// 等待当前同步代码执行完
// 再统一更新
// 这叫：
// 异步 DOM 更新机制
  if(dialogdata.value.row){
    form.value.name = data.rowData.name
    form.value.id = dialogdata.value.row.id
  }
}
watch(dialogTableVisible, async (val) => {
  if (val) {
    await nextTick()
    if (dialogdata.value.row) {
      treeRef.value?.setCheckedKeys(
        dialogdata.value.row.permission
      )
    } else {
      treeRef.value?.setCheckedKeys([4, 5])
    }
  }
})
const beforeClose = () => {
  dialogTableVisible.value = false
  formRef.value.resetFields()
  form.value.id = ''
}

const permissiondata = ref([])
onMounted( async ()=> {
  const res = await groupMenuData()
  permissiondata.value = res.data
})
//选中权限
//还是需要请求锁
const lockedRequest = createRequestLock(groupNewMenu)
const confirm = async () => {
  try{
  await formRef.value.validate()
  form.value.permissions = JSON.stringify(treeRef.value.getCheckedKeys())
  const res = await lockedRequest(form.value)
  if(res.code !== 10000){
    throw new Error(res)
  }
  ElMessage.success(res.message)
  emits('statechange',true)
  } catch(err){
    ElMessage.error(err.message || '添加失败')
  } finally {
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
  <el-dialog v-model="dialogTableVisible" :before-close="beforeClose" :title="dialogdata.show ? '编辑权限':'添加权限'" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rule" hide-required-asterisk="true">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写用户名称"> </el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
            ref="treeRef"
            style="max-width: 600px;"
            :data="permissiondata"
            node-key="id"
            show-checkbox
            :default-checked-keys="defauletKeys"
            :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
