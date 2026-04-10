// 对 uni-app storage 的轻量封装：统一异常兜底、默认值策略
export const storage = {
  // 读取缓存，读取失败返回 defaultValue
  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key)
      return value === '' || value === undefined ? defaultValue : value
    } catch (_) {
      return defaultValue
    }
  },
  // 写入缓存
  set(key, value) {
    uni.setStorageSync(key, value)
  },
  // 删除单个 key
  remove(key) {
    uni.removeStorageSync(key)
  },
  // 清空所有缓存
  clear() {
    uni.clearStorageSync()
  }
}
