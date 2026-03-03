<script setup>
 import { adminGetList } from '@/api/admin';
 import { ref,onMounted } from 'vue'
 const page = ref({
  pageNum:1,
  pageSize:10
})
let totalNum = 0
// const listdata1 = ref({
//   id:'',
//   name:'',
//   permissions_id:'',
//   create_time:''
// })
const listdata = ref([])
onMounted( async () => {
 const res = await adminGetList(page.value)
 console.log(res);
 listdata.value = res.data.list
 totalNum = res.data.total
})

 </script>
<template>
  <el-table :data="listdata">
    <el-table-column prop="id" label="ID" ></el-table-column>
    <el-table-column prop="name" label="昵称" ></el-table-column>
    <el-table-column prop="permissions_id" label="所属组别" ></el-table-column>
    <el-table-column prop="create_time" label="创建时间" ></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="onEDIT(scope)" >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
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
<style scoped lang="less"></style>
