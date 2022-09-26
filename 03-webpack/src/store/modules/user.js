import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/token'
import Cookies from 'js-cookie'
import { gvUtil } from '@/utils/gvUtil'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    name: '',  // 用户名
    avatar: '', // 用户头像
    roles: [], // 
    permissions: gvUtil.getStroage('permissions') ? gvUtil.getStroage('permissions') : [], // 用户权限
    isAdmin: Cookies.get('isAdmin') || 0 // 是否是超级管理员权限
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
    SET_NAME(state, name) {
      state.name = name
    },
    SET_AVATAR(state, avatar) {
      state.avatar = avatar
    },
    SET_ROLES(state, roles) {
      state.roles = roles
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
      gvUtil.setStroage('permissions', permissions)
    },
    SET_ISADMIN(state, isAdmin) {
      state.isAdmin = isAdmin
      Cookies.set('isAdmin', isAdmin)
    }
  },
  actions: {
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          if (res && res.code == '00000') {
            commit('SET_TOKEN', res.data.token)
            commit('SET_NAME', res.data.username)
            commit('SET_ISADMIN', res.data.isAdmin || 0)
            commit('SET_PERMISSIONS', res.data.permissionTree)
            resolve(res)
          }else {
            reject(res)
          }
        }, err => {
          reject(err)
        })
      })
    },
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          gvUtil.removeStroage('permissions')
          Cookies.remove('isAdmin')
          removeToken()
          resolve()
        }, err => {
          reject(err)
        })
      })
    },
    // 前端错误登出
    ErrLogout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        gvUtil.removeStroage('permissions')
        Cookies.remove('isAdmin')
        removeToken()
        resolve()
      })
    }

  }
}
