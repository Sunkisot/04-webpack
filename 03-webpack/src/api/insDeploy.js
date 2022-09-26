import request from '@/utils/request'

// 影像资料-新增
export function postAddVideo(data) {
  return request({
    url: '/insurance/imagematerial',
    method: "post",
    data
  })
}
// 影像资料-修改
export function putAddVideo(data) {
  return request({
    url: '/insurance/imagematerial',
    method: "put",
    data
  })
}
// 影像资料-详情
export function getVideoDetail(id) {
  return request({
    url: `/insurance/imagematerial/detail/${id}`,
    method: "get",
  })
}
// 影像资料-删除
export function delVideo(id) {
  return request({
    url: `/insurance/imagematerial/${id}`,
    method: "delete",
  })
}
// 影像资料-设置序号
export function putVideoNo(data) {
  return request({
    url: `/insurance/imagematerial/setNo`,
    method: "put",
    data
  })
}
// 影像资料-列表
export function getVideoList(params) {
  return request({
    url: `/insurance/imagematerial/list`,
    method: "get",
    params
  })
}
// 影像资料-复制影像资料
export function postVideoCopy(data) {
  return request({
    url: '/insurance/imagematerial/sync',
    method: "post",
    data
  })
}
// 影像资料-初始化配置
export function getVideoInit(params) {
  return request({
    url: '/insurance/imagematerial/init',
    method: "get",
    params
  })
}




// 区域化差异-详情
export function getAreaDetail(params) {
  return request({
    url: `/insurance/regionalizationDifference/detail`,
    method: "get",
    params
  })
}
// 区域化差异-修改
export function putAreaDetail(data) {
  return request({
    url: `/insurance/regionalizationDifference`,
    method: "put",
    data
  })
}
// 区域化差异-初始化配置
export function getAreaInit(params) {
  return request({
    url: `/insurance/regionalizationDifference/init`,
    method: "get",
    params
  })
}