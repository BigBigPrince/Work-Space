import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '仪表盘',
    sort: 3
  }
}

export default route
