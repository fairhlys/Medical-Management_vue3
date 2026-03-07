import request from '@/utils/ReqRes'

export const getDashboardData = () => {
  return request.get('/report')
}
