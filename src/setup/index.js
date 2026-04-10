import * as api from '@/services/api'
import { i18n } from '@/i18n'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { pinia } from '@/store'

// 应用初始化入口：集中挂载插件与全局能力，避免散落在业务页面
export const setupApp = (app) => {
  // 状态管理
  app.use(pinia)
  // 国际化（提供 this.$t）
  app.use(i18n)
  // 全局 API（提供 this.$api）
  app.config.globalProperties.$api = api
  // 全局日志（提供 this.$log）
  app.config.globalProperties.$log = logger
  // 全局缓存（提供 this.$storage）
  app.config.globalProperties.$storage = storage
}
