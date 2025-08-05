<template>
  <div class="experimental-container">
    <div class="max-w-7xl mx-auto">
      <!-- 标题区 -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-800">实验机管理系统</h1>
        <p class="text-gray-500 mt-2">实时监控和管理实验室设备状态</p>
      </div>

      <!-- 主TAB区域 - 移除外部包裹容器 -->
      <el-tabs v-model="activeMainTab" class="main-tabs">
        <el-tab-pane
            v-for="mainTab in tabData.mainTabs"
            :key="mainTab.id"
            :label="mainTab.label"
            :name="mainTab.id"
        >
          <!-- 子TAB区域 - 移除外部包裹容器 -->
          <div class="pt-2 pb-4">
            <el-tabs v-model="activeSubTab" class="sub-tabs" type="card">
              <el-tab-pane
                  v-for="subTab in mainTab.children"
                  :key="subTab.id"
                  :label="subTab.label"
                  :name="subTab.id"
              >
                <!-- 表格区域 -->
                <div class="py-4">
                  <el-table :data="currentTableData" @row-click="handleRowClick">
                    <el-table-column
                        v-for="column in currentColumns"
                        :key="column.prop"
                        :prop="column.prop"
                        :label="column.label"
                        :width="column.width"
                        :align="column.align"
                    >
                      <template #default="{ row }" v-if="column.renderType  === 'tag'">
                        <el-tag
                            :type="row[column.prop] === '正常' ? 'success' : 'warning'"
                            effect="light"
                            class="rounded-full px-3"
                        >
                          {{ row[column.prop] }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import tabData from '@/assets/data/experimental/tabs.json'
import type { TabsPaneContext } from 'element-plus'

// 响应式状态
const activeMainTab = ref('tab1')
const activeSubTab = ref('subtab1')

// 计算当前显示的表格数据和列配置
const currentTableData = computed(() => {
  const mainTab = tabData.mainTabs.find(tab => tab.id === activeMainTab.value)
  if (!mainTab) return []

  const subTab = mainTab.children.find(tab => tab.id === activeSubTab.value)
  return subTab ? subTab.tableData : []
})

const currentColumns = computed(() => {
  const mainTab = tabData.mainTabs.find(tab => tab.id === activeMainTab.value)
  if (!mainTab) return []

  const subTab = mainTab.children.find(tab => tab.id === activeSubTab.value)
  return subTab ? subTab.columns : []
})

// 主TAB切换处理
const handleMainTabChange = (tab: TabsPaneContext) => {
  const mainTab = tabData.mainTabs.find(t => t.id === tab.paneName)
  if (mainTab && mainTab.children.length > 0) {
    activeSubTab.value = mainTab.children[0].id
  }
}

// 表格行点击处理
const handleRowClick = (row: any) => {
  console.log('Row clicked:', row)
}

// 初始化时设置默认选中的子TAB
onMounted(() => {
  if (tabData.mainTabs.length > 0 && tabData.mainTabs[0].children.length > 0) {
    activeSubTab.value = tabData.mainTabs[0].children[0].id
  }
})
</script>

<style scoped>
.experimental-container {
  padding: 2rem 2.5rem;
  background: linear-gradient(145deg, #f8fafc, #f0f4f8);
  min-height: 100vh;
}

/* 标题区域优化 */
.mb-8 h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}

.mb-8 p {
  color: #64748b;
  font-size: 1.05rem;
  font-weight: 400;
}

/* 主TAB样式优化 - 添加卡片效果 */
.main-tabs {
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 30px -10px rgba(30, 41, 59, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  padding-top: 0.75rem;
}

.main-tabs :deep(.el-tabs__nav) {
  padding: 0 2.5rem;
}

.main-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #64748b;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.25px;
}

.main-tabs :deep(.el-tabs__item:hover) {
  color: #2563eb;
}

.main-tabs :deep(.el-tabs__item.is-active)  {
  color: #2563eb;
  font-weight: 600;
}

.main-tabs :deep(.el-tabs__active-bar) {
  background-color: #2563eb;
  height: 3.5px;
  border-radius: 3px 3px 0 0;
}

/* 子TAB区域 - 移除外部包裹 */
.sub-tabs {
  background: transparent;
}

.sub-tabs :deep(.el-tabs__nav) {
  padding: 0.25rem 0;
  margin: 0 1.5rem 1rem; /* 添加左右外边距 */
}

.sub-tabs :deep(.el-tabs__item) {
  padding: 0.75rem 1.75rem;
  margin: 0 0.75rem 0 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.sub-tabs :deep(.el-tabs__item:hover) {
  background-color: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(30, 41, 59, 0.05);
}

.sub-tabs :deep(.el-tabs__item.is-active)  {
  background-color: #f8fafc;
  color: #2563eb;
  font-weight: 500;
  border-color: #dbeafe;
  box-shadow: inset 0 0 0 1px #dbeafe, 0 4px 8px -2px rgba(30, 41, 59, 0.05);
}

.sub-tabs :deep(.el-tabs__item.is-active::after)  {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #2563eb;
  border-radius: 3px 3px 0 0;
}

/* 表格样式优化 */
.el-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 6px 16px -8px rgba(30, 41, 59, 0.06);
  margin: 0 1.5rem; /* 添加左右外边距 */
}

.el-table :deep(.el-table__header-wrapper) {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.el-table :deep(th) {
  background-color: #f8fafc !important;
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  border-bottom: 1px solid #e2e8f0 !important;
}

.el-table :deep(td) {
  font-size: 0.95rem;
  color: #475569;
  padding: 1.15rem 0;
  border-bottom: 1px solid #f1f5f9 !important;
}

/* 标签样式 */
.el-tag {
  border-radius: 20px;
  padding: 0 1rem;
  height: 28px;
  line-height: 28px;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
/* 子TAB容器改造 */
.sub-tabs {
  --subtabs-border-color: transparent; /* 自定义变量控制边框色 */
}
/* 隐藏所有层级边框 */
.sub-tabs :deep(.el-tabs__header),
.sub-tabs :deep(.el-tabs__nav-wrap),
.sub-tabs :deep(.el-tabs__nav-scroll),
.sub-tabs :deep(.el-tabs__nav) {
  border: none !important;
  box-shadow: none !important;
}
/* 单个标签边框改造 */
.sub-tabs :deep(.el-tabs__item) {
  border: 1px solid var(--subtabs-border-color) !important; /* 默认透明 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 12px !important; /* 优化间距 */
}
/* 悬停态微交互设计 */
.sub-tabs :deep(.el-tabs__item:hover) {
  --subtabs-border-color: #dbeafe; /* 悬停时显示浅蓝色边框 */
  transform: translateY(-2px);
  z-index: 2; /* 保证悬浮层叠效果 */
}
/* 激活态视觉重构 */
.sub-tabs :deep(.el-tabs__item.is-active)  {
  --subtabs-border-color: #bfdbfe; /* 柔和边框色 */
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.08),
  0 2px 4px -2px rgba(37, 99, 235, 0.06) !important;
}
/* 移除底部指示条 */
.sub-tabs :deep(.el-tabs__active-bar) {
  display: none !important;
}
/* 智能边距适配 */
.sub-tabs :deep(.el-tabs__nav) {
  margin: 0 1rem 1rem; /* 保持呼吸感 */
}
</style>
