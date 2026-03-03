import req from '@/utils/ReqRes'
//菜单权限数据
export const groupMenuData = () =>{
  return req.get('/user/getmenu')
}
export const groupNewMenu = ({name,permissions,id}) => {
  return req.post('/user/setmenu',{
    name,
    permissions,
    id
  })
}
export const groupGetList = ({pageNum,pageSize}) => {
  return req.get('/menu/list',{
    params:{
      pageNum,
      pageSize
    }
  })
}
