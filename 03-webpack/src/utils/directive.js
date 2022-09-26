import store from '@/store'
export default {
  install(Vue) {
    /**
     * input框自动聚焦
     * @author 计昕奇
     * @time 2020/12/01
     */
    Vue.directive('focus', {
      inserted: function inserted(el) {
        el.querySelector('input').select()
      }
    }),
      Vue.directive("el-select-loadmore", {
        bind(el, binding) {
          let self = this;
          // 获取element-ui定义好的scroll盒子
          const SELECTWRAP_DOM = el.querySelector(
            ".el-select-dropdown .el-select-dropdown__wrap"
          );
          SELECTWRAP_DOM.addEventListener("scroll", function () {
            /**
             * scrollHeight 获取元素内容高度(只读)
             * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
             * clientHeight 读取元素的可见高度(只读)
             * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
             * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
             */
            const condition = this.scrollHeight - this.scrollTop - 5 <= this.clientHeight;
            if (condition) binding.value();
          });
        },
      })
    Vue.directive('hasPermi', {
      inserted(el, binding, vnode) {
        const { value } = binding
        
        if (value && value instanceof Array && value.length > 0) {
          // const btnPrems = store.getters && store.getters.btnPrems
          // const permissionFlag = value
          // const hasPermissions = store.getters.isAdmin == '1' || btnPrems.some(permission => {
          //   return permissionFlag.includes(permission)
          // })
          if (!Vue.gvUtil.hasPermi(value)) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        } else {
          // throw new Error(`请设置操作权限标签值`)
        }
      }
    });
  }
}
