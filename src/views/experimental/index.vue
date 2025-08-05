<template>
  <div class="experimental-container">
    <h1 class="text-2xl font-bold mb-6">实验机汇总</h1>

    <!-- 主TAB -->
    <el-tabs v-model="activeMainTab" class="mb-4">
      <el-tab-pane
        v-for="mainTab in tabData.mainTabs"
        :key="mainTab.id"
        :label="mainTab.label"
        :name="mainTab.id"
      >
        <!-- 子TAB -->
        <el-tabs v-model="activeSubTab" class="mb-6">
          <el-tab-pane
            v-for="subTab in mainTab.children"
            :key="subTab.id"
            :label="subTab.label"
            :name="subTab.id"
          >
            <!-- 表格区域 -->
            <el-table :data="currentTableData" border class="w-full">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="name" label="设备名称" width="180" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.status === '正常' ? 'success' : 'warning'">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="location" label="位置" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import tabData from '@/assets/data/experimental/tabs.json'

// 响应式状态
const activeMainTab = ref('tab1')
const activeSubTab = ref('subtab1')

// 计算当前显示的表格数据
const currentTableData = computed(() => {
  const mainTab = tabData.mainTabs.find(tab => tab.id === activeMainTab.value)
  if (!mainTab) return []

  const subTab = mainTab.children.find(tab => tab.id === activeSubTab.value)
  return subTab ? subTab.tableData : []
})

// 初始化时设置默认选中的子TAB
onMounted(() => {
  if (tabData.mainTabs.length > 0 && tabData.mainTabs[0].children.length > 0) {
    activeSubTab.value = tabData.mainTabs[0].children[0].id
  }
})
</script>

<style scoped>
.experimental-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
