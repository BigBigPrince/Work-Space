import type { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/training',
  name: 'Training',
  component: () => import('@/views/training/index.vue'),
  meta: {
    title: '培训管理',
    sort: 4,
    hasChildren: true, // 标记该路由有子菜单
    icon: 'Reading'
  },
  children: [
    {
      path: 'courses',
      name: 'TrainingCourses',
      component: () => import('@/views/training/courses.vue'),
      meta: {
        title: '课程列表',
        sort: 1,
        icon: 'Notebook'
      }
    },
    {
      path: 'schedule',
      name: 'TrainingSchedule',
      component: () => import('@/views/training/schedule.vue'),
      meta: {
        title: '培训安排',
        sort: 2,
        icon: 'Notebook'
      }
    }
  ]
}

export default route
