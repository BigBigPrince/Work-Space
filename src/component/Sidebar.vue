<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <h3 v-if="!isCollapsed">导航菜单</h3>
      <div class="toggle-btn" @click="toggleCollapse" :title="isCollapsed ? '展开菜单' : '收起菜单'">
        <el-icon :size="14"><component :is="isCollapsed ? 'ArrowRight' : 'ArrowLeft'" /></el-icon>
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
          :title="String(route.meta?.title || '未命名')"
        >
          <div class="menu-icon">
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <el-icon v-else><Folder /></el-icon>
          </div>
          <span class="menu-title" v-if="!isCollapsed">{{ route.meta?.title || '未命名' }}</span>
          <el-icon
            v-if="!isCollapsed"
            class="submenu-arrow"
            :size="14"
          >
            <component :is="expandedMenus.includes(route.name as string) ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>

        <!-- 没有子菜单的普通菜单项 -->
        <router-link
          v-else
          :to="route.path"
          class="menu-item"
          :class="{ active: isRouteActive(route) }"
          :title="String(route.meta?.title || '未命名')"
        >
          <div class="menu-icon">
            <el-icon v-if="route.meta?.icon">
              <component :is="route.meta.icon" />
            </el-icon>
            <el-icon v-else><Document /></el-icon>
          </div>
          <span class="menu-title" v-if="!isCollapsed">{{ route.meta?.title || '未命名' }}</span>
        </router-link>

        <!-- 子菜单 - 正常模式 -->
        <transition name="submenu">
          <div
            v-if="route.meta?.hasChildren && expandedMenus.includes(route.name as string) && !isCollapsed"
            class="submenu"
          >
            <router-link
              v-for="child in getChildRoutes(route.name as string)"
              :key="child.path"
              :to="getChildPath(route.path, child.path)"
              class="submenu-item"
              :class="{ active: isChildRouteActive(route.path, child.path) }"
              :title="String(child.meta?.title || '未命名')"
            >
              <div class="menu-icon">
                <el-icon v-if="child.meta?.icon">
                  <component :is="child.meta.icon" />
                </el-icon>
                <el-icon v-else><Document /></el-icon>
              </div>
              <span class="submenu-title">{{ child.meta?.title || '未命名' }}</span>
            </router-link>
          </div>
        </transition>

        <!-- 子菜单 - 折叠模式下的悬浮菜单 -->
        <div
          v-if="route.meta?.hasChildren && isCollapsed"
          class="collapsed-submenu-trigger"
          @mouseenter="showCollapsedSubmenu(route.name as string)"
          @mouseleave="hideCollapsedSubmenu"
          style="position: relative;"
        >
          <transition name="fade">
            <div
              v-show="hoveredMenu === route.name"
              class="collapsed-submenu"
              style="position: absolute; left: 100%; top: 0; z-index: 1000; min-width: 180px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 6px;"
            >
              <div class="collapsed-submenu-title">{{ route.meta?.title || '未命名' }}</div>
              <router-link
                v-for="child in getChildRoutes(route.name as string)"
                :key="child.path"
                :to="getChildPath(route.path, child.path)"
                class="collapsed-submenu-item"
                :class="{ active: isChildRouteActive(route.path, child.path) }"
              >
                <div class="menu-icon">
                  <el-icon v-if="child.meta?.icon">
                    <component :is="child.meta.icon" />
                  </el-icon>
                  <el-icon v-else><Document /></el-icon>
                </div>
                <span>{{ child.meta?.title || '未命名' }}</span>
              </router-link>
            </div>
          </transition>
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
import { computed, defineComponent, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { Document, Folder, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    Document,
    Folder,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ArrowDown
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isCollapsed = ref(false)
    const currentYear = new Date().getFullYear()
    const expandedMenus = ref<string[]>([])

    // 折叠状态下悬浮显示的子菜单
    const hoveredMenu = ref<string | null>(null)
    const clickedMenu = ref<string | null>(null)

    // 切换侧边栏折叠状态
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
      clickedMenu.value = null // 折叠/展开时关闭所有点击菜单
    }

    // 切换子菜单的展开/折叠状态
    const toggleSubmenu = (routeName: string) => {
      if (isCollapsed.value) {
        // 折叠状态下点击主菜单项，切换弹出层
        clickedMenu.value = clickedMenu.value === routeName ? null : routeName
      } else {
        // 展开状态下正常切换子菜单展开状态
        const index = expandedMenus.value.indexOf(routeName)
        if (index === -1) {
          expandedMenus.value.push(routeName)
        } else {
          expandedMenus.value.splice(index, 1)
        }
      }
    }

    // 显示折叠状态下的子菜单
    const showCollapsedSubmenu = (menuName: string) => {
      hoveredMenu.value = menuName
    }

    // 隐藏折叠状态下的子菜单
    const hideCollapsedSubmenu = () => {
      hoveredMenu.value = null
    }

    // 点击外部关闭菜单的指令
    const vClickOutside = {
      beforeMount(el: any, binding: any) {
        el.clickOutsideEvent = (event: Event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el: any) {
        document.removeEventListener('click', el.clickOutsideEvent)
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

      return children
    }

    // 构建子路由的完整路径
    const getChildPath = (parentPath: string, childPath: string) => {
      // 如果子路径已经是完整路径（以/开头），则直接返回
      if (childPath.startsWith('/')) {
        return childPath
      }

      // 确保父路径以/结尾，子路径不以/开头
      const normalizedParentPath = parentPath.endsWith('/') ? parentPath : `${parentPath}/`
      const normalizedChildPath = childPath.startsWith('/') ? childPath.substring(1) : childPath

      return `${normalizedParentPath}${normalizedChildPath}`
    }

    // 检查路由或其子路由是否处于激活状态
    const isRouteActive = (parentRoute: RouteRecordRaw) => {
      // 检查当前路由是否是父路由
      if (route.path === parentRoute.path) return true

      // 检查当前路由是否是父路由的子路由
      if (route.path.startsWith(parentRoute.path + '/')) return true

      // 检查该路由的子路由是否激活
      const childRoutes = getChildRoutes(parentRoute.name as string)
      for (const child of childRoutes) {
        const fullChildPath = getChildPath(parentRoute.path, child.path)
        if (route.path === fullChildPath || route.path.startsWith(fullChildPath + '/')) {
          return true
        }
      }

      return false
    }

    // 检查子路由是否激活
    const isChildRouteActive = (parentPath: string, childPath: string) => {
      const fullPath = getChildPath(parentPath, childPath)
      return route.path === fullPath || route.path.startsWith(fullPath + '/')
    }

    // 根据当前路由自动展开菜单
    const autoExpandMenus = () => {
      const currentPath = route.path

      // 检查每个顶级路由
      sortedRoutes.value.forEach(topRoute => {
        if (topRoute.meta?.hasChildren) {
          // 检查该顶级路由的子路由
          const childRoutes = getChildRoutes(topRoute.name as string)
          for (const child of childRoutes) {
            const fullChildPath = getChildPath(topRoute.path, child.path)
            if (currentPath === fullChildPath || currentPath.startsWith(fullChildPath + '/')) {
              // 如果当前路由匹配子路由，展开父菜单
              if (!expandedMenus.value.includes(topRoute.name as string)) {
                expandedMenus.value.push(topRoute.name as string)
              }
              break
            }
          }
        }
      })
    }

    // 监听路由变化，自动展开对应的菜单
    watch(() => route.path, () => {
      autoExpandMenus()
    })

    // 组件挂载时自动展开当前路由对应的菜单
    onMounted(() => {
      autoExpandMenus()
    })

    return {
      sortedRoutes,
      isCollapsed,
      toggleCollapse,
      currentYear,
      route,
      expandedMenus,
      toggleSubmenu,
      getChildRoutes,
      isRouteActive,
      isChildRouteActive,
      getChildPath,
      hoveredMenu,
      clickedMenu,
      showCollapsedSubmenu,
      hideCollapsedSubmenu,
      vClickOutside,
    }
  }
})
</script>

<style scoped>
.sidebar {
  @apply w-64 h-full bg-white flex flex-col relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  @apply w-16;
}

.sidebar-header {
  @apply px-6 py-5 flex items-center justify-between h-16;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.sidebar-header h3 {
  @apply m-0 text-gray-700 text-lg font-semibold truncate;
}

.toggle-btn {
  @apply cursor-pointer w-6 h-6 flex items-center justify-center rounded-full transition-all;
}

.toggle-btn:hover {
  @apply bg-gray-100;
}

.sidebar-menu {
  @apply py-3 flex flex-col flex-1 overflow-y-auto;
}

.menu-group {
  @apply mb-1;
  position: relative;
}

.menu-item {
  @apply px-6 py-3 text-gray-600 no-underline text-sm transition-all relative flex items-center overflow-hidden cursor-pointer;
  margin: 2px 8px;
  border-radius: 6px;
}

.menu-icon {
  @apply w-5 h-5 flex items-center justify-center mr-3 flex-shrink-0;
  transition: all 0.2s ease;
}

.menu-title {
  @apply truncate flex-1 font-medium;
}

.menu-item:hover {
  @apply bg-gray-50 text-gray-900;
}

.menu-item:hover .menu-icon {
  @apply text-gray-700;
}

.menu-item.active {
  @apply text-indigo-600 bg-indigo-50;
}

.menu-item.active .menu-icon {
  @apply text-indigo-600;
}

.menu-item.active::before {
  @apply content-[''] absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r;
}

/* 移除父菜单容器更靠左的激活状态指示条 */
.menu-group.active::before,
.menu-group.active > .menu-item::before {
  display: none !important;
}

/* 父菜单样式 */
.parent-menu {
  @apply relative;
}

.submenu-arrow {
  @apply absolute right-4 transition-all duration-200 text-gray-400;
}

.parent-menu:hover .submenu-arrow {
  @apply text-gray-600;
}

.parent-menu.expanded .submenu-arrow {
  @apply text-gray-600;
}

/* 子菜单容器样式 */
.submenu {
  @apply overflow-hidden;
  background-color: rgba(241, 245, 249, 0.5);
  border-radius: 0 0 6px 6px;
  margin: 0 8px 4px;
}

/* 子菜单项样式 */
.submenu-item {
  @apply px-6 py-2 pl-12 text-gray-500 no-underline text-sm transition-all flex items-center overflow-hidden;
}

.submenu-item:hover {
  @apply bg-gray-100 text-gray-800;
}

.submenu-item.active {
  @apply text-indigo-600 bg-indigo-100;
}

/*
.submenu-item.active::before {
  @apply content-[''] absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r;
}*/

.submenu-title {
  @apply truncate ml-2;
}

.sidebar-footer {
  @apply px-6 py-4 text-xs text-gray-400;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.footer-info p {
  @apply m-0;
}

/* 优化折叠状态下的样式 */
.sidebar.collapsed .menu-item {
  @apply justify-center px-0 mx-2;
}

.sidebar.collapsed .menu-icon {
  @apply mr-0;
}

/* 折叠状态下的子菜单样式 */
.collapsed-submenu-trigger {
  position: relative;
}

.collapsed-submenu {
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 180px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 8px 0;
}

.collapsed-submenu-title {
  padding: 8px 16px;
  font-weight: 500;
  color: #64748b;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  margin-bottom: 4px;
}

.collapsed-submenu-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s;
}

.collapsed-submenu-item:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.collapsed-submenu-item.active {
  color: #4f46e5;
  background-color: #eef2ff;
}

/* 动画效果 */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

  /* 在移动端，确保侧边栏不会被其他内容覆盖 */
  .sidebar {
    z-index: 50;
  }

  /* 在移动端，悬浮子菜单需要更大的点击区域 */
  .collapsed-submenu-item {
    padding: 10px 16px;
  }
}
</style>
