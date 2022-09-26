import Vue from 'vue'
const req = require.context('./', false, /.vue$/)

const requireAll = file => file.keys().reduce((modules, e) => {
  modules[e.match(/\w+.vue$/)[0].slice(0, -4)] = file(e).default
  return modules
}, {})
const components = requireAll(req)
for (var key in components) {
  var k = key.replace(/[A-Z]/g, (e, i) => {
    if (i === 0) {
      return e.toLowerCase()
    } else {
      return '-' + e.toLowerCase()
    }
  })
  Vue.component(k, components[key])
}