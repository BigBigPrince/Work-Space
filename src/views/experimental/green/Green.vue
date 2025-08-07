<template>
  <div class="tab-container green-theme" :class="{ 'loading': loading }">
    <div class="tabs-nav">
      <div
        v-for="(tab, idx) in tabs"
        :key="tab.id"
        :class="['tab-item', { active: activeTab === tab.id }]"
        :style="{ '--index': idx }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </div>
    </div>

    <transition name="tab-transition" mode="out-in">
      <div class="table-wrapper" v-if="currentTabData && !loading" :key="activeTab">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="column in currentTabData.columns" :key="column.key" :style="{ width: column.width + 'px' }">
                {{ column.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in currentTabData.data"
              :key="index"
              :style="{ '--index': index }"
            >
              <td v-for="column in currentTabData.columns" :key="column.key">
                <template v-if="isUrl(row[column.dataIndex])">
                  <a :href="row[column.dataIndex]" target="_blank" class="url-link">
                    {{ row[column.dataIndex] }}
                  </a>
                </template>
                <template v-else>
                  {{ row[column.dataIndex] }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="no-data fade-in" v-else-if="!loading" :key="'no-data'">
        暂无数据
      </div>

      <div class="no-data loading" v-else :key="'loading'">
        <!-- 加载中状态由CSS处理 -->
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import '@/assets/styles/experimental-tabs.css';
import '@/assets/styles/experimental-animations.css';

// 定义Tab数据结构
interface Column {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface TabData {
  name: string;
  columns: Column[];
  data: Record<string, any>[];
}

interface Tab {
  id: string;
  name: string;
  data: TabData | null;
}

// 状态
const tabs = ref<Tab[]>([]);
const activeTab = ref<string>('');
const tabDataMap = reactive<Record<string, TabData>>({});
const loading = ref(true);

// 计算当前选中的Tab数据
const currentTabData = computed(() => {
  return activeTab.value ? tabDataMap[activeTab.value] : null;
});

// 加载Tab数据
const loadTabData = async () => {
  loading.value = true;
  try {
    // 动态导入所有JSON文件
    const jsonFiles = import.meta.glob('/src/assets/data/experimental/green/*.json');

    for (const path in jsonFiles) {
      const fileName = path.split('/').pop()?.replace('.json', '') || '';

      // 加载JSON文件内容
      const module = await jsonFiles[path]();
      const data = module.default;

      // 存储数据
      tabDataMap[fileName] = data;

      // 添加到tabs列表
      tabs.value.push({
        id: fileName,
        name: data.name || fileName, // 使用JSON中的name字段，如果不存在则使用文件名
        data: data
      });
    }

    // 默认选中第一个Tab
    if (tabs.value.length > 0) {
      activeTab.value = tabs.value[0].id;
    }
  } catch (error) {
    console.error('加载Tab数据失败:', error);
  } finally {
    // 短暂延迟以便显示加载动画
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
};

// 判断是否为URL
const isUrl = (str: string) => {
  if (!str) return false;
  try {
    // 尝试创建URL对象，能成功则认为是有效URL
    new URL(str);
    return true;
  } catch {
    // 检查是否是IP地址或局域网地址
    const ipPattern = /^(https?:\/\/)?((\d{1,3}\.){3}\d{1,3}|localhost)(:\d+)?(\/.*)?$/i;
    return ipPattern.test(str);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadTabData();
});
</script>

<style scoped>
/* 绿色主题样式 */
.green-theme .tab-item:hover {
  color: #52c41a;
}

.green-theme .tab-item.active {
  color: #52c41a;
}

.green-theme .tab-item.active::after {
  background-color: #52c41a;
}

.green-theme .data-table th {
  background-color: #f6ffed;
}

.green-theme .data-table tr:hover td {
  background-color: #f6ffed;
}

/* 表格行交替颜色 */
.green-theme .data-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

/* 绿色主题特有的阴影效果 */
.green-theme .table-wrapper {
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.05);
}

.green-theme .table-wrapper:hover {
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.08);
}

/* 绿色主题滚动条 */
.green-theme .table-wrapper::-webkit-scrollbar-thumb {
  background: #d9f7be;
}

.green-theme .table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #b7eb8f;
}

/* URL链接样式 - 绿色主题 */
.green-theme .url-link {
  color: #52c41a;
  text-decoration: none;
  transition: color 0.2s;
}

.green-theme .url-link:hover {
  color: #73d13d;
  text-decoration: underline;
}

.green-theme .url-link:visited {
  color: #389e0d;
}
</style>
