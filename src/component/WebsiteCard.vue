<template>
  <div
    @click.stop="visitSite"
    class="group relative rounded-xl p-4 border shadow-sm transition-all duration-300 ease-out
           bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm
           border-gray-200/80 hover:border-gray-300/80 hover:shadow-lg
           hover:backdrop-blur-none cursor-pointer
           transform hover:-translate-y-1 hover:scale-[1.02]"
    :class="[isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2']"
  >
    <!-- Favorite badge -->
    <button
      @click.stop="$emit('toggle-favorite', site)"
      class="absolute top-3 right-3 text-gray-300 transition-all duration-200 hover:scale-110"
      :class="{ 'text-yellow-400': isFavorite }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>

    <!-- Card content -->
    <div class="flex items-start space-x-4">
      <!-- Site icon -->
      <div class="flex-shrink-0">
        <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-gray-200/60 bg-white/80 shadow-sm">
          <img
            :src="getFaviconUrl(site.url)"
            :alt="site.name"
            class="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
            @error="handleImageError"
          >
        </div>
      </div>

      <!-- Site info -->
      <div class="min-w-0 flex-1 space-y-1">
        <h3 class="truncate text-sm font-semibold text-gray-900">
          {{ site.name }}
        </h3>
        <a
          :href="site.url"
          target="_blank"
          class="block truncate text-xs text-blue-500 hover:underline"
        >
          {{ formatUrl(site.url) }}
        </a>
        <div class="h-6">
          <p v-if="site.description" class="line-clamp-2 text-xs leading-snug text-gray-500/90">
            {{ site.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action button -->
    <div class="mt-3 flex justify-end">
      <button
        @click.stop="visitSite"
        class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:shadow-inner"
      >
        访问网站
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
    icon?: string
  },
  isFavorite?: boolean
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
