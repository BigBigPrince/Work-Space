<template>
  <div class="container mx-auto p-4">
    <!-- 搜索框 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">数据查询导航</h1>
      <div class="relative w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索网站..."
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <svg
          class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- 收藏网站区域 -->
    <div v-if="favoriteWebsites.length > 0" class="mb-8">
      <h2 class="text-xl font-bold mb-4">收藏网站</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <WebsiteCard
            v-for="site in favoriteWebsites"
            :key="'fav-'+site.id"
            :site="site"
            :isFavorite="true"
            @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>

    <!-- 常用网站区域 -->
    <div>
      <h2 class="text-xl font-bold mb-4">常用网站</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <WebsiteCard
            v-for="site in nonFavoriteWebsites"
            :key="site.id"
            :site="site"
            :isFavorite="favoriteIds.has(site.id)"
            @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WebsiteCard from '@/component/WebsiteCard.vue'
import DataQuery from '@/assets/data/data_query.json'

const searchQuery = ref('')

interface Website {
  id: number
  name: string
  url: string
  icon?: string
  description: string
}

// 使用Set存储收藏的网站ID
const favoriteIds = ref<Set<number>>(new Set())
const websites = ref<Website[]>(DataQuery)

// 搜索过滤函数
function matchesSearch(site: Website) {
  if (!searchQuery.value) return true
  const query = searchQuery.value.toLowerCase()
  return (
    site.name.toLowerCase().includes(query) ||
    site.url.toLowerCase().includes(query) ||
    site.description.toLowerCase().includes(query)
  )
}

// 根据favoriteIds计算收藏和非收藏网站
const favoriteWebsites = computed(() =>
  websites.value.filter(site => favoriteIds.value.has(site.id) && matchesSearch(site))
)
const nonFavoriteWebsites = computed(() =>
  websites.value.filter(site => matchesSearch(site))
)

// 在组件挂载时从localStorage加载收藏状态
onMounted(() => {
  loadFavorites()
})

// 从localStorage加载收藏状态
function loadFavorites() {
  const saved = localStorage.getItem('dataQueryFavorites')
  if (saved) {
    const ids = JSON.parse(saved) as number[]
    favoriteIds.value = new Set(ids)
  }
}

// 切换收藏状态并保存到localStorage
function toggleFavorite(site: Website) {
  if (favoriteIds.value.has(site.id)) {
    favoriteIds.value.delete(site.id)
  } else {
    favoriteIds.value.add(site.id)
  }

  // 保存到localStorage
  saveFavorites()
}

// 保存收藏状态到localStorage
function saveFavorites() {
  const idsArray = Array.from(favoriteIds.value)
  localStorage.setItem('dataQueryFavorites', JSON.stringify(idsArray))
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
