<script setup lang="ts">
import Sidebar from './component/Sidebar.vue'
</script>

<template>
  <div class="app-container">
    <Sidebar class="app-sidebar" />
    <div class="app-content">
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
}

#app {
  height: 100%;
  width: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.app-sidebar {
  flex-shrink: 0;
  height: 100%;
}

.app-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}
</style>
