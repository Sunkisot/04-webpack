import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, setToken } from '@/utils/token'
import { addRoutes } from '@/router/addRoutes'


NProgress.configure({ showSpinner: false }) // 设置关闭螺旋加载

const whiteList = ['/login'] // 路由白名单

router.beforeEach(async (to, from, next) => {

  NProgress.start()
  if (getToken()) { // 有token
    if (to.fullPath == '/login') { // 初次进入登录页
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!store.getters.isInject) { // 判断是否注入权限路由
        try {
          const routes = await store.dispatch('routes/GenerateRouter')
          router.addRoutes(routes)
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        } catch (err) {
          await store.dispatch('user/ErrLogout')
          Message.error(err)
          next({ path: '/' })
        }
      } else {
        next()
      }
      // if (store.getters.roles.length === 0) { // 判断当前用户是否拉取完用户信息
      //   try {
      //     const { roles } = await store.dispatch('user/GetUserInfo')
      //     const routes = await store.dispatch('routes/GenerateRouter', { roles })
      //     router.addRoutes(routes)
      //     next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      //   } catch (err) { // 如果请求报错  前端登出
      //     await store.dispatch('user/ErrLogout')
      //     Message.error(err)
      //     next({ path: '/' })
      //   }
      // } else {
      //   next()
      // }
    }
  } else { // 如果没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
