/**
 * 缓存
 * @author 计昕奇
 * @time 2020/12/01
 */
var SimpleCache = function SimpleCache (maxSize) {
  // 保存数据的map
  this.map = {}

  // 缓存的最大容量，默认缓存20个对象
  this.maxSize = 20

  if (maxSize && maxSize !== '') {
    this.maxSize = maxSize
  }

  // 当前缓存的容量
  this.size = 0
}

SimpleCache.init = function (maxSize) {
  return new SimpleCache(maxSize)
}

SimpleCache.prototype = {

  /**
   * 根据key从缓存中取数据
   */
  get: function get (key) {
    if (this.map.hasOwnProperty(key)) {
      var obj = this.map[key]

      obj.freq = obj.freq + 1

      return obj.value
    }

    return null
  },
  /**
   * 保存数据到缓存,缓存容量到达上限后删除使用频率最低的
   */
  set: function set (key, value) {
    this.map[key] = {
      value: value,
      freq: 0
    }

    this.size++

    // 缓存容量到达上限后删除使用频率最低的
    if (this.size > this.maxSize) {
      var minKey = null
      var minFreq = -1
      var count = 0
      for (var name in this.map) {
        if (this.map.hasOwnProperty(name)) {
          count++
          if (count === 1) {
            minFreq = this.map[name].freq
            minKey = name
          }

          if (this.map[name].freq < minFreq) {
            minFreq = this.map[name].freq
            minKey = name
          }
        }
      }

      delete this.map[minKey]
      this.size--
    }
  },

  /**
   * 清空缓存
   */
  clear: function clear () {
    this.map = {}
    this.size = 0
  }
}

/**
* 缓存管理
*/
export default {
  /**
     * 获取下拉框缓存
     */
  getSelectCache: function getSelectCache () { // 下拉
    return !window.selectCache ? window.selectCache = SimpleCache.init(200) : window.selectCache
  },

  /**
   * 获取数据字典缓存
   */
  getCodeTypeCache: function getCodeTypeCache () { // 码表
    return !window.codeTypeCache ? window.codeTypeCache = SimpleCache.init(100) : window.codeTypeCache
  },
  /**
   * 获取菜单缓存
   */
  getMenusCache: function getMenusCache () { // 菜单
    return !window.menusNameCache ? window.menusNameCache = SimpleCache.init(5) : window.menusNameCache
  }
}
// return {

// };
