<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <h3 v-if="!isCollapsed">导航菜单</h3>
      <div class="toggle-btn" @click="toggleCollapse">
        <span class="toggle-icon">{{ isCollapsed ? '→' : '←' }}</span>
      </div>
    </div>
    <div class="sidebar-menu">
      <div
        v-for="route in sortedRoutes"
        :key="route.path"
        class="menu-group"
      >
        <!-- 父菜单项 -->
        <div
          v-if="route.meta?.hasChildren"
          class="menu-item parent-menu"
          :class="{
            'active': isRouteActive(route),
            'expanded': expandedMenus.includes(route.name as string)
          }"
          @click="toggleSubmenu(route.name as string)"
          :title="route.meta?.title || '未命名'"
        >
          <div class="menu-icon" v-if="route.meta?.icon">
            <el-icon><component :is="route.meta.icon" /></el-icon>
          </div>
          <div v-else class="menu-icon">
            <el-icon><span class="default-icon"></span></el-icon>
          </div>
          <span class="menu-title" v-if="!isCollapsed">{{ route.meta?.title || '未命名' }}</span>
          <span class="submenu-arrow" v-if="!isCollapsed">
            {{ expandedMenus.includes(route.name as string) ? '▼' : '▶' }}
          </span>
        </div>

        <!-- 没有子菜单的普通菜单项 -->
        <router-link
          v-else
          :to="route.path"
          class="menu-item"
          :class="{ active: $route.path === route.path }"
          :title="route.meta?.title || '未命名'"
        >
          <div class="menu-icon" v-if="route.meta?.icon">
            <el-icon><component :is="route.meta.icon" /></el-icon>
          </div>
          <div v-else class="menu-icon">
            <el-icon><span class="default-icon"></span></el-icon>
          </div>
          <span class="menu-title" v-if="!isCollapsed">{{ route.meta?.title || '未命名' }}</span>
        </router-link>

        <!-- 子菜单 -->
        <div
          v-if="route.meta?.hasChildren && expandedMenus.includes(route.name as string) && !isCollapsed"
          class="submenu"
        >
          <router-link
            v-for="child in getChildRoutes(route.name as string)"
            :key="child.path"
            :to="`${route.path}/${child.path}`"
            class="submenu-item"
            :class="{ active: $route.path === `${route.path}/${child.path}` }"
            :title="child.meta?.title || '未命名'"
          >
            <span class="submenu-icon">•</span>
            <span class="submenu-title">{{ child.meta?.title || '未命名' }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="sidebar-footer" v-if="!isCollapsed">
      <div class="footer-info">
        <p>© {{ currentYear }} 系统</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export default defineComponent({
  name: 'Sidebar',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isCollapsed = ref(false)
    const currentYear = new Date().getFullYear()
    const expandedMenus = ref<string[]>([])

    // 切换侧边栏折叠状态
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
      // 如果折叠了侧边栏，关闭所有展开的子菜单
      if (isCollapsed.value) {
        expandedMenus.value = []
      }
    }

    // 切换子菜单的展开/折叠状态
    const toggleSubmenu = (routeName: string) => {
      const index = expandedMenus.value.indexOf(routeName)
      if (index === -1) {
        expandedMenus.value.push(routeName)
      } else {
        expandedMenus.value.splice(index, 1)
      }
    }

    // 获取所有路由并按照 meta.sort 排序
    const sortedRoutes = computed(() => {
      // 过滤出有 meta.title 的顶级路由
      const routes = router.getRoutes().filter(route => {
        // 只保留有title的路由，并且是顶级路由（路径中只有一个/）
        return route.meta?.title &&
               (route.path === '/' ||
                (route.path.startsWith('/') &&
                 route.path.substring(1).indexOf('/') === -1))
      })

      // 按照 meta.sort 排序，如果没有 sort，则放在最后
      return routes.sort((a, b) => {
        const sortA = a.meta?.sort as number || Infinity
        const sortB = b.meta?.sort as number || Infinity
        return sortA - sortB
      })
    })

    // 获取指定父路由的子路由
    const getChildRoutes = (parentName: string) => {
      const parentRoute = router.getRoutes().find(r => r.name === parentName)
      if (!parentRoute) return []

      console.log('Parent route:', parentRoute)

      // 查找所有以父路由路径开头的子路由
      const children = router.getRoutes()
        .filter(r => {
          return r.path.startsWith(parentRoute.path + '/') && r.meta?.title
        })
        .sort((a, b) => {
          const sortA = a.meta?.sort as number || Infinity
          const sortB = b.meta?.sort as number || Infinity
          return sortA - sortB
        })

      console.log('Children routes:', children)
      return children
    }

    // 检查路由或其子路由是否处于激活状态
    const isRouteActive = (parentRoute: RouteRecordRaw) => {
      // 检查当前路由是否是父路由
      if (route.path === parentRoute.path) return true

      // 检查当前路由是否是父路由的子路由
      return route.path.startsWith(parentRoute.path + '/')
    }

    return {
      sortedRoutes,
      isCollapsed,
      toggleCollapse,
      currentYear,
      route,
      expandedMenus,
      toggleSubmenu,
      getChildRoutes,
      isRouteActive
    }
  }
})
</script>

<style scoped>
.sidebar {
  @apply w-60 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  @apply w-16;
}

.sidebar-header {
  @apply px-5 py-4 border-b border-gray-200 flex items-center justify-between h-16;
}

.sidebar-header h3 {
  @apply m-0 text-gray-800 text-lg font-medium truncate;
}

.toggle-btn {
  @apply cursor-pointer w-6 h-6 flex items-center justify-center rounded transition-all;
}

.toggle-btn:hover {
  @apply bg-gray-100;
}

.toggle-icon {
  @apply text-gray-500 text-sm;
}

.sidebar-menu {
  @apply py-4 flex flex-col flex-1 overflow-y-auto;
}

.menu-group {
  @apply mb-1;
}

.menu-item {
  @apply px-5 py-3 text-gray-700 no-underline text-sm transition-all relative flex items-center overflow-hidden cursor-pointer;
}

.menu-icon {
  @apply w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0;
}

.default-icon {
  @apply text-gray-400 text-lg;
}

.menu-title {
  @apply truncate flex-1;
}

.menu-item:hover {
  @apply bg-gray-50 text-primary;
}

.menu-item.active {
  @apply text-primary bg-blue-50;
}

.menu-item.active::before {
  @apply content-[''] absolute left-0 top-0 bottom-0 w-1 bg-primary;
}

/* 父菜单样式 */
.parent-menu {
  @apply relative;
}

.submenu-arrow {
  @apply absolute right-4 text-xs transition-transform;
}

.parent-menu.expanded .submenu-arrow {
  @apply transform rotate-180;
}

/* 子菜单容器样式 */
.submenu {
  @apply bg-gray-50 overflow-hidden;
}

/* 子菜单项样式 */
.submenu-item {
  @apply px-5 py-2 pl-10 text-gray-600 no-underline text-sm transition-all flex items-center overflow-hidden;
}

.submenu-item:hover {
  @apply bg-gray-100 text-primary;
}

.submenu-item.active {
  @apply text-primary bg-blue-100;
}

.submenu-item.active::before {
  @apply content-[''] absolute left-0 top-0 bottom-0 w-1 bg-primary;
}

.submenu-icon {
  @apply mr-2 text-xs;
}

.submenu-title {
  @apply truncate;
}

.sidebar-footer {
  @apply px-5 py-4 border-t border-gray-200 text-xs text-gray-500;
}

.footer-info p {
  @apply m-0;
}

/* 优化折叠状态下的样式 */
.sidebar.collapsed .menu-item {
  @apply justify-center px-0;
}

.sidebar.collapsed .menu-icon {
  @apply mr-0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    @apply w-16;
  }

  .sidebar-header h3,
  .menu-title,
  .sidebar-footer {
    @apply hidden;
  }
}
</style>
