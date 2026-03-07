<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getDashboardData } from '@/api/dashboard'

const dashboardData = ref({
  user: {},
  types: [],
  typeList: []
})

const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChartInstance = null
let pieChartInstance = null

const toInt = (value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.trunc(num)
}

const toMoney = (value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Number(num.toFixed(2))
}

const totalOrderCount = computed(() => {
  return dashboardData.value.types
    .filter(item => ['待服务', '已完成'].includes(item.state))
    .reduce((sum, item) => sum + toInt(item.num), 0)
})

const totalOrderMoney = computed(() => {
  return dashboardData.value.typeList.reduce((sum, item) => sum + toMoney(item.order_money), 0)
})

const stateTypeMap = {
  待支付: 'warning',
  待服务: 'primary',
  已完成: 'success',
  已取消: 'info'
}

const stateCardClassMap = {
  待支付: 'pending-pay',
  待服务: 'pending-service',
  已完成: 'finished',
  已取消: 'cancelled'
}

const initTrendChart = () => {
  if (!trendChartRef.value) return
  if (!trendChartInstance) {
    trendChartInstance = echarts.init(trendChartRef.value)
  }
  const xAxisData = dashboardData.value.typeList.map(item => item.date)
  const orderCountData = dashboardData.value.typeList.map(item => toInt(item.order_sum))
  const orderMoneyData = dashboardData.value.typeList.map(item => toMoney(item.order_money))

  trendChartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const items = Array.isArray(params) ? params : [params]
        const date = items[0]?.axisValue || ''
        const lines = items.map(item => {
          if (item.seriesName === '订单金额') {
            return `${item.marker}${item.seriesName}：¥${toMoney(item.value)}`
          }
          return `${item.marker}${item.seriesName}：${toInt(item.value)}`
        })
        return [date, ...lines].join('<br/>')
      }
    },
    legend: {
      data: ['订单数量', '订单金额'],
      top: 8
    },
    grid: {
      top: 80,
      left: 20,
      right: 20,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: { alignWithLabel: true }
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数量',
        minInterval: 1,
        axisLabel: {
          formatter: value => `${toInt(value)}`
        }
      },
      {
        type: 'value',
        name: '订单金额',
        max: 100,
        axisLabel: {
          formatter: value => `${toMoney(value)}`
        }
      }
    ],
    series: [
      {
        name: '订单数量',
        type: 'bar',
        barWidth: 24,
        data: orderCountData,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '订单金额',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: orderMoneyData,
        lineStyle: {
          width: 3,
          color: '#67C23A'
        },
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  })
}

const initPieChart = () => {
  if (!pieChartRef.value) return
  if (!pieChartInstance) {
    pieChartInstance = echarts.init(pieChartRef.value)
  }
  const pieData = dashboardData.value.types.map(item => ({
    name: item.state,
    value: toInt(item.num)
  }))
  pieChartInstance.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      left: 'center'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '65%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        data: pieData
      }
    ]
  })
}

const renderCharts = async () => {
  await nextTick()
  initTrendChart()
  initPieChart()
}

const handleResize = () => {
  trendChartInstance?.resize()
  pieChartInstance?.resize()
}

const disposeCharts = () => {
  trendChartInstance?.dispose()
  pieChartInstance?.dispose()
  trendChartInstance = null
  pieChartInstance = null
}

const loadDashboardData = async () => {
  try {
    const res = await getDashboardData()
    const data = res?.data || {}
    dashboardData.value = {
      user: data.user || {},
      types: Array.isArray(data.types) ? data.types : [],
      typeList: Array.isArray(data.typeList) ? data.typeList : []
    }
  } catch {
    dashboardData.value = {
      user: {},
      types: [],
      typeList: []
    }
    ElMessage.error('获取看板数据失败')
  }
  renderCharts()
}

watch(
  () => [dashboardData.value.typeList, dashboardData.value.types],
  () => {
    renderCharts()
  },
  { deep: true }
)

onMounted(() => {
  loadDashboardData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  disposeCharts()
})
</script>
<template>
  <div class="dashboard-page">
    <el-row :gutter="16" class="mb-16">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="user-card">
          <div class="user-content">
            <el-avatar :size="64" :src="dashboardData.user.user_img" />
            <div class="user-info">
              <div class="name-row">
                <span class="name">{{ dashboardData.user.user_name || '未知用户' }}</span>
                <el-tag :type="dashboardData.user.permission === 'root' ? 'danger' : 'info'">
                  {{ dashboardData.user.permission || 'unknown' }}
                </el-tag>
              </div>
              <div class="ip">登录IP：{{ dashboardData.user.ip || '--' }}</div>
              <div class="summary">
                总订单数(待服务+已完成)：<b>{{ totalOrderCount }}</b>
                <span class="divider">|</span>
                总金额：<b>¥{{ totalOrderMoney }}</b>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-row :gutter="12">
          <el-col
            v-for="item in dashboardData.types"
            :key="item.state"
            :xs="12"
            :md="12"
            class="mb-12"
          >
            <el-card
              shadow="hover"
              class="state-card"
              :class="stateCardClassMap[item.state]"
            >
              <div class="state-label">{{ item.state }}</div>
              <div class="state-value">{{ item.num }}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="16" class="mb-16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">近5日订单趋势报表</div>
          </template>
          <div ref="trendChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8" class="mb-16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">订单状态分布报表</div>
          </template>
          <div ref="pieChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">订单状态明细</div>
      </template>
      <el-table :data="dashboardData.types" stripe>
        <el-table-column prop="state" label="状态" />
        <el-table-column prop="num" label="数量" />
        <el-table-column label="标签">
          <template #default="scope">
            <el-tag :type="stateTypeMap[scope.row.state] || 'info'">{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<style scoped lang="less">
.dashboard-page {
  .mb-16 {
    margin-bottom: 16px;
  }

  .mb-12 {
    margin-bottom: 12px;
  }

  .user-card,
  .state-card,
  .chart-card,
  .table-card {
    border-radius: 10px;
  }

  .user-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .user-info {
    flex: 1;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .name {
    font-size: 20px;
    font-weight: 700;
    color: #303133;
  }

  .ip,
  .summary {
    color: #606266;
    margin-top: 4px;
  }

  .divider {
    margin: 0 8px;
    color: #c0c4cc;
  }

  .state-card {
    min-height: 95px;

    .state-label {
      color: #606266;
      font-size: 14px;
    }

    .state-value {
      margin-top: 8px;
      font-size: 28px;
      font-weight: 700;
      color: #303133;
    }
  }

  .pending-pay {
    border-left: 4px solid #e6a23c;
  }

  .pending-service {
    border-left: 4px solid #409eff;
  }

  .finished {
    border-left: 4px solid #67c23a;
  }

  .cancelled {
    border-left: 4px solid #909399;
  }

  .card-header {
    font-weight: 600;
    color: #303133;
  }

  .chart-box {
    width: 100%;
    height: 320px;
  }
}
</style>
