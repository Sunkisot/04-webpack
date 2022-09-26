export default {
  namespaced: true,
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEW: (state, route) => {
      if (state.visitedViews.some(view => view.path === route.path)) return
      state.visitedViews.push(Object.assign({}, route, {
        title: route.meta.title || 'no-name'
      }))
    },
    ADD_CACHED_VIEW: (state, route) => {
      if (state.cachedViews.includes(route.name)) return
      if (!route.meta.noCache) {
        state.cachedViews.push(route.name)
      }
    },
    DEL_VISITED_VIEW: (state, route) => {
      const i = state.visitedViews.findIndex(v => v.path == route.path)
      state.visitedViews.splice(i, 1)
    },
    DEL_CACHED_VIEW: (state, route) => {
      const i = state.cachedViews.findIndex(v => v == route.name)
      state.cachedViews.splice(i, 1)
    },
    DEL_OTHERS_VISITED_VIEWS: (state, route) => {
      state.visitedViews = state.visitedViews.filter(v => {
        return v.meta.affix || v.path == route.path
      })
    },
    DEL_OTHERS_CACHED_VIEWS: (state, route) => {
      const i = state.cachedViews.findIndex(v => v == route.name)
      if (i != -1) {
        state.cachedViews = state.cachedViews.slice(i, i + 1)
      }
    },
    DEL_ALL_VISITED_VIEWS: state => {
      state.visitedViews = state.visitedViews.filter(v => v.meta.affix)
    },
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = []
    },
    UPDATE_VISITED_VIEW: (state, route) => {
      var r = state.visitedViews.find(v => v.path == route.path)
      r = Object.assign(r, route)
    }
  },
  actions: {
    AddView({ dispatch }, route) {
      dispatch('AddVisitedView', route)
      dispatch('AddCachedView', route)
    },
    AddVisitedView({ commit }, route) {
      commit('ADD_VISITED_VIEW', route)
    },
    AddCachedView({ commit }, route) {
      commit('ADD_CACHED_VIEW', route)
    },
    DelView({ dispatch, state }, route) {
      return new Promise(async resolve => {
        await dispatch('DelVisitedView', route)
        await dispatch('DelCachedView', route)
        resolve({ ...state })
      })
    },
    DelVisitedView({ commit, state }, route) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', route)
        resolve([...state.visitedViews])
      })
    },
    DelCachedView({ commit, state }, route) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', route)
        resolve([...state.cachedViews])
      })
    },
    DelOthersViews({ dispatch }, route) {
      return new Promise(async resolve => {
        await dispatch('DelOthersVisitedViews', route)
        await dispatch('DelOthersCachedViews', route)
        resolve()
      })
    },
    DelOthersVisitedViews({ commit }, route) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', route)
        resolve()
      })
    },
    DelOthersCachedViews({ commit }, route) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', route)
        resolve()
      })
    },
    DelAllViews({ dispatch, state }) {
      return new Promise(async resolve => {
        await dispatch('DelAllVisitedViews')
        await dispatch('DelAllCachedViews')
        resolve({ ...state })
      })
    },
    DelAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    DelAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },
    UpdateVisitedView({ commit }, route) {
      commit('UPDATE_VISITED_VIEW', route)
    }
  }
}