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
          @edit="openEditModal"
        />
      </div>
    </div>

    <!-- 所有网站区域 -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">常用网站</h2>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          添加网站
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <WebsiteCard
          v-for="site in nonFavoriteWebsites"
          :key="site.id"
          :site="site"
          @toggle-favorite="toggleFavorite"
          @edit="openEditModal"
        />
      </div>
    </div>

    <!-- 添加/编辑模态框 -->
    <WebsiteModal
      v-if="showModal"
      :site="currentSite as Website"
      :is-edit="isEditMode"
      @save="saveWebsite"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import WebsiteCard from '@/component/WebsiteCard.vue'
import WebsiteModal from '@/component/WebsiteModal.vue'

interface Website {
  id: number
  name: string
  url: string
  icon: string
  description: string
  isFavorite: boolean
}

const websites = ref<Website[]>([])
const favoriteWebsites = computed(() => websites.value.filter(site => site.isFavorite))
const nonFavoriteWebsites = computed(() => websites.value.filter(site => !site.isFavorite))
const showModal = ref(false)
const currentSite = ref<Website | null>(null)
const isEditMode = ref(false)

onMounted(() => {
  loadWebsites()
  // 更新现有网站的图标
  updateWebsiteIcons()
})

function updateWebsiteIcons() {
  websites.value.forEach(site => {
    if (!site.icon && site.url) {
      site.icon = getFaviconUrl(site.url)
    }
  })
  saveToLocalStorage()
}

function loadWebsites() {
  const saved = localStorage.getItem('websites')
  if (saved) {
    websites.value = JSON.parse(saved)
  }
}

function openAddModal() {
  currentSite.value = {
    id: Date.now(),
    name: '',
    url: '',
    icon: '',
    description: '',
    isFavorite: false
  }
  isEditMode.value = false
  showModal.value = true
}

function openEditModal(site: Website) {
  currentSite.value = {...site}
  isEditMode.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } catch {
    return ''
  }
}

function saveWebsite(site: Website) {
  // 自动设置favicon
  if (!site.icon && site.url) {
    site.icon = getFaviconUrl(site.url)
  }

  if (isEditMode.value) {
    const index = websites.value.findIndex(w => w.id === site.id)
    websites.value.splice(index, 1, site)
  } else {
    websites.value.push(site)
  }
  saveToLocalStorage()
  closeModal()
}

function toggleFavorite(site: Website) {
  site.isFavorite = !site.isFavorite
  saveToLocalStorage()
}

function saveToLocalStorage() {
  localStorage.setItem('websites', JSON.stringify(websites.value))
}
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
