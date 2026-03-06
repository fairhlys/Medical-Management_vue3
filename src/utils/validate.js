export const rules = {
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
  ],
  name: [
    {
      required: true,
      message:'请输入名称',
      trigger:'blur'
    }
  ],
  avatar:[
    { required: true, message: '请上传头像', trigger: 'change' }
  ],
  sex:[
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age:[
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  active:[
    { required: true, message: '请选择是否生效', trigger: 'change' }
  ]
}
