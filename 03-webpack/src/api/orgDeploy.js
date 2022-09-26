import request from '@/utils/request'

const Url = {
  quota: '/mechanism/mcIc',
  video: '/mechanism/mcIcPhoto',
  pay: '/mechanism/mcIcPay'
}

// 机构权限-获取机构对应的菜单权限
export function getPremMenu(mechanismId) {
  return request({
    url: `/system/mechanism/menu/rel/${mechanismId}`,
    method: "get"
  })
}
// 机构权限-保存机构对应的菜单权限
export function putPremMenu(data) {
  return request({
    url: `/system/mechanism/menu/rel`,
    method: "put",
    data
  })
}
// 机构权限-从当前机构的顶级机构同步菜单
export function getPremMenuCopy(params) {
  return request({
    url: `/system/mechanism/menu/rel/sync`,
    method: "get",
    params
  })
}




// 机构功能-详情
export function getMcFeatureDetail(mechanismId) {
  return request({
    url: `/mechanism/mcFeature/${mechanismId}`,
    method: "get",
  })
}
// 机构功能-新增
export function postMcFeature(data) {
  return request({
    url: '/mechanism/mcFeature',
    method: "post",
    data
  })
}
// 机构功能-开启同步上级
export function getMcFeatureSync(params) {
  return request({
    url: '/mechanism/mcFeature/openSync',
    method: "get",
    params
  })
}





// 保险公司配置-获取机构关联的保司Code数据集合
export function getOrgIcs(params, type) {
  return request({
    url: Url[type] + `/bind/ic`,
    method: "get",
    params
  })
}
// 保险公司配置-新增关联保司(每次都修改为最新的请求数据)
export function postOrgIcsAdd(data, type) {
  return request({
    url: Url[type] + `/bind/ic`,
    method: "post",
    data
  })
}
// 保险公司配置-详情（报价/影像/支付）
export function getOrgIcDetail(params, type) {
  return request({
    url: Url[type],
    method: "get",
    params
  })
}
// 保险公司配置-新增（报价/影像/支付）
export function postOrgIcAdd(data, type) {
  return request({
    url: Url[type],
    method: "post",
    data
  })
}
// 保险公司配置-开启同步上级配置（报价/影像/支付）
export function getOrgIcOpenSync(params, type) {
  return request({
    url: Url[type] + '/openSync',
    method: "get",
    params
  })
}





// 险种配置-详情
export function getRiskDetail(mechanismId) {
  return request({
    url: `/mechanism/mcInsurance/${mechanismId}`,
    method: "get",
  })
}
// 险种配置-新增
export function postRiskAdd(data) {
  return request({
    url: '/mechanism/mcInsurance',
    method: "post",
    data
  })
}
// 保险公司配置-开启同步上级配置
export function getRiskOpenSync(params) {
  return request({
    url: '/mechanism/mcInsurance/openSync',
    method: "get",
    params
  })
}



// 赠送配置-详情
export function getPresentDetail(mechanismId) {
  return request({
    url: `/mechanism/mcGiveAway/list/${mechanismId}`,
    method: "get",
  })
}
// 赠送配置-新增
export function postPresentAdd(data) {
  return request({
    url: '/mechanism/mcGiveAway',
    method: "post",
    data
  })
}
// 赠送配置-开启同步上级配置
export function getPresentOpenSync(params) {
  return request({
    url: '/mechanism/mcGiveAway/openSync',
    method: "get",
    params
  })
}




// 车辆信息配置-详情
export function getVehicleDetail(mechanismId) {
  return request({
    url: `/mechanism/mcVehicle/${mechanismId}`,
    method: "get",
  })
}
// 车辆信息配置-新增
export function postVehicleAdd(data) {
  return request({
    url: '/mechanism/mcVehicle',
    method: "post",
    data
  })
}
// 车辆信息配置-开启同步上级配置
export function getVehicleOpenSync(params) {
  return request({
    url: '/mechanism/mcVehicle/openSync',
    method: "get",
    params
  })
}

