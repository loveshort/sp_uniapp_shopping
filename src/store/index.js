import { createPinia } from 'pinia'

// 全局状态管理容器（在 setupApp 里 app.use(pinia) 注入）
export const pinia = createPinia()
