import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 使用 import.meta.glob 动态导入路由文件
const routeModules = import.meta.glob('./modules/*.ts', { eager: true })

// 处理路由模块
const routes: RouteRecordRaw[] = Object.keys(routeModules).map(key => {
  const mod = (routeModules[key] as any).default
  return mod
})

// 根据 meta.sort 属性对路由进行排序
routes.sort((a, b) => {
  const sortA = a.meta?.sort || 0
  const sortB = b.meta?.sort || 0
  return sortA - sortB
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 全局前置守卫，设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
