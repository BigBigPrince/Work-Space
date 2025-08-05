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
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WebsiteCard from '@/component/WebsiteCard.vue'
import websitesData from '@/assets/data/websites.json'

interface Website {
  id: number
  name: string
  url: string
  icon: string
  description: string
  isFavorite: boolean
}

const websites = ref<Website[]>(websitesData)
const favoriteWebsites = computed(() => websites.value.filter(site => site.isFavorite))
const nonFavoriteWebsites = computed(() => websites.value.filter(site => !site.isFavorite))

function toggleFavorite(site: Website) {
  site.isFavorite = !site.isFavorite
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
