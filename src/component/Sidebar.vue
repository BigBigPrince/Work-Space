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
          <!-- 默认图标 -->
          <span class="default-icon">•</span>
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
  width: 240px;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: width 0.3s ease;
  position: relative;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.sidebar-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-btn {
  cursor: pointer;
  width: 24px;
  height: 24px;

display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.toggle-btn:hover {
  background-color: #f0f0f0;
}

.toggle-icon {
  font-size: 14px;
  color: #999;
}

.sidebar-menu {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}

.menu-item {
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.default-icon {
  font-size: 18px;
  color: #999;
}

.menu-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.menu-item.active {
  color: #1890ff;
  background-color: #e6f7ff;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #1890ff;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #999;
}

.footer-info p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
  }

  .sidebar-header h3 {
    display: none;
  }

  .menu-title {
    display: none;
  }

  .sidebar-footer {
    display: none;
  }
}
</style>
