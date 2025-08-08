<template>
  <div
      @click.stop="handleCardClick($event)"
      @mousedown="isPressed = true"
      @mouseup="isPressed = false"
      @mouseleave="isPressed = false"
      class="group relative rounded-xl p-5 border transition-all duration-300 ease-out
         bg-white
         border-gray-200/80 hover:border-blue-200
         cursor-pointer
         transform hover:-translate-y-1 hover:scale-[1.02]
         will-change-transform backface-visibility-hidden"
      :class="[
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        isPressed ? 'scale-[0.98] shadow-sm bg-blue-50/30' : 'shadow-md hover:shadow-xl'
      ]"
  >
    <!-- Ripple effect -->
    <div ref="rippleContainer" class="absolute inset-0 overflow-hidden rounded-xl">
      <span
        v-for="(ripple, index) in ripples"
        :key="index"
        class="absolute rounded-full bg-blue-100/60 animate-ripple"
        :style="{
          left: `${ripple.x}px`,
          top: `${ripple.y}px`,
          width: `${ripple.size}px`,
          height: `${ripple.size}px`,
          transform: 'translate(-50%, -50%) scale(0)',
        }"
      ></span>
    </div>

    <!-- Favorite badge -->
    <button
      @click.stop="toggleFavorite"
      class="absolute top-3 right-3 z-10 transition-all duration-300 ease-bounce"
      :class="{
        'text-yellow-400 scale-110': isFavorite,
        'text-gray-300 hover:text-gray-400': !isFavorite
      }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform duration-300 hover:scale-125" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>

    <!-- Card content -->
    <div class="flex items-start space-x-4">
      <!-- Site icon -->
      <div class="flex-shrink-0">
        <div class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-blue-100">
          <img
            :src="getFaviconUrl(site.url)"
            :alt="site.name"
            class="h-8 w-8 object-contain transition-all duration-500 group-hover:scale-110"
            @error="handleImageError"
          >
        </div>
      </div>

      <!-- Site info -->
      <div class="min-w-0 flex-1 space-y-1.5">
        <h3 class="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
          {{ site.name }}
        </h3>
        <a
          :href="site.url"
          target="_blank"
          @click.stop
          class="block truncate text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200"
        >
          {{ formatUrl(site.url) }}
        </a>
        <div class="h-6">
          <p v-if="site.description" class="line-clamp-2 text-xs leading-snug text-gray-500/90 group-hover:text-gray-600/90 transition-colors duration-300">
            {{ site.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Action button -->
    <div class="mt-4 flex justify-end">
      <button
        @click.stop="visitSite"
        class="rounded-lg px-4 py-1.5 text-xs font-medium transition-all duration-300
               bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm
               hover:from-blue-600 hover:to-blue-700 hover:shadow
               active:scale-95 active:shadow-inner"
      >
        <span class="flex items-center">
          <span>访问网站</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

// 卡片挂载状态
const isMounted = ref(false)
onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 50) // 添加小延迟使动画更平滑
})

// 卡片点击状态
const isPressed = ref(false)

// 涟漪效果
interface Ripple {
  x: number
  y: number
  size: number
}

const ripples = reactive<Ripple[]>([])
const rippleContainer = ref<HTMLElement | null>(null)

// 创建涟漪效果
function createRipple(event: MouseEvent) {
  if (!rippleContainer.value) return

  const container = rippleContainer.value
  const rect = container.getBoundingClientRect()

  // 计算点击位置相对于容器的坐标
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 计算涟漪大小 (容器对角线长度的2倍)
  const size = Math.max(container.offsetWidth, container.offsetHeight) * 2

  // 添加新的涟漪
  const ripple = { x, y, size }
  ripples.push(ripple)

  // 动画结束后移除涟漪
  setTimeout(() => {
    const index = ripples.indexOf(ripple)
    if (index !== -1) {
      ripples.splice(index, 1)
    }
  }, 1000)
}

// 监听卡片点击事件
function handleCardClick(event: MouseEvent) {
  createRipple(event)
  visitSite()
}

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

const emit = defineEmits(['toggle-favorite'])

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

function toggleFavorite(event: MouseEvent) {
  event.preventDefault()
  emit('toggle-favorite', props.site)

  // 添加星星动画效果
  const button = event.currentTarget as HTMLElement
  button.classList.add('animate-bounce')
  setTimeout(() => {
    button.classList.remove('animate-bounce')
  }, 500)
}
</script>

<style scoped>
@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.animate-bounce {
  animation: bounce 0.5s ease;
}

.ease-bounce {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
