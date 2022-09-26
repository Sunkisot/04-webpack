import variables from '@/assets/styles/element-variables.scss'
import variable from '@/assets/styles/variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, sidebarName } = defaultSettings
export default {
  namespaced: true,
  state: {
    theme: variables.theme, // 主题颜色
    warning: variable.yellow,
    success: variable.green,
    danger: variable.red,
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo, // 是否展示sidebar上的Logo
    sidebarName,
  },
  mutations: {
    CHANGE_SETTINGS: (state, obj) => {
      for (var key in obj) {
        if (state.hasOwnProperty(key)) {
          state[key] = obj[key]
        }
      }
    }
  },
  actions: {
    ChangeSettings({ commit }, obj) {
      commit('CHANGE_SETTINGS', obj)
    }
  }
}