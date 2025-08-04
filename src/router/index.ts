import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

interface RouteModule {
  default: RouteRecordRaw
}

// 使用 import.meta.glob 动态导入路由文件
const routeModules = import.meta.glob<RouteModule>('./modules/*.ts', { eager: true })

// 处理路由模块
const routes: RouteRecordRaw[] = Object.values(routeModules)
  .map(module => module.default)
  .filter(Boolean) // 确保路由定义存在

// 根据 meta.sort 属性对路由进行排序
routes.sort((a, b) => {
  const sortA = (a.meta?.sort as number) || 0
  const sortB = (b.meta?.sort as number) || 0
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
