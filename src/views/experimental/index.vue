<template>
  <div class="experimental-container">
    <div class="max-w-7xl mx-auto">
      <!-- 主TAB区域 -->
      <el-tabs v-model="activeMainTab" class="main-tabs" @tab-change="handleMainTabChange">
        <el-tab-pane
            v-for="mainTab in tabData.mainTabs"
            :key="mainTab.id"
            :label="mainTab.label"
            :name="mainTab.id"
        >
          <!-- 子TAB区域 -->
          <div class="pt-4">
            <el-tabs v-model="activeSubTab" class="sub-tabs" type="card">
              <el-tab-pane
                  v-for="subTab in mainTab.children"
                  :key="subTab.id"
                  :label="subTab.label"
                  :name="subTab.id"
              >
                <!-- 表格区域 -->
                <div class="py-5">
                  <el-table :data="currentTableData" @row-click="handleRowClick" class="modern-table">
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
                            class="status-tag"
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

:root {
  --primary-color: #4361ee;
  --primary-light: #eef2ff;
  --secondary-color: #3f37c9;
  --success-color: #06d6a0;
  --warning-color: #ffd166;
  --danger-color: #ef476f;
  --dark-color: #1e293b;
  --light-color: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-500: #64748b;
  --gray-700: #334155;
  --border-radius: 12px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
  --transition: all 0.3s ease;
}

body {
  background-color: #f8fafc;
  color: var(--dark-color);
  line-height: 1.6;
}

.experimental-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 标题区域 */
.header-section {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-200);
}

.header-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--dark-color);
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-subtitle {
  font-size: 16px;
  color: var(--gray-500);
  font-weight: 400;
}

/* 主标签页样式优化 */
.main-tabs .el-tabs__header {
  margin: 0;
}

.main-tabs .el-tabs__nav-wrap::after {
  height: 1px;
  background-color: var(--gray-200);
}

.main-tabs .el-tabs__item {
  padding: 0 24px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-500);
  transition: var(--transition);
}

.main-tabs .el-tabs__item:hover {
  color: var(--primary-color);
}

.main-tabs .el-tabs__item.is-active {
  color: var(--primary-color);
  font-weight: 600;
}

.main-tabs .el-tabs__active-bar {
  height: 3px;
  border-radius: 3px 3px 0 0;
  background-color: var(--primary-color);
}

/* 子标签页样式优化 */
.sub-tabs {
  margin-top: 16px;
}

.sub-tabs .el-tabs__header {
  margin: 0;
}

.sub-tabs .el-tabs__item {
  padding: 0 20px;
  height: 40px;
  border: 1px solid var(--gray-200);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  margin-right: 8px;
  background-color: var(--gray-100);
  color: var(--gray-500);
  transition: var(--transition);
}

.sub-tabs .el-tabs__item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.sub-tabs .el-tabs__item.is-active {
  background-color: white;
  border-color: var(--gray-200);
  color: var(--primary-color);
  font-weight: 500;
  position: relative;
  z-index: 1;
  box-shadow: var(--shadow-sm);
}

/* 表格样式优化 */
.table-container {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--gray-200);
  margin-top: -1px;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table .el-table__header th {
  background-color: var(--gray-100);
  color: var(--gray-700);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 16px;
}

.modern-table .el-table__row {
  transition: var(--transition);
}

.modern-table .el-table__row:hover > td {
  background-color: var(--primary-light) !important;
  cursor: pointer;
}

.modern-table .el-table__row td {
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--gray-200);
}

.modern-table .el-table__row:last-child td {
  border-bottom: none;
}

/* 状态标签 */
.status-tag {
  border-radius: 20px;
  padding: 4px 12px;
  font-weight: 500;
  font-size: 12px;
  border: none;
}

.el-tag.el-tag--success {
  background-color: rgba(6, 214, 160, 0.1);
  color: #06b48a;
}

.el-tag.el-tag--warning {
  background-color: rgba(255, 209, 102, 0.15);
  color: #c9a227;
}

/* 卡片统计区域 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--primary-color);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
}

.stat-card.warning {
  border-left-color: var(--warning-color);
}

.stat-card.danger {
  border-left-color: var(--danger-color);
}

.stat-card.success {
  border-left-color: var(--success-color);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--dark-color);
}

.stat-label {
  font-size: 14px;
  color: var(--gray-500);
  display: flex;
  align-items: center;
}

.stat-label i {
  margin-right: 8px;
  font-size: 18px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .experimental-container {
    padding: 20px 15px;
  }

  .header-title {
    font-size: 26px;
  }

  .main-tabs .el-tabs__item {
    padding: 0 12px;
    font-size: 14px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
