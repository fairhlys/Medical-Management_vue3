<script setup>
import { Plus, Check, InfoFilled, Delete } from '@element-plus/icons-vue'
import {ref, onMounted} from 'vue'
import { onBeforeUnmount } from 'vue'
import NoData from '@/components/NoData.vue'
import { rules } from '@/utils/validate'
import { getStaffPhoto, addStaff, getStaffList, deleteStaff } from '@/api/staff'
import { createRequestLock } from '@/utils/lock'
import { ElMessage } from 'element-plus'
const lockedRequest = createRequestLock(addStaff)
const deleteRequest = createRequestLock(deleteStaff)
const popconfirmRef = ref()
const deleteBtnRef = ref()
import dayjs from 'dayjs'
const dialogTableVisible = ref(false)
const sign = ref(true)
const initData = {
    id:'',
    name:'',
    avatar:'',
    sex:'',
    age:20,
    mobile:'',
    active:1
  }
const page = ref({
  pageNum:1,
  pageSize:10
})

let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0] // 监听单个元素

    // 不在视口
    if (!entry.isIntersecting) {
      popconfirmRef.value?.hide?.()//自动关闭删除确认框
      cancelEvent()
    }
  })

  if (deleteBtnRef.value?.$el) {
    observer.observe(deleteBtnRef.value.$el)// 监听删除按钮,deleteBtnRef.value.$el 是因为 deleteBtnRef 是一个组件实例，需要访问其 $el 属性才能获取到 DOM 元素
  }
})
const startObserve = () => {
  observer.observe(deleteBtnRef.value.$el)// 开始监听删除按钮
}

const stopObserve = () => {
  observer.disconnect() // 停止监听，断开观察器与所有目标元素的连接
}

//监听删除组件是否在视口内，如果不在视口内则自动关闭删除确认框
// IntersectionObserver 是浏览器提供的一个 观察器 API，用来检测：

// 某个元素是否进入 / 离开视口（viewport）

// 简单理解就是：

// 监听一个DOM元素
// 当它进入屏幕 or 离开屏幕时
// 自动触发回调函数

// 比如：

// 图片懒加载

// 广告曝光统计

// 无限滚动

// 你的需求（按钮离开屏幕自动关闭）
onBeforeUnmount(() => {
  observer?.disconnect()// 组件卸载时断开观察器与所有目标元素的连接，避免内存泄漏
})
const listdata = ref([])
const totalNum = ref(0)
const handleSizeChange = (val) => {
  page.value.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  page.value.pageNum = val
  getListData()
}
const getListData = async () => {
  const res = await getStaffList(page.value)
  console.log(res.data);
  listdata.value = res.data.list
  totalNum.value = res.data.total
  listdata.value.forEach(ele => {
  ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD')
 })
}
const beforeClose = () => {
  dialogTableVisible.value = false
  form.value = {...initData}
  formRef.value?.clearValidate() //清除上一次的验证状态，防止下次打开时验证状态异常
}

const formRef = ref()
const form = ref({...initData})
const confirm = async () => {
  try{
    await formRef.value.validate()
    const res = await lockedRequest(form.value)
    if(res.code !== 10000){
      throw new Error(res.message || '添加失败')
    }
    ElMessage.success('添加成功')
    getListData()
    beforeClose()
  } catch(err){
    ElMessage.error(err.message || '添加失败')
  }
  console.log(form.value)
}
const onADD = () => {
  sign.value = true
  formRef.value?.clearValidate()
  dialogTableVisible.value = true
}
const onEDIT = (scope) => {
  sign.value=false
  form.value = {...scope.row}
  formRef.value?.clearValidate()
  dialogTableVisible.value = true
}
const rule = {
  name:rules.name,
  avatar:rules.avatar,
  mobile:rules.phone,
  sex:rules.sex,
  age:rules.age,
  active:rules.active
}
//头像预览
const dialogImage = ref(false)
const photoList = ref([])
const beforeCloseImage = () => {
  dialogImage.value = false
}
onMounted(async () => {
  let res = await getStaffPhoto()
  photoList.value = res.data
  getListData()
})
const selectIndex = ref(0)
const confirmImage = () => {
  form.value.avatar = photoList.value[selectIndex.value].url
  dialogImage.value = false
}
const DeleteList = ref([])
const handleSelectionChange = (val) => {
  DeleteList.value = val
  console.log('选中项发生变化：', DeleteList.value);
}
const confirmEvent = async () => {
  if(DeleteList.value.length === 0){
    ElMessage.warning('请至少选择一项')
    return
  }
  console.log('确认删除', DeleteList.value);
  try{
    const res = await deleteRequest({id:DeleteList.value.map(item => item.id)})
    if(res.code !== 10000){
      throw new Error(res.message || '删除失败')
    }
    ElMessage.success('删除成功')
    getListData()
  } catch(err){
    ElMessage.error(err.message || '删除失败')
  }

}
const cancelEvent = () => {
  console.log('取消删除');
}
</script>
<template>
 <el-button :icon="Plus" type="primary"  @click="onADD">新增</el-button>
 <el-popconfirm
    ref="popconfirmRef"
    width="220"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="确定要删除吗？"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
    @show="startObserve"
    @hide="stopObserve"
  >
    <template #reference>
      <el-button :icon="Delete" type="danger" ref="deleteBtnRef" >删除</el-button>
    </template>
    <template #actions="{ confirm, cancel }">
      <el-button  size="small" @click="cancel">取消</el-button>
      <el-button
        type="danger"
        size="small"
        @click="confirm"
      >
        确定
      </el-button>
    </template>
  </el-popconfirm>
 <el-dialog v-model="dialogTableVisible" :before-close="beforeClose" :title="sign ? '陪护师添加' : '陪护师编辑'" width="500">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rule" hide-required-asterisk="true">
      <el-form-item v-show="false"  prop="id">
        <el-input v-model="form.id" > </el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"> </el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImage = true">上传头像</el-button>
        <el-image v-else :src="form.avatar" fit="cover" style="width: 100px; height: 100px"></el-image>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别" style="width: 240px">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" placeholder="请输入年龄" :min="1" :max="50"></el-input-number>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"> </el-input>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImage"
    :before-close="beforeCloseImage"
    title="图片预览"
    width="680"
  >
  <div class="image-list">
    <div v-for="(photo,index) in photoList" :key="photo.name" class='img-box' @click="selectIndex = index">
      <div v-if="selectIndex === index" class="select">
        <el-icon color="#fff"><Check /></el-icon>
      </div>
      <el-image :src="photo.url" width="148px" height="148px" ></el-image>
    </div>
  </div>
  <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-table :data="listdata" v-if="listdata && listdata.length > 0" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" ></el-table-column>
    <el-table-column prop="id" label="ID" ></el-table-column>
    <el-table-column prop="name" label="昵称" ></el-table-column>
      <el-table-column prop="avatar" label="头像" >
        <template #default="scope">
          <el-image :src="scope.row.avatar" fit="cover" style="width: 50px; height: 50px" ></el-image>
        </template>
      </el-table-column>
    <el-table-column prop="mobile" label="手机号" ></el-table-column>
      <el-table-column prop="sex" label="性别" >
        <template #default="scope">
          <span>{{scope.row.sex === '1' ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" ></el-table-column>
      <el-table-column prop="create_time" label="创建时间" >
        <template #default="scope">
          <div class="time-cell">
            <el-icon><Clock /></el-icon>
            <span>{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="active" label="状态" >
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success':'danger'">{{ scope.row.active ? '正常':'失效' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="onEDIT(scope)" >编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <no-data v-else></no-data>
  <div class="pagination-info" v-if="listdata && listdata.length > 0">
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
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.time-cell {
  display: inline flow;
  align-items: center;
  gap: 2px;
}


</style>
