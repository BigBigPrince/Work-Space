<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Sidebar from './component/Sidebar.vue'

// 响应式状态，用于跟踪屏幕宽度
const screenWidth = ref(window.innerWidth)
const isMobileView = ref(screenWidth.value < 768)
const isSidebarOpen = ref(!isMobileView.value)
const isMobileDevice = ref(false)

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


// 检测是否为移动设备
const checkMobileDevice = () => {
  // 使用正则表达式检测常见移动设备
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  isMobileDevice.value = mobileRegex.test(navigator.userAgent)
}

// 组件挂载时添加窗口大小变化监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 初始化状态
  checkMobileDevice() // 检测移动设备
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
  <!-- 移动设备访问限制 -->
  <div v-if="isMobileDevice" class="mobile-restriction">
    <div class="restriction-content">
      <div class="text-container">
        <h1 class="main-text">请使用PC端访问</h1>
        <p class="sub-text">本系统不支持移动设备</p>
      </div>
      <div class="decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
  </div>

  <!-- 正常应用内容 -->
  <div v-else class="app-container">
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

/* 移动设备访问限制样式 */
.mobile-restriction {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
}

.restriction-content {
  text-align: center;
  color: white;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.text-container {
  animation: fadeInUp 1s ease forwards, float 6s ease-in-out infinite;
}

.main-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

.sub-text {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

/* 装饰性元素 */
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  top: -100px;
  right: -100px;
  animation: pulse 8s infinite alternate;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15);
  bottom: -50px;
  left: -50px;
  animation: pulse 12s infinite alternate-reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  top: 40%;
  right: 10%;
  animation: pulse 10s infinite alternate;
}

/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
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

  /* 移动设备访问限制页面的样式优化 */
  .mobile-restriction .main-text {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .mobile-restriction .sub-text {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .circle-1 {
    width: 200px;
    height: 200px;
  }

  .circle-2 {
    width: 150px;
    height: 150px;
  }

  .circle-3 {
    width: 100px;
    height: 100px;
  }
}

/* 添加额外的动画效果 */
.mobile-restriction::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
  animation: pulse 15s infinite alternate;
}

.main-text {
  position: relative;
  display: inline-block;
}

.main-text::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
