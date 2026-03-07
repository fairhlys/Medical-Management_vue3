<script setup>
import { getOrderList, OrderStateChange } from '@/api/order';
import { InfoFilled } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';
import { createRequestLock } from '@/utils/lock';
import NoData from '@/components/NoData.vue';
const orderList = ref([]);
const page = ref({
  pageNum: 1,
  pageSize: 10,
  out_trade_no:''
});
const totalNum = ref(0);
const getListData = async () => {
  const res = await getOrderList(page.value);
  orderList.value = res.data.list;
  totalNum.value = res.data.total;
}
onMounted(getListData);
const handleSizeChange = (val) => {
  page.value.pageSize = val;
  page.value.pageNum = 1;
  getListData();
}
const handleCurrentChange = (val) => {
  page.value.pageNum = val;
  getListData();
}
const stateObj = {
  '已取消':'info',
  '待支付':'danger',
  '已完成':'success',
  '待服务':'warning'
}
const stateMap = (key) => {
  return stateObj[key] || 'info';
}
const confirmLock = createRequestLock(OrderStateChange);
const confirmEvent = async (orderId) => {
  // 这里可以调用接口，确认订单已完成
  // 例如：
  // await confirmOrder(orderId);
  // 然后刷新订单列表
  await confirmLock(orderId);
  getListData();
}

const subMitSearch = async () => {
   await getListData();
   page.value = {
    pageNum: 1,
    pageSize: 10,
    out_trade_no:''
   }
}
</script>
<template>
  <div class="form">
    <el-form :inline="true">
      <!-- 搜索表单内容 -->
      <el-form-item label="订单号" prop="out_trade_no">
        <el-input v-model="page.out_trade_no" placeholder="请输入订单号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="subMitSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-if="orderList && orderList.length > 0" :data="orderList" style="width: 100%">
    <el-table-column prop="out_trade_no" label="订单号" width="125" />
    <el-table-column prop="hospital_name" label="就诊医院" width="110" />
    <el-table-column prop="service_name" label="陪诊服务" width="90" />
    <el-table-column label="陪护师" width="135">
      <template #default="scope">
        <div style="display: flex; align-items: center; gap: 8px;">
          <el-image :src="scope.row.companion?.avatar" style="width: 40px; height: 40px; border-radius: 50%;" />
          <span>{{scope.row.companion ? scope.row.companion.name : '暂无'}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="companion[mobile]" label="陪护师号码" width="110" />
    <el-table-column prop="price" label="总价" width="60" />
    <el-table-column prop="starttime" label="下单时间" width="99" />
    <el-table-column prop="trade_state" label="订单状态" width="80 " >
      <template #default="scope">
        <el-tag :type="stateMap(scope.row.trade_state)">{{scope.row.trade_state}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态" width="80" />
    <el-table-column prop="tel" label="联系人号码" width="110" />
    <el-table-column label="操作" width="80">
      <template #default="scope">
        <el-popconfirm
          v-if="scope.row.trade_state === '待服务'"
          confirm-button-text="确认"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="#f56c6c"
          title="确认完成？"
          @confirm="confirmEvent"
        >
        <template #reference>
          <el-button type="primary" size="small" link>确认完成</el-button>
        </template>
        </el-popconfirm>
        <el-button v-else type="primary" size="small" disabled link>暂无服务</el-button>
      </template>
    </el-table-column>
  </el-table>
  <no-data v-else></no-data>
  <div class="pagination-info" v-if="orderList && orderList.length > 0">
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
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
