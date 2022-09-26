import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css' // 使所有浏览器呈现的样式一致

import Element from 'element-ui'
import '@/assets/styles/element-variables.scss' // element 主题变量修改样式

import './assets/styles/index.scss' // 全局样式
import './assets/styles/sys.scss' // 工具样式

import App from './App.vue'
import router from './permission'
import store from './store'

import './assets/icons' // icons

import gvUtil, { plugin } from './utils/gvUtil.js'
import directive from './utils/directive.js'
import filter from './utils/filter.js'
import mixins from './mixins/index'

import i18n from './lang' // 国际化

Vue.config.productionTip = false

Vue.use(gvUtil) // 工具类
Vue.use(directive) // 全局指令
Vue.use(filter) // 全局过滤器
Vue.mixin(mixins) // 全局混入

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// use添加i18n
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

import './components/index.js' // 全局组件

new Vue({
  router,
  store,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app')
