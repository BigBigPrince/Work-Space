import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 添加服务器配置，允许局域网访问
  server: {
    host: '0.0.0.0',  // 监听所有网络接口，允许局域网访问
    port: 5173,       // 可选，指定端口号，默认是5173
    strictPort: false // 端口被占用时自动尝试其他端口
  }
})
