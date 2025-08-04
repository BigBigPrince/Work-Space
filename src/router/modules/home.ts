import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '首页',
    sort: 1
  }
}

export default route
