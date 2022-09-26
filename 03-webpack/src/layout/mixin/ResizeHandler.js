import store from '@/store'
import { mapState, mapGetters } from 'vuex'
const { body } = document
const WIDTH = 992 // 参考Bootstrap的响应式设计, 992px  判断是手机或ipad端

export default {
  computed: {
    ...mapState('app', ['device', 'sidebar']),
    ...mapGetters(['tagsView', 'fixedHeader', 'showSettings'])
  },
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/CloseSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler) // 当调整浏览器窗口大小时，发生 resize 事件。
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) { // 如果是手机端
      store.dispatch('app/ToggleDevice', 'mobile')
      store.dispatch('app/CloseSidebar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    $_isMobile() {
      const rect = body.getBoundingClientRect() // 用于获取某个元素相对于视窗的位置集合。集合中有top, right, bottom, left, width, height等属性。
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) { // document.hidden boolean型，表示页面是否处于隐藏状态。页面隐藏包括页面在后台标签页或者浏览器最小化。
        const isMobile = this.$_isMobile()
        store.dispatch('app/ToggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/CloseSidebar', { withoutAnimation: true })
        }
      }
    }
  }
}
