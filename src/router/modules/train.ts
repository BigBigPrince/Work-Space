import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
    path: '/train',
    name: 'Train',
    component: () => import('@/views/train/Train.vue'),
    meta: {
        title: "学习培训",
        sort: 3,
        icon: 'Promotion'
    }
}

export default route
