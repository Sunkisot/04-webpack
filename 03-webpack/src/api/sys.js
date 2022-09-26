import request from '@/utils/request'

// 省市区树结构
export function getRegionTree(params) {
  return request({
    url: '/system/sys/region/tree',
    method: "get",
    params,
    shade: false
  })
}

// 上传图片
export function uploadFile(data) {
  return request({
    url: '/system/file/uploadPublic',
    method: "post",
    data,
  })
}

// 保险公司
export function getInsList(params) {
  return request({
    url: '/insurance/ic/optionList',
    method: "get",
    params,
    shade: false
  })
}

// 险种
export function getRiskList(params) {
  return request({
    url: '/insurance/coverage/list',
    method: "get",
    params,
    shade: false
  })
}

// 根据应用场景 + 关系类型查询关系字段列表
export function getInsField(params) {
  return request({
    url: '/insurance/configPrivyField/list',
    method: "get",
    params,
    shade: false
  })
}













export function getAutoSelect(url, data) {
  return request({
    url,
    method: "post",
    data,
    shade: false
  })
}