import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
    path: '/dataQuery',
    name: 'DataQuery',
    component: () => import('@/views/data_query/index.vue'),
    meta: {
        title: "资料查询",
        sort: 2,
        icon: 'Document'
    }
}

export default route
