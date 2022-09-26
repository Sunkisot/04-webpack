import Cookies from 'js-cookie'

export default {
  namespaced: true,
  state: {
    language: Cookies.get('language') || 'zh', // 国际化
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // sidebar是否是展开的状态 true是展开
      withoutAnimation: false
    },
    device: "desktop", // 登录终端
    size: Cookies.get('size') || 'medium', // 全局尺寸
    loading: false, // 遮罩
    previewImg: false, // 预览图片
    previewImgList: []  // 预览的图片list
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    TOGGLE_SIDEBAR: (state) => { // 切换sidebar
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      Cookies.set('sidebarStatus', state.sidebar.opened ? 1 : 0)
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => { // 关闭sidebar
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
      Cookies.set('sidebarStatus', 0)
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE(state, size) {
      state.size = size
      Cookies.set('size', size)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_PREVIEWIMG(state, previewImg) {
      state.previewImg = previewImg
    },
    SET_PREVIEWIMGLIST(state, previewImgList) {
      state.previewImgList = previewImgList
    }
  },
  actions: {
    SetLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    ToggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSidebar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SetSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    SetLoading({commit}, loading) {
      commit('SET_LOADING', loading)
    },
    SetPreviewImg({commit}, {visable, imgList}) {
      if(visable) {
        commit('SET_PREVIEWIMG', true)
        commit('SET_PREVIEWIMGLIST', imgList)
      }else {
        commit('SET_PREVIEWIMG', false)
        commit('SET_PREVIEWIMGLIST', [])
      }
    }

  }
}
