<script setup>
import {ref,onBeforeUnmount} from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
// import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores';
import { login, GetValidCode, RegisterCode } from '@/api/login'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const form = ref()
const router = useRouter()
const showState = ref(true)
//true就是要登录，false就是要注册
const imgUrl = new URL('../../../public/images/login-head.png',import.meta.url).href
const formData = ref({
  phone: '',
  passWord: '',
  validCode:''
})
const handlechange = function(){
  showState.value = !showState.value
  formData.value.phone = ''
  formData.value.passWord = ''
  formData.value.validCode = ''

}
const userStore = useUserStore()
const loginstate = ref(false)
const LoginHandle = async function(){
  if(loginstate.value) return
  loginstate.value = true
  try{
    await form.value.validateField('phone')
    await form.value.validateField('passWord')
    const res = await login(formData.value)
    if(res.code !== 10000){
      throw new Error(res.message)
    }
    userStore.setToken(res.data.token)
    userStore.setUserInfo(res.data.userInfo)
    ElMessage.success('登陆成功')
    router.push('/')
  } catch(err) {
    ElMessage.error(err?.message || '登录失败')
  } finally {
    loginstate.value =  false
  }

  // ElMessage.success(res.data)
}
//对于登录和注册应该使用状态锁
const registerstate = ref(false)
const  register = async () => {
  if(registerstate.value) return
  registerstate.value = true
  try{
  await form.value.validate()
  const res = await RegisterCode(formData.value)
  if(res.code !== 10000){
    throw new Error(res.message)
  }
  ElMessage.success('注册成功')
  handlechange()
  console.log(res);
  }catch(err){
    ElMessage.error(err?.message || '注册失败')
  } finally {
    registerstate.value = false
  }
}
const rules = {
   phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur',
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    }
  ],
  passWord: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      pattern:/^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'change'
    }
  ],
  validCode: [
     {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
    {
      pattern:/^\S{4}$/,
      message: '验证码必须是4位的非空字符',
      trigger: 'change'
    }
  ]
}
//发送短信
const countdown = ref({
  time: 60,
  validText: '获取验证码',
  timer: null,
  isCooling: false // 冷却锁
})
function startCountdown() {
  // 已在冷却中：不重复开启计时器
  if (countdown.value.isCooling) return

  countdown.value.isCooling = true
  countdown.value.time = 60
  countdown.value.validText = `剩余${countdown.value.time}秒`

  countdown.value.timer = setInterval(() => {
    countdown.value.time -= 1

    if (countdown.value.time <= 0) {
      clearInterval(countdown.value.timer)
      countdown.value.timer = null
      countdown.value.isCooling = false
      countdown.value.time = 60
      countdown.value.validText = '获取验证码'
      return
    }

    countdown.value.validText = `剩余${countdown.value.time}秒`
  }, 1000)
}
const validLoading = ref(false)//防止验证码请求还未回来，用户又连续点击,也就是请求锁，当开始一次请求时，由于请求还未结束，也就还没有到finally阶段，也就不能再次请求
async function getCode() {
  // 冷却期间直接拦截（节流效果）
  if (countdown.value.isCooling || validLoading.value) return
  validLoading.value = true
  try {
  await form.value.validateField('phone')
  const res = await GetValidCode({ tel: formData.value.phone })
  if (res.code !== 10000) {
    throw new Error(res.message)
  }
  startCountdown()//请求完成后，就可以开始冷却锁了，此时同样不能发送请求，并且还有60s的限制，不过必须是请求成功才会开启冷却锁，否则进入finally阶段，就还可以发送请求
} catch (err) {
  ElMessage.error(err?.message || '验证码发送失败')
} finally{
  validLoading.value = false
}
}
onBeforeUnmount(() => {
  if (countdown.value.timer) {
    clearInterval(countdown.value.timer)
    countdown.value.timer = null
  }
})
</script>
<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px;">
      <template v-slot:header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handlechange">{{ showState ? '注册用户' : '返回登录' }}</el-link>
      </div>
      <el-form
    ref="form"
    label-position="left"
    label-width="auto"
    :model="formData"
    style="max-width: 600px"
    :rules="rules"
  >
    <div v-show="showState">
      <el-form-item  prop="phone">
        <el-input :prefix-icon="User" placeholder="手机号" v-model="formData.phone"  />
      </el-form-item>
      <el-form-item   prop="passWord">
        <el-input :prefix-icon="Lock" placeholder="密码" v-model="formData.passWord" />
      </el-form-item>
      <el-form-item>
          <el-button class="button" type="primary" :style="{width:'100%'}" auto-insert-space @click="LoginHandle">
            登录
          </el-button>
        </el-form-item>
    </div>
    <div v-show="!showState">
      <el-form-item  prop="phone">
        <el-input :prefix-icon="User" placeholder="手机号" v-model="formData.phone"  />
      </el-form-item>
      <el-form-item   prop="passWord">
        <el-input :prefix-icon="Lock" placeholder="密码" v-model="formData.passWord" />
      </el-form-item>
      <el-form-item   prop="validCode">
        <el-input  :prefix-icon="Lock" placeholder="验证码" v-model="formData.validCode" >
        <template #append>
          <span @click="getCode" class="validCode" :disabled="countdown.isCooling" >{{ countdown.validText }}</span>
        </template>
        </el-input>
      </el-form-item>
      <el-form-item>
          <el-button class="button" type="primary" :style="{width:'100%'}" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
    </div>
  </el-form>
    </el-card>
  </el-row>
</template>
<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
    .validCode {
      cursor: pointer;
    }
  }
</style>
