
import { constantRoutes, addRoutes } from '@/router' // 基础路由 前端新增路由 

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param permissions 权限树
 */
function filterAsyncRoutes(routes, permissions) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    permissions.forEach(p => {
      if (tmp.perms && p.perms && tmp.perms == p.perms) {
        if (tmp.children && p.child) {
          tmp.children = filterAsyncRoutes(tmp.children, p.child)
        } else {
          tmp.children = []
        }
        res.push(tmp)
      }
    })

  })

  return res
}
/**
 * 通过递归过滤权限树取出btn权限
 * @param routes asyncRoutes
 * @param permissions 权限树
 */
function filterPermissions(permissions) {
  let res = []
  permissions.forEach(prem => {
    prem.child && prem.child.forEach(e => {
      e.child && e.child.forEach(v => {
        res.push(v.perms)
      })
    })
  })
  return res
}

export default {
  namespaced: true,
  state: {
    routes: [], // 当前展示的路由
    addRoutes: [], // 添加的路由
    btnPrems: [], // 按钮权限
    isInject: false // 是否注入路由
  },
  mutations: {
    SET_ROUTES(state, asyncRoutes) {
      state.addRoutes = asyncRoutes
      state.routes = constantRoutes.concat(asyncRoutes)
    },
    SET_BTNPREMS(state, btnPrems) {
      state.btnPrems = btnPrems
    },
    SET_ISINJECT(state, isInject) {
      state.isInject = isInject
    }
  },
  actions: {
    GenerateRouter({ commit, rootGetters: { isAdmin, permissions } }) {
      console.log(isAdmin, permissions)
      return new Promise(resolve => {
        let routes = []
        if (isAdmin == '1') { // 超管权限
          routes = addRoutes
        } else {
          routes = filterAsyncRoutes(addRoutes, permissions)
          var btnPrems = filterPermissions(permissions)
          commit('SET_BTNPREMS', btnPrems)
        }
        commit('SET_ROUTES', routes)
        commit('SET_ISINJECT', true)
        resolve(routes)
      })
    }
  }
}