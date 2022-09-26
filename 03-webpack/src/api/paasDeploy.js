import request from '@/utils/request'

// 报价短信模板-修改模板
export function putSMS(data) {
  return request({
    url: '/system/messageTemplate',
    method: "put",
    data
  })
}
// 报价短信模板-模板详情
export function getSMSDetail(params) {
  return request({
    url: '/system/messageTemplate/detail',
    method: "get",
    params
  })
}
// 报价短信模板-开启同步上级配置
export function getOpenSync(params) {
  return request({
    url: '/system/messageTemplate/openSync',
    method: "get",
    params
  })
}




// 角色列表
export function getRoleList(params) {
  return request({
    url: '/system/operation/role/list',
    method: "get",
    params
  })
}
// 添加角色
export function postAddRole(data) {
  return request({
    url: '/system/operation/role',
    method: "post",
    data
  })
}
// 修改角色
export function putAddRole(data) {
  return request({
    url: '/system/operation/role',
    method: "put",
    data
  })
}
// 删除角色
export function delRole(params) {
  return request({
    url: '/system/operation/role',
    method: "delete",
    params
  })
}
// 角色详情
export function getRoleDetail(params) {
  return request({
    url: '/system/operation/role/detail',
    method: "get",
    params
  })
}
// 角色获取权限菜单树,树形结构
export function getMenuTree(params) {
  return request({
    url: '/system/operation/menu/tree',
    method: "get",
    params
  })
}


// 添加成员
export function postAddUser(data) {
  return request({
    url: '/system/operation/user',
    method: "post",
    data
  })
}
// 修改成员
export function putAddUser(data) {
  return request({
    url: '/system/operation/user',
    method: "put",
    data
  })
}
// 删除成员
export function delUser(params) {
  return request({
    url: '/system/operation/user',
    method: "delete",
    params
  })
}
// 成员详情
export function getUserDetail(params) {
  return request({
    url: '/system/operation/user/detail',
    method: "get",
    params
  })
}
// 成员 禁用/启用
export function getUserStatus(params) {
  return request({
    url: '/system/operation/user/disableOrEnable',
    method: "get",
    params
  })
}
