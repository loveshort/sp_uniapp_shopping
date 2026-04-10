// 本地缓存 Key 统一管理，避免散落字符串导致的维护成本
export const STORAGE_KEYS = {
  // 业务访问令牌（通常为 access token / jwt）
  TOKEN: 'APP_TOKEN',
  // 刷新令牌（用于 access token 过期后的刷新）
  REFRESH_TOKEN: 'APP_REFRESH_TOKEN',
  // 国际化语言
  LOCALE: 'APP_LOCALE'
}
