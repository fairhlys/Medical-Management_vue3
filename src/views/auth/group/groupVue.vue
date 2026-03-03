<script setup>
import { ref, onMounted} from 'vue'
import { groupGetList } from '@/api/groups'
import GroupDialog from '../components/GroupDialog.vue'
import { Plus } from '@element-plus/icons-vue'
const page = ref({
  pageNum:1,
  pageSize:10
})
const listdata = ref([])
let totalNum = ''
const dialog = ref()
onMounted( async ()=> {
  getListData()
})
const onADD = () => {
  dialog.value.open({
    show:false,
    rowData:''
  })
}
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
//请求列表数据
const getListData = async () => {
  const res = await groupGetList(page.value)
  listdata.value = res.data.list
  totalNum = res.data.total
}
const handleSizeChange = () => {

}
const handleCurrentChange = (val) => {
  page.value.pageNum = val
  getListData()
}
</script>
<template>
  <GroupDialog ref="dialog"  @statechange="statechange"></GroupDialog>
  <el-button :icon="Plus" type="primary" @click="onADD">新增</el-button>
  <el-table :data="listdata">
    <el-table-column prop="id" label="ID" ></el-table-column>
    <el-table-column prop="name" label="昵称" ></el-table-column>
    <el-table-column prop="permissionName" label="菜单权限" ></el-table-column>
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
