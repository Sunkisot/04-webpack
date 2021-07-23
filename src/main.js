// import $ from 'jquery'

// $(function() {
//   $('li:odd').css('backgroundColor', 'red')
//   $('li:even').css('backgroundColor', 'blue')
  
// })
import './style/index.scss'
import './style/index.less'
import "jquery"


class Person {
  constructor(x) {
    this.age = 19
  }
  // static name = '张三'
}
var a = new Person(20)
console.log(a)

function* fn(a) {
  var b = yield a
  var c = yield b
  return c
}
let f = fn()
console.log(f.next()) 

console.log($,window.$,123)