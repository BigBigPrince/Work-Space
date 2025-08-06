import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/experimental',
  name: 'Experimental',
  meta: {
    title: '实验机汇总',
    sort: 2,
    icon: 'InfoFilled'
  },
  children: [
    {
      path: 'red',
      name: 'Red',
      component: () => import('@/views/experimental/red/Red.vue'),
      meta: {
        title: '红实验机',
        icon: 'InfoFilled'
      }
    },
      {
      path: 'green',
      name: 'Green',
      component: () => import('@/views/experimental/green/Green.vue'),
      meta: {
        title: '绿实验机',
        icon: 'InfoFilled'
      }
    },
  ]
}

export default route
