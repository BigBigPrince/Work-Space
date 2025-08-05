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
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.main-tabs :deep(.el-tabs__nav) {
  padding: 0 1.5rem;
  padding-top: 1rem;
}

.main-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #64748b;
  padding: 0.75rem 1rem;
}

.main-tabs :deep(.el-tabs__item.is-active) {
  color: #3b82f6;
}

.main-tabs :deep(.el-tabs__active-bar) {
  background-color: #3b82f6;
  height: 2px;
}

.sub-tabs :deep(.el-tabs__item) {
  padding: 0.5rem 1.25rem;
  margin: 0 0.25rem;
  border-radius: 0.5rem 0.5rem 0 0;
  border: 1px solid transparent;
}

.sub-tabs :deep(.el-tabs__item.is-active) {
  background-color: #eff6ff;
  color: #3b82f6;
  border-color: #e2e8f0;
}

.sub-tabs :deep(.el-tabs__nav) {
  border-bottom: none;
}

.el-table {
  width: 100%;
  margin-top: 1rem;
}

.el-table :deep(th) {
  background-color: #f1f5f9;
  font-weight: 500;
  color: #475569;
}

.el-table :deep(.el-table__row) {
  transition: background-color 0.2s;
  cursor: pointer;
}

.el-table :deep(.el-table__row:hover) {
  background-color: #f8fafc;
}

.el-tag {
  border-radius: 9999px;
  padding: 0 0.75rem;
}
</style>
