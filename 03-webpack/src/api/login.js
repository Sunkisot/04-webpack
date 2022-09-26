import request from '@/utils/request'
/**
 * @Description 登录接口
 * @Param username 账号
 * @Param password 密码
 * @Param code 验证码
 * @Param uuid 验证图片id
 */
export function login (data) {
  return request({
    url: '/system/login/operation',
    method: 'post',
    data,
    shade: false,
  })
}

// // 获取用户详细信息
// export function getUserInfo() {
//   return request({
//     url: '/test/getUserInfo',
//     method: 'post',
//     shade: false,
//   })
// }
 
// 退出登录方法
export function logout() {
  return request({
    url: '/system/logout/operation',
    method: 'get',
    shade: false,
  })
}
