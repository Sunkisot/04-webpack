import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
Vue.use(VueI18n)

const reqEn = require.context('.', false, /en.js$/)
const reqZh = require.context('.', false, /zh.js$/)

const requireAll = file => file.keys().reduce((modules, e) => {
  modules = Object.assign(modules, file(e).default)
  return modules
}, {})

const messages = {
  en: {
    ...elementEnLocale,
    ...requireAll(reqEn)
  },
  zh: {
    ...elementZhLocale,
    ...requireAll(reqZh)
  }
}

const i18n = new VueI18n({
  // 设置语言 选项 en | zh
  locale: Cookies.get('language') || 'zh',
  // 设置文本内容
  messages,
  silentTranslationWarn: true
})

export default i18n
