/**
 * 工具类
 * @author 计昕奇
 * @time 2020/12/01
 */
'use strict'
import Vue from 'vue'
import store from '../store'
import cache from './cache'
import $ from 'jquery'
import ExportJsonExcel from 'js-export-excel'
import sparkMD5 from 'spark-md5'
import mixins from '../mixins/index'
import Cookies from 'js-cookie'
import i18n from '../lang'
import request from '@/utils/request.js'
import { getSelectList } from '@/api/system/gvSelect'
import select from '@/api/select'
import options from '@/utils/options'
import eventBus from './eventBus'
import BIN from "bankcardinfo";

var toString = Object.prototype.toString;
window._typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj }
// 他能识别出数据类型 包括symbol
export var gvUtil = {
  http: request,
  PATTERN_AMOUNT: /^(-)?(([1-9][0-9]{0,2}(,\d{3})*)|0)(\.\d{2})?$/, // 金额
  PATTERN_WEIGHT: /^(-)?(([1-9][0-9]{0,2}(,\d{3})*)|0)(\.\d{3})?$/, // 重量
  PATTERN_POSITIVE_INTEGER: /^[1-9]\d*$/, // 正整数
  PATTERN_INTEGER: /^-?\d+$/, // 整数
  PATTERN_DECIMAL: /^-?\d+\.\d{2}$/, // 2位小数
  PATTERN_HUNDRED: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, // 大于等于0小于等于100
  PATTERN_ZERO_INTEGER: /^\d+(\.\d+)?$/, // 大于或者等于0
  PATTERN_ORDERNO: /^[A-Za-z0-9]+$/, // 只能是数字或字母
  PATTERN_ID: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, // 身份证号
  PATTERN_BACKID: /^([1-9]{1})(\d{14}|\d{15}|\d{18})$/, // 银行卡号
  AllNumber: /^[0-9]+$/, // Must be number
  Hundred: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, // 大于等于0小于等于100
  Zero: /^\d+(\.\d+)?$/, // 大于或者等于0
  MoreZero: /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/, // 大于0的小数或整数
  telNumber: /^1(3[0-9]|5[0-35-9]|8[0-9]|7[0-9]|4[0-9])\d{8}$/, // 电话号码
  PATTERN_MAIL: /^[0-9a-zA-Z][0-9a-zA-Z_\.\+]*@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+$/, // 邮箱
  PATTERN_CAR: /^[\u4E00-\u9FA5]{1}[A-Z]{1}[A-Z_0-9]{5,6}$/, // 车牌号
  PATTERN_LPR: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}$/,
  options,  // 前端配置的下拉
  getStroage: function (key) {
    if (key) {
      return JSON.parse(localStorage.getItem(key))
    } else {
      return null
    }
  },
  setStroage: function (key, val) {
    if (key && val) {
      localStorage.setItem(key, JSON.stringify(val))
    }
  },
  removeStroage(key) {
    if (key) {
      localStorage.removeItem(key)
    }
  },
  // 权限判断
  hasPermi(value) {
    if (value && value instanceof Array && value.length > 0) {
      const btnPrems = store.getters && store.getters.btnPrems
      const permissionFlag = value
      const hasPermissions = store.getters.isAdmin == '1' || btnPrems.some(permission => {
        return permissionFlag.includes(permission)
      })
      return hasPermissions
    } else {
      return true
    }
  },
  // 防抖
  debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer)
      timer = setTimeout(fn, delay)
    }
  },
  // 通过银行卡号获取开户行信息
  getBankBin(bankId) {
    return new Promise((resolve, reject) => {
      BIN.getBankBin(bankId)
        .then(function (data) {
          resolve(data)
        })
        .catch(function (err) {
          reject(err)
        });
    })
  },
  // 四舍五入
  toFixed: function toFixed(num, fractionDigits) {
    return (Math.round(num * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits) + Math.pow(10, -(fractionDigits + 1))).toString().slice(0, -1)
  },
  // 去除千分位中的‘，’
  delcommafy: function delcommafy(num) {
    num = num.toString()
    num = num.replace(/,/gi, '')
    return num
  },
  // 数字加千分符
  comdify: function comdify(n) {
    var re = /\d{1,3}(?=(\d{3})+$)/g
    var n1 = n.replace(/^(-?\d+)((\.\d+)?)$/, function (s, s1, s2) {
      return s1.replace(re, '$&,') + s2
    })
    return n1
  },
  /**
   * @Description 金额格式化
   * @Param value 金额
   * @Param thou Boolean 是否千分符
   * @Param len Number 小数位数
   * @Param flag Boolean 数字零 转化为 "" 还是 0.00
   */
  money: function money(value, thou, len, flag) {
    if (value === 'undefined' || value === '' || value == null) {
      return ''
    }
    if (flag && parseFloat(value) === 0) {
      return ''
    }
    if (value < 0) {
      return '-' + Vue.gvUtil.showNumber(thou, len, -value)
    }
    return Vue.gvUtil.showNumber(thou, len, value)
  },
  // 展示数字格式化
  showNumber: function showNumber(thou, len, value) {
    var code = ''
    if (!len) {
      len = 2
    } else {
      len = parseInt(len) || 2
    }
    if (!value || parseFloat(value) === '0') {
      code = Number('0').toFixed(len)
      return code
    }
    if (value && parseFloat(value) !== '0') {
      if (!isNaN(parseFloat(Vue.gvUtil.delcommafy(value)))) {
        var itemValue = parseFloat(Vue.gvUtil.delcommafy(value))
        // if (itemValue >= minValue && itemValue <= maxValue) {
        if (thou) {
          code = Vue.gvUtil.comdify(Number(itemValue).toFixed(len))
        } else {
          code = Number(value).toFixed(len)
        }
      } else {
        code = ''
      }
    }
    return code
  },

  // 获取缓存
  getCache: function getCache(type) {
    var c = null
    if (!type) {
      type = 'select'
    }
    switch (type) {
      case 'select': // 下拉
        c = cache.getSelectCache()
        break
      case 'code': // 码表
        c = cache.getCodeTypeCache()
        break
      case 'menu': // 菜单
        c = cache.getMenusCache()
        break
    }
    return c
  },
  // 文件流下载
  resolveBlob(res, filename) {
    var eleLink = document.createElement('a')
    eleLink.download = filename
    eleLink.style.display = 'none'
    // 字符内容转变成blob地址
    var blob = new Blob([res])
    eleLink.href = URL.createObjectURL(blob)
    // 触发点击
    document.body.appendChild(eleLink)
    eleLink.click()
    // 然后移除
    document.body.removeChild(eleLink)
  },
  // 数组对象sort 排序函数
  compare: function (property, flag) {
    return function (a, b) {
      var value1 = Number(a[property]) || 0
      var value2 = Number(b[property]) || 0
      return flag ? value2 - value1 : value1 - value2
    }
  },
  // 图片预览
  openImg: function openImg(imgList) {
    store.dispatch('app/SetPreviewImg', {
      visable: true,
      imgList,
    })
  },
  // pdf预览
  openPdf: function openPdf(obj, flag) {
    var p = ''
    //   objs = {
    //     system: '', // 表所属系统
    //     reportName: '', // 报表名
    //     readonly: '' // 是否只读
    //   };
    // $.extend(objs, obj || {});
    for (var o in obj) {
      p = p + '&' + o + '=' + obj[o]
    }
    p = p.substring(1)
    if (flag) {
      return '/pdf/web/viewer.html?' + p
    } else {
      window.open('/pdf/web/viewer.html?' + p)
    }
  },
  // 将文件转化为url URL.createObjectURL()
  getObjectURL(file) {
    let url = null
    if (window.createObjectURL != undefined) {
      // basic
      url = window.createObjectURL(file)
    } else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file)
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file)
    }
    return url
  },
  // 导出excel
  toExcel: function toExcel(obj) {
    if (!obj) {
      return
    }
    if (typeof ExportJsonExcel === 'function') {
      new ExportJsonExcel(obj).saveExcel()
    }
  },
  // 导出excel，新增exclude字段（数组类型，有prop用prop，无则使用展示名称）以控制无需导出字段
  exportExcel: function exportExcel(ref, id, fileName, sheet, exclude, callFn) {
    if (!ref || !id) {
      Vue.gvUtil.message('The ref and ID values of the data table are not allowed to be empty')
      return
    }
    var d = Vue.gvUtil.getExeclData(ref, id)
    var rm = []
    var sheetFilter = d.sheetFilter.filter(function (item, index) {
      var flag = !~(exclude || []).indexOf(item)
      if (!flag) {
        rm.push(index)
      }
      return flag
    })
    var sheetHeader = d.sheetHeader.filter(function (item, index) {
      return !~rm.indexOf(index)
    })
    //
    var config = {
      fileName: fileName || 'execl',
      datas: [{
        sheetData: d.sheetData.length ? d.sheetData : [{}],
        sheetName: sheet || 'sheet',
        sheetFilter: sheetFilter,
        sheetHeader: sheetHeader
      }]
    }
    typeof callFn === 'function' && callFn(config)
    Vue.gvUtil.toExcel(config)
  },
  // 获取表格数据
  getExeclData: function getExeclData(ref, id) {
    if (!$('#' + id)) {
      Vue.gvUtil.message('The ID reference of the data table is null, please check the settings')
      return
    }
    var sheetHeader = []
    var sheetFilter = []
    var sheetData = []
    var rmcol = []
    var columns = ref.columns
    var trs = $('#' + id).find('.el-table__body-wrapper').find('tbody').find('tr')
    var da = {}
    var cs

    columns.forEach(function (item, index) {
      if (item.label) {
        sheetHeader.push(item.label)
        sheetFilter.push(item.property || item.label)
      } else {
        rmcol.push(index)
      }
    })
    trs.each(function () {
      var tr = $(this).children()
      da = {}
      cs = tr.filter(function (index) {
        return !~rmcol.indexOf(index)
      })
      cs.each(function (i) {
        var prop = sheetFilter[i]
        var val = ''
        var _input = $(this).find('input')
        if (_input && _input.length > 0) {
          val = _input.val()
        } else {
          val = $.trim($(this).text())
        }
        da[prop] = val
      })
      sheetData.push(da)
    })

    return {
      sheetHeader: sheetHeader,
      sheetFilter: sheetFilter,
      sheetData: sheetData
    }
  },
  message: function message(msg, duration, type) {
    Vue.prototype.$message({ message: msg || '', duration: duration !== 0 ? duration || 6000 : duration, type: type || 'error', showClose: true })
  },
  success: function message(msg, duration, type) {
    this.message(msg || '操作成功！', 3000, 'success')
  },
  error: function error(msg, duration, type) {
    this.message(msg || '操作失败！', 3000, 'error')
  },
  // 字符串转化md5
  md5: (function (_md) {
    function md5(_x) {
      return _md.apply(this, arguments)
    }
    md5.toString = function () {
      return _md.toString()
    }
    return md5
  }(function (str) {
    return str ? sparkMD5.hash(str) : ''
  })),
  // 获取全局的混入对象
  getMixins: function getMixins() {
    return mixins
  },
  // 对象比较
  // compareObject: function compareObject(origin, target) {
  //   if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') { // 目标是undifined 或 对象
  //     if ((typeof origin === 'undefined' ? 'undefined' : _typeof(origin)) !== 'object') { // 本身是 undifined 
  //       return false
  //     } else { // 本身是对象
  //       if (JSON.stringify(origin) === JSON.stringify(target)) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     }
  //   } else {
  //     return origin === target
  //   }
  // },
  // 数据比较
  compare: function compare(a, b, aStack, bStack) {
    // === 结果为 true 的区别出 +0 和 -0
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
    if (a == null || b == null) return false;

    // 判断 NaN
    if (a !== a) return b !== b;

    // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

    // 更复杂的对象使用 deepEq 函数进行深度比较
    return this.deepEq(a, b, aStack, bStack);
  },
  isFunction: function isFunction(obj) {
    return toString.call(obj) === '[object Function]'
  },
  deepEq: function deepEq(a, b, aStack, bStack) {

    // a 和 b 的内部属性 [[class]] 相同时 返回 true
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;

    switch (className) {
      case '[object RegExp]':
      case '[object String]':
        return '' + a === '' + b;
      case '[object Number]':
        if (+a !== +a) return +b !== +b;
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    // 不是数组
    if (!areArrays) {
      // 过滤掉两个函数的情况
      if (typeof a != 'object' || typeof b != 'object') return false;

      var aCtor = a.constructor,
        bCtor = b.constructor;
      // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
      if (aCtor !== bCtor && !(this.isFunction(aCtor) && aCtor instanceof aCtor && this.isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }


    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;

    // 检查是否有循环引用的部分
    while (length--) {
      if (aStack[length] === a) {
        return bStack[length] === b;
      }
    }

    aStack.push(a);
    bStack.push(b);

    // 数组判断
    if (areArrays) {

      length = a.length;
      if (length !== b.length) return false;

      while (length--) {
        if (!this.compare(a[length], b[length], aStack, bStack)) return false;
      }
    }
    // 对象判断
    else {

      var keys = Object.keys(a),
        key;
      length = keys.length;

      if (Object.keys(b).length !== length) return false;
      while (length--) {

        key = keys[length];
        if (!(b.hasOwnProperty(key) && this.compare(a[key], b[key], aStack, bStack))) return false;
      }
    }

    aStack.pop();
    bStack.pop();
    return true;
  },
  // 克隆对象
  cloneObj: function cloneObj(obj, flag) {
    var str
    var newobj = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && isNaN(obj.length) ? [] : {}
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
      return
    } else if (window.JSON) {
      str = JSON.stringify(obj), // 系列化对象
        newobj = JSON.parse(str) // 还原
      if (flag) {
        for (var name in newobj) {
          newobj[name] = ''
        }
      }
    } else {
      for (var i in obj) {
        newobj[i] = _typeof(obj[i]) === 'object' ? this.cloneObj(obj[i]) : null
      }
    }
    return newobj
  },
  /**
     * format 格式化日期 formatStr String
     * @author 计昕奇
     * @Param value  时间
     * @Param formatStr 格式 [yyyy,MM,dd,HH,mm,ss]
     * @time 2020/12/01
     */
  dateToStr: function dateToStr(value, formatStr) {
    if (!value || value === '') {
      return ''
    }
    // 针对safari兼容处理
    if (typeof value === 'string' && window.browserType !== 'g') {
      value = value.replace(/-/g, '/')
    }
    formatStr = formatStr || 'yyyy-MM-dd'
    var date = new Date(value)
    var yyyy = date.getFullYear()
    var MM = date.getMonth() + 1
    var dd = date.getDate()
    var HH = date.getHours()
    var mm = date.getMinutes()
    var ss = date.getSeconds()
    var result = formatStr

    MM < 10 && (MM = '0' + MM)
    dd < 10 && (dd = '0' + dd)
    HH < 10 && (HH = '0' + HH)
    mm < 10 && (mm = '0' + mm)
    ss < 10 && (ss = '0' + ss)
    result = result.replace('yyyy', yyyy).replace('MM', MM).replace('dd', dd).replace('HH', HH).replace('mm', mm).replace('ss', ss)
    return result
  },
  timeToStr: function timeToStr(val, formatStr) {
    return Vue.gvUtil.dateToStr(`2020-01-01 ${val}`, formatStr)
  },
  /** 字符转日期
   *@param dateStr 日期格式的字符串
   */
  stringToDate: function stringToDate(dateStr) {
    if (typeof dateStr === 'undefined') {
      return new Date()
    }
    if ((typeof dateStr === 'undefined' ? 'undefined' : _typeof(dateStr)) === 'object') {
      return dateStr
    }
    var converted = Date.parse(dateStr)
    var myDate = new Date(converted)
    if (isNaN(myDate)) {
      dateStr = dateStr.replace(/:/g, '-') // 支持 2013:10:17
      dateStr = dateStr.replace(' ', '-') // 支持 2013 10 17
      dateStr = dateStr.replace('.', '-') // 支持 2013.10.17
      var arys = dateStr.split('-') // 支持2013-10-17
      switch (arys.length) {
        case 7:
          // 2013-10-17-13-56-33-22 格式
          myDate = new Date(arys[0], parseInt(arys[1], 10) - 1, arys[2], arys[3], arys[4], arys[5], arys[6])
          break

        case 6:
          // 2013-10-17-13-56-33 格式
          myDate = new Date(arys[0], parseInt(arys[1], 10) - 1, arys[2], arys[3], arys[4], arys[5])
          break

        default:
          // 2013-10-17 格式
          myDate = new Date(arys[1] + '/' + arys[2] + '/' + arys[0])
          break
      }
    }
    return myDate
  },
  /**
   * 比较两日期大小
   * @param time1
   * @param time2
   * @returns 0:time1小于time2；
   *          1：time1大于time2；
   *          2：time1等于time2
   */
  comPareDate: function comPareDate(time1, time2) {
    var a = this.stringToDate(time1).getTime()
    var b = this.stringToDate(time2).getTime()
    var c = 0
    if (a > b) {
      c = 1
    } else if (a === b) {
      c = 2
    }
    return c
  },
  /**
   * 相差月数
   * @param s_time 开始时间
   * @param e_time 结束时间
   * @param type String 月数加减 1：加；2：减
   * @param num int 月数
   */
  getMonthsApart: function getMonthsApart(s_time, e_time, type, num) {
    var _this = this
    var s = _this.stringToDate(s_time)
    var e = _this.stringToDate(e_time)
    var s_year = s.getFullYear()
    var s_month = s.getMonth()
    var s_day = s.getDate()
    var s_hour = s.getHours()
    var e_year = e.getFullYear()
    var e_month = e.getMonth()
    var e_day = e.getDate()
    var e_hour = e.getHours()
    var sum = (e_year - s_year) * 12 + (e_month - s_month)
    if (e_day - s_day < 0 || e_day === s_day && e_hour > s_hour) {
      sum -= 1
    }
    if (type && typeof num === 'number') {
      if (type === '1') {
        sum += num
      } else {
        sum -= num
      }
    }
    return sum
  },
  /**
   * 时间加减
   * @param obj yearType 年份：'0' 加;1: 减
   *            year 加减多少年
   *            monthType 月份：'0' 加;1: 减
   *            month 加减多少月
   *            dayType 日：'0' 加;1: 减
   *            day 加减多少日
   */
  getHandleDate: function getHandleDate(time, obj) {
    var date = this.stringToDate(time)
    if (!date) {
      return
    }
    var opt = $.extend({
      yearType: '0',
      monthType: '0',
      dayType: '0',
      year: null,
      month: null,
      day: null
    }, obj || {})
    var s
    if (opt.year) {
      s = date.getFullYear()
      if (opt.yearType === '0') {
        s += opt.year
      } else {
        s -= opt.year
      }
      date.setFullYear(s)
    }

    if (opt.month) {
      s = date.getMonth()
      if (opt.monthType === '0') {
        s += opt.month
      } else {
        s -= opt.month
      }
      date.setMonth(s)
    }

    if (opt.day) {
      s = date.getDate()
      if (opt.dayType === '0') {
        s += opt.day
      } else {
        s -= opt.day
      }
      date.setDate(s)
    }
    return date
  },
  // 国际化翻译
  getInzTranslate(key) {
    return key && key !== '' ? i18n.t(key) : key
  },
  /**
   * 检查元素是否有类
   * @param {HTMLElement} elm
   * @param {string} cls
   * @returns {boolean}
   */
  hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  },
  /**
   * 向元素添加类
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += ' ' + cls
  },

  /**
   * 从元素中移除类
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  removeClass(ele, cls) {
    if (this.hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
  },
  /**
   * 图片压缩
   * @param {*} base64 // 图片URL 
   * @param {*} coefficient // 压缩系数 
   * @param {*} width // 图片宽
   * @param {*} filename // 图片名
   * @param {*} flag // 返回base64 还是 file
   */
  compressImg(base64, { quality, width, filename }, flag) {
    let _this = this
    return new Promise((resolve, reject) => {
      var newImage = new Image();
      var q = quality ? quality : 0.8; //压缩系数0-1之间
      var w = width
      newImage.src = base64;
      newImage.setAttribute("crossOrigin", "Anonymous"); //url为外域时需要
      var imgWidth, imgHeight;
      newImage.onload = function () {
        imgWidth = this.width;
        imgHeight = this.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        if (Math.max(imgWidth, imgHeight) > w) { // 图片的宽高 大于 设定的宽
          if (imgWidth > imgHeight) { // 图片的宽比高大
            canvas.width = w; // 给宽高
            canvas.height = (w * imgHeight) / imgWidth;
          } else { // 图片的高比宽大
            canvas.height = w;
            canvas.width = (w * imgWidth) / imgHeight;
          }
        } else {
          canvas.width = imgWidth;
          canvas.height = imgHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        var base64 = canvas.toDataURL("image/jpeg", q); //压缩语句
        // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
        // while (base64.length / 1024 > 150) {
        //   q -= 0.01;
        //   if (q < 0) {
        //     break
        //   }
        //   base64 = canvas.toDataURL("image/jpeg", q);
        // }
        // // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
        // while (base64.length / 1024 < 50) {
        //   // console.log(2)
        //   q += 0.01;
        //   if (q> 0.92) {
        //     break
        //   }
        //   // console.log(q)
        //   base64 = canvas.toDataURL("image/jpeg", q);
        //   // console.log(base64.length/ 1024)
        // }
        console.log("压缩后大小", base64.length / 1024);

        // callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
        resolve(flag ? _this.dataURLtoFile(base64, filename) : base64);
      };
    });
  },
  //将base64转换为文件
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },
  initTranslation: function initTranslation(codeType, callFn) {
    return new Promise(async (resolve, reject) => {
      var _cache = Vue.gvUtil.getCache()
      var path = codeType
      var param = { codeType: codeType, validind: '1' }
      var vo = 'businessList'
      var cacheKey = Vue.gvUtil.md5(path)
      var list = _cache.get(cacheKey)
      // param,
      // list;
      if (!list) {
        const res = await getSelectList('codeType', param)
        var data = res.data[vo]
        for (var t in data) {
          _cache.set(Vue.gvUtil.md5(t), data[t])
        }
        typeof callFn === 'function' && callFn.call(this)
        resolve()
      } else {
        typeof callFn === 'function' && callFn.call(this)
      }
    })
  },
  initTranslationPo: async function initTranslationPo(list, callFn) {
    if (list) {
      var obj = null
      var params = {}
      var cacheKey = ''
      var b = false
      var c = Vue.gvUtil.getCache()
      var promiseList = []
      var cacheKeyList = []
      for (var key in list) {
        obj = list[key]
        cacheKey = Vue.gvUtil.md5(JSON.stringify({ poName: obj }) || '')
        if (!c.get(cacheKey)) {
          cacheKeyList.push(cacheKey)
          promiseList.push(new Promise(async (resolve, reject) => {
            params = {
              isFuzzy: '0',
              poName: obj
            }

            try {
              const res = await getSelectList('poName', params)
              resolve(res.data.businessList)
            } catch (err) {
              console.log(err)
            }
          }))
        }
      }
      await Promise.all(promiseList).then(res => {
        res.forEach((e, i) => {
          c.set(cacheKeyList[i], e)
        })
      })
      typeof callFn === 'function' && callFn.call(this)
    } else {
      typeof callFn === 'function' && callFn.call(this)
    }
  },
  initTranslationSelect: async function initTranslationSelect(list, callFn) {
    if (list) {
      var obj = null
      var params = {}
      var cacheKey = ''
      var b = false
      var c = Vue.gvUtil.getCache()
      for (var key in list) {
        obj = list[key]
        const { url, data } = obj
        cacheKey = Vue.gvUtil.md5(url + JSON.stringify(data) || '')
        if (!c.get(cacheKey)) {
          try {
            const res = await getSelectList('url', obj.data, url)
            c.set(cacheKey, res.data.businessList)
          } catch (err) {
            console.log(err)
          }
        }
      }
      typeof callFn === 'function' && callFn.call(this)
    } else {
      typeof callFn === 'function' && callFn.call(this)
    }
  },
  initTranslate: async function initTranslationSelect(list, callFn) {
    if (list) {
      var k = null
      var params = {}
      var cacheKey = ''
      var b = false
      var c = Vue.gvUtil.getCache()
      for (var key in list) {
        k = list[key]
        let url = select[k]
        cacheKey = Vue.gvUtil.md5(url)
        if (!c.get(cacheKey)) {
          try {
            const res = await getSelectList('url', {}, url)
            c.set(cacheKey, res.data)
          } catch (err) {
            console.log(err)
          }
        }
      }
      typeof callFn === 'function' && callFn.call(this)
    } else {
      typeof callFn === 'function' && callFn.call(this)
    }
  },
  translationData: function translationData(code, key) {
    //
    var c = Vue.gvUtil.getCache()
    var v = c.get(Vue.gvUtil.md5(code))
    key = key + ''
    if (v) {
      for (var name in v) {
        if (v[name].codeCode === key) {
          return v[name].codeName
        }
      }
    }
    return ''
  },
  translationPoData: function translationPoData(poObj, key) {
    const { poName, code, name } = poObj
    var cacheKey = Vue.gvUtil.md5(JSON.stringify({ poName }) || '')
    var c = Vue.gvUtil.getCache()
    var v = c.get(cacheKey)

    if (v) {
      var obj = v.find(e => e[code] == key)
      return obj ? obj[name] : ''
    }
    return ''
  },
  translationSelectData: function translationSelectData(poObj, key) {
    const { url, code, name, data } = poObj
    var cacheKey = Vue.gvUtil.md5(url + JSON.stringify(data) || '')
    var c = Vue.gvUtil.getCache()
    var v = c.get(cacheKey)

    if (v) {
      var obj = v.find(e => e[code] == key)
      return obj ? obj[name] : ''
    }
    return ''
  },
  translateData: function translateData(urlType, key) {
    let url = select[urlType]
    var cacheKey = Vue.gvUtil.md5(url)
    var c = Vue.gvUtil.getCache()
    var v = c.get(cacheKey)
    if (v) {
      var obj = v.find(e => e.code == key)
      return obj ? obj.name : ''
    }
    return ''
  },
  translateOption: function translateOption(optionType, key) {
    let v = options[optionType]
    if (v) {
      var obj = v.find(e => e.code == key)
      return obj ? obj.name : ''
    }
    return ''
  }

}
export default {
  install(Vue) {
    Vue.prototype.gvUtil = gvUtil
    Vue.prototype.$event = eventBus
    Vue.gvUtil = gvUtil
  }
}
