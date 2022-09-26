import request from '@/utils/request'

export function getCodeTypeList(data) {
  return request({
    url: '/test/gg_code/find_list',
    method: 'post',
    data,
    shade: false,
  })
}
export function getUrlList(url, data, type = 'get') {
  return request({
    url: url,
    method: type,
    params: type == 'get' ? data : {},
    data: type == 'post' ? data : {},
    shade: false,
  })
}
export function getPoNameList(data) {
  return request({
    url: '/test/gg_code/find_other_list',
    method: 'post',
    data,
    shade: false,
  })
}
export function getSelectList(type = 'codeType', data, url) {
  switch (type) {
    case 'codeType':
      return getCodeTypeList(data)
    case 'url':
      return getUrlList(url, data)
    case 'poName':
      return getPoNameList(data)
  }
}
