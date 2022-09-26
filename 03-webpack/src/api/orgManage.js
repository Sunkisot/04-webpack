import request from '@/utils/request'


// 机构列表-添加机构
export function postAddOrg(data) {
  return request({
    url: '/mechanism/add',
    method: "post",
    data
  })
}
// 机构列表-编辑机构
export function putAddOrg(data) {
  return request({
    url: '/mechanism/edit',
    method: "put",
    data
  })
}
// 机构列表-机构详情
export function getOrgDetail(id) {
  return request({
    url: `/mechanism/detail/${id}`,
    method: "get"
  })
}
// 机构列表-子机构树
export function getOrgSonTree(params) {
  return request({
    url: '/mechanism/subTree',
    method: "get",
    params
  })
}

// 机构列表-删除机构
export function delOrg(id) {
  return request({
    url: `/mechanism/delete/${id}`,
    method: "delete",
  })
}
// 机构列表-启用/禁用机构
export function editStatusOrg(id, status) {
  return request({
    url: `/mechanism/edit/status/${id}/${status}`,
    method: "put",
  })
}
// 机构列表-计费政策-新增
export function postMcBilling(data) {
  return request({
    url: `/mechanism/mcBilling`,
    method: "post",
    data
  })
}
// 机构列表-计费政策-编辑
export function putMcBilling(data) {
  return request({
    url: `/mechanism/mcBilling`,
    method: "put",
    data
  })
}
// 机构列表-计费政策-详情
export function getMcBillingDetail(mechanismId) {
  return request({
    url: `/mechanism/mcBilling/${mechanismId}`,
    method: "get",
  })
}
// 机构列表-机构充值-充值
export function postRecharge(data) {
  return request({
    url: `/mechanism/record/recharge`,
    method: "post",
    data
  })
}
// 机构列表-机构充值-详情
export function getRechargeDetail(mechanismId) {
  return request({
    url: `/mechanism/record/dialog/${mechanismId}`,
    method: "get",
  })
}






// 机构角色配置-添加角色
export function postAddRole(data) {
  return request({
    url: '/system/mechanism/role',
    method: "post",
    data
  })
}
// 机构角色配置-修改角色
export function putAddRole(data) {
  return request({
    url: '/system/mechanism/role',
    method: "put",
    data
  })
}
// 机构角色配置-删除角色
export function delRole(params) {
  return request({
    url: '/system/mechanism/role',
    method: "delete",
    params
  })
}
// 机构角色配置-角色详情
export function getRoleDetail(params) {
  return request({
    url: '/system/mechanism/role/detail',
    method: "get",
    params
  })
}
// 机构角色配置-获取权限菜单树,树形结构
export function getMenuTree(params) {
  return request({
    url: '/system/mechanism/menu/tree',
    method: "get",
    params
  })
}
// 机构角色配置-角色下拉列表
export function getRoleOptions() {
  return request({
    url: '/system/mechanism/role/optionList',
    method: "get"
  })
}



// 机构成员配置-添加成员
export function postAddUser(data) {
  return request({
    url: '/system/mechanism/user',
    method: "post",
    data
  })
}
// 机构成员配置-修改成员
export function putAddUser(data) {
  return request({
    url: '/system/mechanism/user',
    method: "put",
    data
  })
}
// 机构成员配置-删除成员
export function delUser(params) {
  return request({
    url: '/system/mechanism/user',
    method: "delete",
    params
  })
}
// 机构成员配置-成员详情
export function getUserDetail(params) {
  return request({
    url: '/system/mechanism/user/detail',
    method: "get",
    params
  })
}
// 机构成员配置-成员 禁用/启用
export function getUserStatus(params) {
  return request({
    url: '/system/mechanism/user/disableOrEnable',
    method: "get",
    params
  })
}

