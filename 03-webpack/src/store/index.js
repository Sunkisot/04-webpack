import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const req = require.context('./modules', false, /.js$/)

const requireAll = file => file.keys().reduce((modules, e) => {
  modules[e.match(/\w+.js$/)[0].slice(0, -3)] = file(e).default
  return modules
}, {})

export default new Vuex.Store({
  modules: {
    ...requireAll(req)
  },
  getters
})
