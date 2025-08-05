import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/experimental',
  name: 'Experimental',
  component: () => import('@/views/experimental/index.vue'),
  meta: {
    title: '实验机汇总',
    sort: 2,
    icon: 'InfoFilled'
  }
}

export default route
