import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  // uni-app 的 Vite 插件
  plugins: [uni()],
  resolve: {
    alias: {
      // 项目内统一使用 @ 指向 src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    // 生产构建丢弃 console/debugger，减少包体与运行时开销
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}))
