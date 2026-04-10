import { defineStore } from 'pinia'
import { tokenStore } from '@/services/auth/token'

// 鉴权状态：用于全局读取登录态/持久化 token
export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 初始化时从本地缓存恢复，保证刷新后状态不丢
    accessToken: tokenStore.getAccessToken(),
    refreshToken: tokenStore.getRefreshToken()
  }),
  getters: {
    // 是否已登录（仅根据 accessToken 判断）
    isAuthed(state) {
      return Boolean(state.accessToken)
    }
  },
  actions: {
    // 更新 token 并同步写入本地缓存
    setTokens({ accessToken, refreshToken }) {
      if (accessToken !== undefined) this.accessToken = accessToken || ''
      if (refreshToken !== undefined) this.refreshToken = refreshToken || ''
      tokenStore.setTokens({ accessToken: this.accessToken, refreshToken: this.refreshToken })
    },
    // 退出登录：清理状态与缓存
    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      tokenStore.clear()
    }
  }
})
