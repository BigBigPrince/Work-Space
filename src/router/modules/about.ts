import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/about',
  name: 'About',
  component: () => import('@/views/about/index.vue'),
  meta: {
    title: '试验机汇总',
    sort: 2
  }
}

export default route
