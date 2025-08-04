<template>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-center mb-2">
      <img
        v-if="site.icon"
        :src="site.icon"
        :alt="site.name"
        class="w-8 h-8 mr-2"
      >
      <div class="flex-1">
        <h3 class="font-medium">{{ site.name }}</h3>
        <a
          :href="site.url"
          target="_blank"
          class="text-blue-500 text-sm hover:underline"
        >
          {{ site.url }}
        </a>
      </div>
      <button
        @click.stop="$emit('toggle-favorite', site)"
        class="text-yellow-400 hover:text-yellow-500"
        :class="{ 'text-yellow-500': site.isFavorite }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    </div>
    <p class="text-gray-600 text-sm mb-3">{{ site.description }}</p>
    <div class="flex justify-end space-x-2">
      <button
        @click.stop="$emit('edit', site)"
        class="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
      >
        编辑
      </button>
      <button
        @click.stop="visitSite"
        class="px-2 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
      >
        访问
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  site: {
    id: number
    name: string
    url: string
    icon: string
    description: string
    isFavorite: boolean
  }
}>()

function visitSite() {
  window.open(props.site.url, '_blank')
}
</script>
