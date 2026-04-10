import { STORAGE_KEYS } from '@/constants/storage-keys'
import { storage } from '@/utils/storage'

// Token 读写统一入口：方便后续切换为更安全的存储方式或加入加密/过期策略
export const tokenStore = {
  // 获取 access token（用于请求头 Authorization）
  getAccessToken() {
    return storage.get(STORAGE_KEYS.TOKEN, '')
  },
  // 设置 access token
  setAccessToken(token) {
    storage.set(STORAGE_KEYS.TOKEN, token || '')
  },
  // 获取 refresh token（用于刷新 access token）
  getRefreshToken() {
    return storage.get(STORAGE_KEYS.REFRESH_TOKEN, '')
  },
  // 设置 refresh token
  setRefreshToken(token) {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, token || '')
  },
  // 同时更新一组 token（只更新传入的字段）
  setTokens({ accessToken, refreshToken }) {
    if (accessToken !== undefined) this.setAccessToken(accessToken)
    if (refreshToken !== undefined) this.setRefreshToken(refreshToken)
  },
  // 清理所有 token（登出/刷新失败/鉴权失效场景）
  clear() {
    this.setAccessToken('')
    this.setRefreshToken('')
  }
}
