<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Sidebar from './component/Sidebar.vue'

// 响应式状态，用于跟踪屏幕宽度
const screenWidth = ref(window.innerWidth)
const isMobileView = ref(screenWidth.value < 768)
const isSidebarOpen = ref(!isMobileView.value)

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
  isMobileView.value = screenWidth.value < 768

  // 在移动视图下，默认关闭侧边栏
  if (isMobileView.value && isSidebarOpen.value) {
    isSidebarOpen.value = false
  } else if (!isMobileView.value && !isSidebarOpen.value) {
    // 在桌面视图下，默认打开侧边栏
    isSidebarOpen.value = true
  }
}


// 组件挂载时添加窗口大小变化监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 初始化状态
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听移动视图状态变化
watch(isMobileView, (newValue) => {
  if (newValue && isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
})
</script>

<template>
  <div class="app-container">

    <!-- 侧边栏 - 使用v-show而不是v-if以保持状态 -->
    <Sidebar
        class="app-sidebar"
        v-show="isSidebarOpen"
        @close="isMobileView && (isSidebarOpen = false)"
    />

    <!-- 移动视图下的遮罩层 -->
    <div
        v-if="isMobileView && isSidebarOpen"
        class="sidebar-overlay"
        @click="isSidebarOpen = false"
    ></div>

    <!-- 主内容区域 -->
    <div class="app-content" :class="{ 'full-width': !isSidebarOpen }">
      <RouterView />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden; /* 防止整页滚动 */
}

#app {
  height: 100%;
  width: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column; /* 在移动视图下改为列布局 */
  height: 100%;
  width: 100%;
  position: relative; /* 用于定位遮罩层 */
}


.app-sidebar {
  flex-shrink: 0;
  height: 100%;
  z-index: 40; /* 确保侧边栏在遮罩层之上 */
}

/* 侧边栏遮罩层 */
.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  animation: fadeIn 0.3s ease;
}

.app-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
}

.app-content.full-width {
  margin-left: 0;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 响应式布局 */
@media (min-width: 768px) {
  .app-container {
    flex-direction: row; /* 桌面视图使用行布局 */
  }

  .mobile-header {
    display: none; /* 隐藏移动导航栏 */
  }

  .app-sidebar {
    position: relative; /* 重置为正常文档流 */
  }
}

/* 中等屏幕尺寸优化 */
@media (min-width: 768px) and (max-width: 1024px) {
  .app-content {
    padding: 16px;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 767px) {


  .app-content {
    padding: 16px;
  }
}
</style>
