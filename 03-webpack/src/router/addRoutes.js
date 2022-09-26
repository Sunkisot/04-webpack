
/* Layout */
import Layout from '@/layout'

export const addRoutes = [
  /**
   * Note: 路由配置项
   *
   * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
   * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
   *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
   *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
   *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
   * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
   * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
   * perms:'perms'                  // 设定路由的权限
   * meta : {
      title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
      breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
      activeMenu: '/example/list'  // 如果设置路径，工具条将突出显示您设置的路径
      noCache: true                // true组件不被缓存 false 组件会被缓存下来
      affix: true                  // true TagViews 不可被关闭
    }
  */

  {
    path: '/org-manage',
    component: Layout,
    perms: 'system',
    meta: { title: '机构管理', icon: 'dashboard' },
    children: [
      {
        path: 'org-list',
        name: 'orgList',
        perms: 'mechanism:mechanism:list',
        component: () => import('@/views/orgManage/orgList/list-index.vue'),
        meta: { title: '机构列表', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'org-add/:type',
        name: 'orgAdd',
        perms: 'mechanism:mechanism:list',
        component: () => import('@/views/orgManage/orgList/org-index.vue'),
        meta: { title: '添加机构', icon: 'dashboard', noCache: false, affix: false },
        beforeEnter: (to, from, next) => {
          to.meta.title = to.params.type == 'edit' ? '编辑机构' : '添加机构'
          next()
        },
        props: true,
        hidden: true
      },
      {
        path: 'org-son-add/:type',
        name: 'orgSonadd',
        perms: 'mechanism:mechanism:list',
        component: () => import('@/views/orgManage/orgList/org-son-index.vue'),
        meta: { title: '添加子机构', icon: 'dashboard', noCache: false, affix: false },
        beforeEnter: (to, from, next) => {
          to.meta.title = to.params.type == 'edit' ? '编辑子机构' : '添加子机构'
          next()
        },
        props: true,
        hidden: true
      },
      {
        path: 'org-detail',
        name: 'orgDetail',
        perms: 'mechanism:mechanism:list',
        component: () => import('@/views/orgManage/orgList/org-detail.vue'),
        meta: { title: '机构详情', icon: 'dashboard', noCache: false, affix: false },
        props: true,
        hidden: true
      },
      {
        path: 'charge-policy',
        name: 'chargePolicy',
        perms: 'mechanism:mechanism:list',
        component: () => import('@/views/orgManage/orgList/charge-policy.vue'),
        meta: { title: '计费政策配置', icon: 'dashboard', noCache: false, affix: false },
        props: true,
        hidden: true
      },
      {
        path: 'org-role',
        name: 'orgRole',
        perms: 'system:mechanism:role:list',
        component: () => import('@/views/orgManage/orgRole/role-index.vue'),
        meta: { title: '机构角色配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'add-role/:type',
        name: 'addRole',
        perms: 'system:mechanism:role:list',
        component: () => import('@/views/orgManage/orgRole/add-role.vue'),
        meta: { title: '添加角色', icon: 'dashboard', noCache: false, affix: false },
        beforeEnter: (to, from, next) => {
          to.meta.title = to.params.type == 'edit' ? '编辑角色' : '添加角色'
          next()
        },
        props: true,
        hidden: true
      },
      {
        path: 'org-member',
        name: 'orgMember',
        perms: 'system:mechanism:user:list',
        component: () => import('@/views/orgManage/orgMember/memb-index.vue'),
        meta: { title: '机构人员配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'memb-detail/:type',
        name: 'membDetail',
        perms: 'system:mechanism:user:list',
        component: () => import('@/views/orgManage/orgMember/memb-detail.vue'),
        meta: { title: '成员详情', icon: 'dashboard', noCache: false, affix: false },
        props: true,
        hidden: true
      },
    ]
  },
  {
    path: '/org-deploy',
    component: Layout,
    perms: 'system',
    meta: { title: '机构配置', icon: 'dashboard' },
    children: [
      {
        path: 'perm-index',
        name: 'permIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/permission/perm-index.vue'),
        meta: { title: '权限配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'feature-index',
        name: 'featureIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/feature/feature-index.vue'),
        meta: { title: '功能配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'quota-index',
        name: 'quotaIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/quota/quota-index.vue'),
        meta: { title: '报价配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'video-index',
        name: 'videoIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/video/video-index.vue'),
        meta: { title: '影像配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'pay-index',
        name: 'payIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/pay/pay-index.vue'),
        meta: { title: '支付配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'risk-index',
        name: 'riskIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/risk/risk-index.vue'),
        meta: { title: '险种配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'present-index',
        name: 'presentIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/present/present-index.vue'),
        meta: { title: '赠送配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'vehicle-index',
        name: 'vehicleIndex',
        perms: 'orgList',
        component: () => import('@/views/orgDeploy/vehicle/vehicle-index.vue'),
        meta: { title: '车辆信息配置', icon: 'dashboard', noCache: false, affix: false }
      },
    ]
  },
  {
    path: '/ins-deploy',
    component: Layout,
    perms: 'insurance',
    meta: { title: '保险公司配置', icon: 'dashboard' },
    children: [
      {
        path: 'vision-index',
        name: 'visionIndex',
        perms: 'insurance:imagematerial:list',
        component: () => import('@/views/insDeploy/video/vision-index.vue'),
        meta: { title: '影像资料配置', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'video-add/:type',
        name: 'videoAdd',
        perms: 'insurance:imagematerial:list',
        component: () => import('@/views/insDeploy/video/video-add.vue'),
        meta: { title: '新增影像资料', icon: 'dashboard', noCache: false, affix: false },
        beforeEnter: (to, from, next) => {
          to.meta.title = to.params.type == 'edit' ? '编辑影像资料' : '新增影像资料'
          next()
        },
        props: true,
        hidden: true
      },
      {
        path: 'area-index',
        name: 'areaIndex',
        perms: 'insurance:regionalizationDifference:detail',
        component: () => import('@/views/insDeploy/area/area-index.vue'),
        meta: { title: '区域化差异配置', icon: 'dashboard', noCache: false, affix: false }
      },
    ]
  },
  {
    path: '/paas-deploy',
    component: Layout,
    perms: 'operation',
    meta: { title: '平台配置', icon: 'dashboard' },
    children: [
      {
        path: 'sms-index',
        name: 'smsIndex',
        perms: 'system:operation:messageTemplate:detail',
        component: () => import('@/views/paasDeploy/sms/sms-index.vue'),
        meta: { title: '报价短信模版', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'roles-index',
        name: 'rolesIndex',
        perms: 'system:operation:role:list',
        component: () => import('@/views/paasDeploy/roles/roles-index.vue'),
        meta: { title: '平台角色管理', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'member-index',
        name: 'memberIndex',
        perms: 'system:operation:user:list',
        component: () => import('@/views/paasDeploy/member/member-index.vue'),
        meta: { title: '平台人员管理', icon: 'dashboard', noCache: false, affix: false }
      },
      {
        path: 'member-detail/:type',
        name: 'memberDetail',
        perms: 'system:operation:user:list',
        component: () => import('@/views/paasDeploy/member/member-detail.vue'),
        meta: { title: '人员详情', icon: 'dashboard', noCache: false, affix: false },
        props: true,
        hidden: true
      },
    ]
  }
]
