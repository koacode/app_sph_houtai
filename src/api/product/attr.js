// 平台属性管理模块请求数据
import request from '@/utils/request'

// 获取一级分类数据接口
export const reqCategory1List = () => request({url:'/admin/product/getCategory1',method:'get'})

// 获取二级分类数据接口
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// 获取三级分类数据接口
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 获取平台属性的接口
export const reqAttrList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性与修改属性接口
// 携带参数但是不是直接传给路由，即参数不在地址栏展示
export const reqAddOrUpdateAttr = (data) => request({url:'/admin/product/saveAttrInfo',method:'post',data})