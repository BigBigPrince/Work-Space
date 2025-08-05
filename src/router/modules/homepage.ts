import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '常用网站',
    sort: 1,
    icon: 'House'
  },
  // children: [
  //   {
  //     path: ':id',
  //     name: 'Homepage',
  //     component: () => import('@/views/home/index.vue'),
  //     meta: {
  //       title: '详情',
  //       sort: 1
  //     }
  //   },
  // ]
}

export default route
