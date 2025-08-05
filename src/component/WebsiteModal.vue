<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">{{ isEdit ? '编辑网站' : '添加网站' }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">网站名称</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入网站名称"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">网站URL</label>
            <input
              v-model="form.url"
              type="url"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            >
          </div>



          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">描述 (可选)</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="网站描述"
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
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

// 为File System Access API添加类型声明
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<any>;
    showSaveFilePicker?: (options?: any) => Promise<any>;
  }
}

const props = defineProps<{
  site: {
    id: number
    name: string
    url: string
    description: string
    isFavorite: boolean
    icon?: string
  }
  isEdit: boolean
}>()

const emit = defineEmits(['save', 'close'])

const form = ref({
  id: props.site.id,
  name: props.site.name,
  url: props.site.url,
  description: props.site.description,
  isFavorite: props.site.isFavorite,
  icon: props.site.icon || `https://www.google.com/s2/favicons?domain=${props.site.url}`
})

watch(() => form.value.url, (newUrl) => {
  if (!props.site.icon) {
    form.value.icon = `https://www.google.com/s2/favicons?domain=${newUrl}`
  }
})

watch(() => props.site, (newSite) => {
  form.value = {
    id: newSite.id,
    name: newSite.name,
    url: newSite.url,
    description: newSite.description,
    isFavorite: newSite.isFavorite,
    icon: newSite.icon || `https://www.google.com/s2/favicons?domain=${newSite.url}`
  }
}, { deep: true })

async function downloadFavicon(url: string): Promise<string> {
  try {
    const domain = new URL(url).hostname
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

    // 检查File System Access API是否可用
    if (!window.showDirectoryPicker || !window.showSaveFilePicker) {
      console.log('File System Access API不可用，使用在线图标')
      return faviconUrl
    }

    const response = await fetch(faviconUrl)
    const blob = await response.blob()

    try {
      // 创建favicons目录如果不存在
      try {
        await window.showDirectoryPicker()
      } catch {
        // 目录已存在或用户取消了选择
      }

      const fileName = `${domain}-${Date.now()}.png`
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'PNG Images',
          accept: {'image/png': ['.png']}
        }]
      })

      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()

      return URL.createObjectURL(blob)
    } catch (error) {
      console.log('文件系统操作失败，使用在线图标', error)
      return faviconUrl
    }
  } catch (error) {
    console.error('下载图标失败:', error)
    return `https://www.google.com/s2/favicons?domain=${url}`
  }
}

async function handleSubmit() {
  try {
    let iconUrl;

    // 确保URL格式正确
    if (!form.value.url.startsWith('http://') && !form.value.url.startsWith('https://')) {
      form.value.url = 'https://' + form.value.url;
    }

    // 如果File System Access API不可用，直接使用Google Favicon服务
    if (!window.showDirectoryPicker || !window.showSaveFilePicker) {
      const domain = new URL(form.value.url).hostname;
      iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } else {
      // 尝试下载并保存图标
      iconUrl = await downloadFavicon(form.value.url);
    }

    // 提交数据
    const submitData = {
      ...form.value,
      icon: iconUrl
    };
    emit('save', submitData);
  } catch (error) {
    console.error('保存网站失败:', error);
    // 使用默认图标提交
    const domain = new URL(form.value.url).hostname;
    const submitData = {
      ...form.value,
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    };
    emit('save', submitData);
  }
}
</script>
