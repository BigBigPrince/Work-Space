<template>
  <div class="relative rounded-lg p-3 transition-all duration-300 ease-out group
              bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md
              hover:bg-white hover:border-gray-200
              transform hover:-translate-y-0.5"
              :class="{
                'opacity-0 translate-y-2': !isMounted,
                'opacity-100 translate-y-0': isMounted
              }">
    <!-- Favorite badge -->
    <div class="absolute top-3 right-3">
      <button
        @click.stop="$emit('toggle-favorite', site)"
        class="text-gray-300 hover:scale-110 transition-all duration-200"
        :class="{ 'text-yellow-400': site.isFavorite }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    </div>

    <!-- Card content -->
    <div class="flex items-start space-x-2">
      <div class="relative flex-shrink-0">
        <div class="w-8 h-8 rounded-md bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
          <img
            :src="getFaviconUrl(site.url)"
            :alt="site.name"
            class="w-5 h-5 object-contain"
            @error="handleImageError"
          >
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium text-gray-900 truncate">
          {{ site.name }}
        </h3>
        <a
          :href="site.url"
          target="_blank"
          class="text-blue-600 text-xs hover:underline block truncate mt-0.5"
        >
          {{ formatUrl(site.url) }}
        </a>
        <div class="h-6 mt-0.5">
          <p v-if="site.description" class="text-gray-500 text-xs line-clamp-2">
            {{ site.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex justify-end mt-2">
      <button
        @click.stop="visitSite"
        class="px-2 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
      >
        访问
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const props = defineProps<{
  site: {
    id: number
    name: string
    url: string
    description: string
    isFavorite: boolean
    icon?: string
  }
}>()

const defaultIcon = ref('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzk5OSI+PHBhdGggZD0iTTEyIDJDNi40ODcgMiAyIDYuNDg3IDIgMTJzNC40ODcgMTAgMTAgMTAgMTAtNC40ODcgMTAtMTBTMTcuNTEzIDIgMTIgMnptMCAyYzQuNDMwIDAgOCAzLjU3IDggOHMtMy41NyA4LTggOC04LTMuNTctOC04IDMuNTctOCA4LTh6Ii8+PC9zdmc+')

function getFaviconUrl(url: string) {
  // 优先使用本地保存的图标
  if (props.site.icon) {
    return props.site.icon
  }
  // 如果本地没有，使用默认图标
  return defaultIcon.value
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = defaultIcon.value
}

function formatUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    return hostname.replace('www.', '')
  } catch {
    return url
  }
}

function visitSite() {
  window.open(props.site.url, '_blank')
}
</script>
