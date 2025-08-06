import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
    path: '/checking',
    name: 'Checking',
    component: () => import('@/views/checking/Checking.vue'),
    meta: {
        title: "排班考勤",
        sort: 3,
        icon: 'DataLine'
    }
}

export default route
