<template>
  <div class="experimental-container">
    <div class="max-w-7xl mx-auto">
      <!-- 标题区 -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-800">实验机管理系统</h1>
        <p class="text-gray-500 mt-2">实时监控和管理实验室设备状态</p>
      </div>

      <!-- 主内容区 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- 主TAB -->
        <el-tabs v-model="activeMainTab" class="main-tabs">
          <el-tab-pane
            v-for="mainTab in tabData.mainTabs"
            :key="mainTab.id"
            :label="mainTab.label"
            :name="mainTab.id"
          >
            <!-- 子TAB -->
            <div class="px-6 pt-2 pb-4">
              <el-tabs v-model="activeSubTab" class="sub-tabs" type="card">
                <el-tab-pane
                  v-for="subTab in mainTab.children"
                  :key="subTab.id"
                  :label="subTab.label"
                  :name="subTab.id"
                >
                  <!-- 表格区域 -->
                  <div class="px-2 py-4">
                    <el-table :data="currentTableData" @row-click="handleRowClick">
                      <el-table-column
                        v-for="column in currentColumns"
                        :key="column.prop"
                        :prop="column.prop"
                        :label="column.label"
                        :width="column.width"
                        :align="column.align"
                      >
                        <template #default="{ row }" v-if="column.renderType === 'tag'">
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
  padding: 1.5rem 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* 标题区域 */
.mb-8 h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: -0.025em;
}

.mb-8 p {
  color: #6b7280;
  font-size: 0.95rem;
}

/* 主TAB样式 */
.main-tabs :deep(.el-tabs__nav) {
  padding: 0 2rem;
  margin-top: 0.5rem;
}

.main-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #6b7280;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.main-tabs :deep(.el-tabs__item.is-active) {
  color: #1d4ed8;
  font-weight: 600;
}

.main-tabs :deep(.el-tabs__active-bar) {
  background-color: #1d4ed8;
  height: 3px;
  border-radius: 3px 3px 0 0;
}

/* 子TAB样式 */
.sub-tabs :deep(.el-tabs__item) {
  padding: 0.6rem 1.5rem;
  margin: 0 0.5rem 0 0;
  border-radius: 6px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.sub-tabs :deep(.el-tabs__item.is-active) {
  background-color: #1d4ed8;
  color: white;
  font-weight: 500;
}

.sub-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0;
}
.sub-tabs :deep(.el-tabs__nav) {
  border: none !important;
  padding: 0.5rem 0;
}
.sub-tabs :deep(.el-tabs__content) {
  padding: 0;
  border: none !important;
}

/* 表格样式 */
.el-table {
  width: 100%;
  margin-top: 0.5rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.el-table :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

.el-table :deep(td) {
  font-size: 0.9rem;
  color: #4b5563;
}

.el-table :deep(.el-table__row) {
  transition: all 0.2s;
  cursor: pointer;
}

.el-table :deep(.el-table__row:hover) {
  background-color: #f8fafc;
}

/* 标签样式 */
.el-tag {
  border-radius: 12px;
  padding: 0 0.75rem;
  height: 26px;
  line-height: 26px;
  font-size: 0.8rem;
  font-weight: 500;
}

.el-tag.el-tag--success {
  background-color: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}

.el-tag.el-tag--warning {
  background-color: #fffbeb;
  color: #92400e;
  border-color: #fcd34d;
}

/* 内容卡片 */
.bg-white {
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
