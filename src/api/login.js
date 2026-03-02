import req from '@/utils/ReqRes';
// 将 axios 二次封装的实例进行引入
// 注意：前端表单使用的是 `phone`, `passWord`, `validCode`，但后端期望 `userName`,`passWord`,`validCode`
export const login = function(data){
  return req.post('/login',{
    userName: data.phone,
    passWord: data.passWord
  })
}

export const GetValidCode = (data) => {
  return req.post('/get/code',data)
}

export const RegisterCode = (data) => {
  return req.post('/user/authentication',{
    userName: data.phone,
    passWord: data.passWord,
    validCode: data.validCode
  })
}
