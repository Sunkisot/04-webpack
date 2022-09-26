
export default {
  install (Vue) {
    Vue.filter('translate', Vue.gvUtil.getInzTranslate)
    /**
     * format 格式化日期 formatStr String
     * @author 计昕奇
     * @Param value  时间
     * @Param formatStr 格式 [yyyy,MM,dd,HH,mm,ss]
     * @time 2020/12/01
     */
    Vue.filter('time', Vue.gvUtil.dateToStr)
     /**
     * format 格式化时间 formatStr String (无年月日)
     * @author 计昕奇
     * @Param value  时间
     * @Param formatStr 格式 [HH,mm,ss]
     * @time 2020/12/01
     */
    Vue.filter('_time', Vue.gvUtil.timeToStr)
    /**
     * @Description 金额格式化
     * @Param value 金额
     * @Param thou Boolean 是否千分符
     * @Param len Number 小数位数
     * @Param flag Boolean 数字零 转化为 "" 还是 0.00
     */
    Vue.filter('money', Vue.gvUtil.money)
    /**
     * @Description 身份证号遮挡
     * @Param start Number 开始位置
     * @Param len Number 长度
     */
    Vue.filter('delmat', function (n) {
      if (n) {
        return Number(n = n.toString().replace(/,/g, ''))
      } else {
        return n
      }
    })
    /**
     * @Description 身份证号遮挡
     * @Param start Number 开始位置
     * @Param len Number 长度
     */
    Vue.filter('idCard', function (value, start, len) {
      if (!value) {
        return ''
      }

      var val = value.replace(/\s+/g, '')
      var result = ''
      var maxLen = 18 - start
      if (!/^\d{17}[\dX]$/.test(val)) {
        return ''
      }
      if (start > 18) {
        return value
      }

      result = val.substring(0, start)
      maxLen = maxLen < len ? maxLen : len
      while (maxLen--) {
        result += '*'
      }

      result += val.substring(start + len, 18)

      return result
    })

    /**
     * @Description 手机号遮挡
     * @Param start Number 开始位置
     * @Param end Number 结束位置
     */
    Vue.filter('phoneNum', function (value, start, end) {
      if (!value) {
        return ''
      }

      var val = value.replace(/\s+/g, '')
      var result = ''
      var valLen = val.length
      var startLen = valLen - start - end
      if (!/^(\+\d{1,4})?1[3|4|5|7|8|9]\d{9}$/.test(val)) {
        return ''
      }
      if (startLen < 0) {
        return value
      }

      result = val.substring(0, start)
      while (startLen--) {
        result += '*'
      }

      result += val.substring(valLen - end, valLen)

      return result
    })
    /**
     * @Description 保留几位小数
     * @Param len Number 小数位数
     */
    Vue.filter('keepNum', function (value, len) {
      if (!value) {
        return ''
      }
      value = Number(value)
      return value.toFixed(len || 2)
    })
  }
}
