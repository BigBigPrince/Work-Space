<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <h3 v-if="!isCollapsed">导航菜单</h3>
      <div class="toggle-btn" @click="toggleCollapse">
        <span class="toggle-icon">{{ isCollapsed ? '→' : '←' }}</span>
      </div>
    </div>
    <div class="sidebar-menu">
      <router-link
        v-for="route in sortedRoutes"
        :key="route.path"
        :to="route.path"
        class="menu-item"
        :class="{ active: $route.path === route.path }"
        :title="route.meta?.title || '未命名'"
      >
        <div class="menu-icon" v-if="route.meta?.icon">
          <!-- 如果路由有图标，可以在这里显示 -->
          <i :class="route.meta.icon"></i>
        </div>
        <div v-else class="menu-icon">
          <!-- 默认图标占位 -->
          <span class="default-icon"></span>
        </div>
        <span class="menu-title" v-if="!isCollapsed">{{ route.meta?.title || '未命名' }}</span>
      </router-link>
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

    // 切换侧边栏折叠状态
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }

    // 获取所有路由并按照 meta.sort 排序
    const sortedRoutes = computed(() => {
      // 过滤出有 meta.title 的路由
      const routes = router.getRoutes().filter(route => route.meta?.title)

      // 按照 meta.sort 排序，如果没有 sort，则放在最后
      return routes.sort((a, b) => {
        const sortA = a.meta?.sort as number || Infinity
        const sortB = b.meta?.sort as number || Infinity
        return sortA - sortB
      })
    })

    return {
      sortedRoutes,
      isCollapsed,
      toggleCollapse,
      currentYear,
      route
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

.menu-item {
  @apply px-5 py-3 text-gray-700 no-underline text-sm transition-all relative flex items-center overflow-hidden;
}

.menu-icon {
  @apply w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0;
}

.default-icon {
  @apply text-gray-400 text-lg;
}

.menu-title {
  @apply truncate;
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
