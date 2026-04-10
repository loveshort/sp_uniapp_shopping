import { createI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { storage } from '@/utils/storage'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 多语言资源集合
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 语言归一化：把各种 zh/zh-hans 之类的输入映射到项目支持的语言
const normalizeLocale = (locale) => {
  if (locale === 'zh-CN' || locale === 'en-US') return locale
  if (typeof locale === 'string' && locale.toLowerCase().startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

// i18n 实例：开启全局注入后，可直接在组件里使用 this.$t
export const i18n = createI18n({
  legacy: true,
  globalInjection: true,
  locale: normalizeLocale(storage.get(STORAGE_KEYS.LOCALE, 'zh-CN')),
  fallbackLocale: 'zh-CN',
  messages
})
