import Vue from 'vue'
import Router from 'vue-router'
import { addRoutes as routes } from './addRoutes'
import Layout from '@/layout'

Vue.use(Router)


// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/home.vue'),
        meta: { title: '首页', icon: 'dashboard', noCache: false, affix: true }
      }
    ]
  },
  // {
  //   path: '/tools',
  //   component: Layout,
  //   meta: { title: 'Component', icon: 'dashboard' },
  //   children: [
  //     {
  //       path: 'useIcon',
  //       name: 'Icon',
  //       component: () => import('@/views/tools/useIcon.vue'),
  //       meta: { title: 'Icon', icon: 'user', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvInput',
  //       name: 'GvInput',
  //       component: () => import('@/views/tools/useGvInput.vue'),
  //       meta: { title: 'GvInput', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvSelect',
  //       name: 'GvSelect',
  //       component: () => import('@/views/tools/useGvSelect.vue'),
  //       meta: { title: 'GvSelect', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvRadioGroup',
  //       name: 'GvRadioGroup',
  //       component: () => import('@/views/tools/useGvRadioGroup.vue'),
  //       meta: { title: 'GvRadioGroup', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvAutoSelect',
  //       name: 'GvAutoSelect',
  //       component: () => import('@/views/tools/useGvAutoSelect.vue'),
  //       meta: { title: 'GvAutoSelect', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvDatePicker',
  //       name: 'GvDatePicker',
  //       component: () => import('@/views/tools/useGvDatePicker.vue'),
  //       meta: { title: 'GvDatePicker', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvTimePicker',
  //       name: 'GvTimePicker',
  //       component: () => import('@/views/tools/useGvTimePicker.vue'),
  //       meta: { title: 'GvTimePicker', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvForm',
  //       name: 'GvForm',
  //       component: () => import('@/views/tools/useGvForm.vue'),
  //       meta: { title: 'GvForm', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvSearchTable',
  //       name: 'GvSearchTable',
  //       component: () => import('@/views/tools/useGvSearchTable.vue'),
  //       meta: { title: 'GvSearchTable', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvColumnTable',
  //       name: 'GvColumnTable',
  //       component: () => import('@/views/tools/useGvColumnTable.vue'),
  //       meta: { title: 'GvColumnTable', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvImportExcel',
  //       name: 'GvImportExcel',
  //       component: () => import('@/views/tools/useGvImportExcel.vue'),
  //       meta: { title: 'GvImportExcel', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useGvEcharts',
  //       name: 'GvEcharts',
  //       component: () => import('@/views/tools/useGvEcharts.vue'),
  //       meta: { title: 'GvEcharts', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useCompressImg',
  //       name: 'CompressImg',
  //       component: () => import('@/views/tools/useCompressImg.vue'),
  //       meta: { title: 'CompressImg', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'usePdfView',
  //       name: 'PDFView',
  //       component: () => import('@/views/tools/usePdfView.vue'),
  //       meta: { title: 'PDFView', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'useOtherTools',
  //       name: 'OtherTools',
  //       component: () => import('@/views/tools/useOtherTools.vue'),
  //       meta: { title: 'OtherTools', icon: 'dashboard', noCache: false, affix: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/demos',
  //   component: Layout,
  //   meta: { title: 'Dome', icon: 'dashboard' },
  //   children: [
  //     {
  //       path: 'demo1',
  //       name: 'demo1',
  //       component: () => import('@/views/demos/demo1.vue'),
  //       meta: { title: '穿梭框', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'demo2',
  //       name: 'demo2',
  //       component: () => import('@/views/demos/demo2.vue'),
  //       meta: { title: '大数据下拉', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'demo3',
  //       name: 'demo3',
  //       component: () => import('@/views/demos/demo3.vue'),
  //       meta: { title: '折叠面板', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'demo4',
  //       name: 'demo4',
  //       component: () => import('@/views/demos/demo4.vue'),
  //       meta: { title: '通过卡号查银行', icon: 'dashboard', noCache: false, affix: false }
  //     },
  //     {
  //       path: 'demo5',
  //       name: 'demo5',
  //       component: () => import('@/views/demos/demo5.vue'),
  //       meta: { title: '腾讯地图', icon: 'dashboard', noCache: false, affix: false }
  //     }
  //   ]
  // },
]
export const addRoutes = routes // 前端新增路由

export default new Router({
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
