// 引入商品管理相关的接口文件
import * as trademark from './product/trademark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
// 权限管理相关的接口文件
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
// 对外暴露
export default {
  trademark,
  attr,
  sku,
  spu,
  user,
  role,
  permission,
}
