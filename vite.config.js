import { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression' c

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      threshold: 1024000 // 对大于 1mb 的文件进行压缩
    })
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
})
