import req from '@/utils/ReqRes'
export const getStaffPhoto = () => {
  return req.get('/photo/list')
}
export const addStaff = (data) => {
  return req.post('/companion',data)
}
export const getStaffList = (params) => {
  return req.get('/companion/list', { params })
}
export const deleteStaff = (id) => {
  return req.post(`/delete/companion`,id)
}
