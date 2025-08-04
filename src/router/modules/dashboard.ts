import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '学习培训',
    sort: 3
  }
}

export default route
