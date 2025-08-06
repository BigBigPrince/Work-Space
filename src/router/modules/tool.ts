import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
    path: '/tool',
    name: 'Tool',
    component: () => import('@/views/tool/Tool.vue'),
    meta: {
        title: "实用工具",
        sort: 3,
        icon: 'DataLine'
    }
}

export default route
