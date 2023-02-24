// 这个模块主要获取的是品牌管理的数据的模块
import request from '@/utils/request'

// 获取品牌列表接口
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,methods:'get'})

// 处理添加品牌|修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if(tradeMark.id){
    // 带给服务器的数据携带id----修改
    return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
  }else{
    // 带给服务器的数据没有携带id---新增品牌
    return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
  }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})