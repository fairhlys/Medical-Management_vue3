import req from "@/utils/ReqRes";
export const adminGetList = ({pageNum,pageSize}) => {
  return req.get('/auth/admin',{
    params:{
      pageNum,
      pageSize
    }
  })
}
export const adminMenuData = () =>{
  return req.get('/menu/selectlist')
}
export const adminUpdate = ({name, permissions_id}) => {
  return req.post('/update/user',{
    name,
    permissions_id
  })
}
