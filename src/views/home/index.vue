<template>
  <div class="container mx-auto p-4">
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
          :isFavorite="false"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WebsiteCard from '@/component/WebsiteCard.vue'
import websitesData from '@/assets/data/websites.json'

interface Website {
  id: number
  name: string
  url: string
  icon: string
  description: string
}

// 使用Set存储收藏的网站ID
const favoriteIds = ref<Set<number>>(new Set())
const websites = ref<Website[]>(websitesData)

// 根据favoriteIds计算收藏和非收藏网站
const favoriteWebsites = computed(() =>
  websites.value.filter(site => favoriteIds.value.has(site.id))
)
const nonFavoriteWebsites = computed(() =>
  websites.value.filter(site => !favoriteIds.value.has(site.id))
)

// 在组件挂载时从localStorage加载收藏状态
onMounted(() => {
  loadFavorites()
})

// 从localStorage加载收藏状态
function loadFavorites() {
  const saved = localStorage.getItem('favoriteWebsites')
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
  localStorage.setItem('favoriteWebsites', JSON.stringify(idsArray))
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
