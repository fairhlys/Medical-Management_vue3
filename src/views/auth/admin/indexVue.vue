<script setup>
 import { adminGetList,adminMenuData } from '@/api/admin';
 import { ref,onMounted,watch } from 'vue'
 import { useRoute } from 'vue-router';
 import AdminDialog from '../components/AdminDialog.vue';
import dayjs from 'dayjs';
const route = useRoute()
 const page = ref({
  pageNum:1,
  pageSize:10
})
const dialog = ref()
const onEDIT = (scope) => {
  dialog.value.open({
    show:true,
    rowData:scope.row
  })
}
const statechange = (val) =>{
  if(val === true){
    getListData()
  }
}
const totalNum = ref(0)
// const listdata1 = ref({
//   id:'',
//   name:'',
//   permissions_id:'',
//   create_time:''
// })
const options = ref({  })
const listdata = ref([])
const permissionName  = (id) => {
  const data = options.value?.data?.find(el => el.id === id)
  return data ? data.name : '超级管理员'
}
const init = async () => {
  getListData()
 options.value = await adminMenuData()
}

onMounted(init)

watch(
  () => route.path,
  init
)
const getListData = async () => {
  const res = await adminGetList(page.value)
  listdata.value = res.data.list
  totalNum.value = res.data.total
  listdata.value.forEach(ele => {
  ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
 })
}
const handleSizeChange = (val) => {
  page.value.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  page.value.pageNum = val
  getListData()
}
 </script>
<template>
  <el-table :data="listdata">
    <el-table-column prop="id" label="ID" ></el-table-column>
    <el-table-column prop="name" label="昵称" ></el-table-column>
    <el-table-column prop="permissions_id" label="所属组别" >
      <template #default="scope">
        {{ permissionName(scope?.row?.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="电话号" ></el-table-column>
    <el-table-column prop="active" label="状态" >
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success':'danger'">{{ scope.row.active ? '正常':'失效' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
  <template #default="scope">
    <div class="time-cell">
      <el-icon><Clock /></el-icon>
      <span>{{ scope.row.create_time }}</span>
    </div>
  </template>
</el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="onEDIT(scope)" >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <AdminDialog ref="dialog" :options="options" @statechange="statechange"></AdminDialog>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="page.pageNum"
      :page-size="page.pageSize"
      background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="totalNum"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<style scoped lang="less">
.time-cell {
  display: flex;
  align-items: center;
  gap: 2px;
}
</style>
