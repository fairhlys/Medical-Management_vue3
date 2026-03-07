import request from "@/utils/ReqRes";
export const getOrderList = ({pageNum, pageSize,out_trade_no}) => {
  return request.get("/admin/order",{
    params:{
      pageNum,
      pageSize,
      out_trade_no
    }
  });
}
export const OrderStateChange = (id) => {
  return request.post("/update/order",{
    id
  });
}
