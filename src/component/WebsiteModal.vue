<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ isEdit ? '编辑网站' : '添加网站' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">网站名称</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">网站URL</label>
            <input
              v-model="form.url"
              type="url"
              required
              class="w-full px-3 py-2 border rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">图标URL (可选)</label>
            <input
              v-model="form.icon"
              type="url"
              class="w-full px-3 py-2 border rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">描述 (可选)</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-md"
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.isFavorite"
              type="checkbox"
              id="favorite"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="favorite" class="ml-2 block text-sm text-gray-700">收藏</label>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  site: {
    id: number
    name: string
    url: string
    icon: string
    description: string
    isFavorite: boolean
  }
  isEdit: boolean
}>()

const emit = defineEmits(['save', 'close'])

const form = ref({
  id: props.site.id,
  name: props.site.name,
  url: props.site.url,
  icon: props.site.icon,
  description: props.site.description,
  isFavorite: props.site.isFavorite
})

watch(() => props.site, (newSite) => {
  form.value = {
    id: newSite.id,
    name: newSite.name,
    url: newSite.url,
    icon: newSite.icon,
    description: newSite.description,
    isFavorite: newSite.isFavorite
  }
}, { deep: true })

function handleSubmit() {
  emit('save', form.value)
}
</script>
