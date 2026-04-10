import { request } from '@/services/http'
import { tokenStore } from '@/services/auth/token'

// 鉴权相关接口：按实际后端可扩展（注册、获取用户信息、改密等）
export const authApi = {
  // 登录：POST /auth/login
  // 由于未登录状态不应携带 Authorization，这里使用 skipAuth
  async login(payload) {
    const data = await request({ url: '/auth/login', method: 'POST', data: payload, skipAuth: true })
    const accessToken = data?.accessToken || ''
    const refreshToken = data?.refreshToken || ''
    if (accessToken || refreshToken) tokenStore.setTokens({ accessToken, refreshToken })
    return data
  },
  // 本地退出：仅清理 token（如需通知后端可在此处追加接口调用）
  logout() {
    tokenStore.clear()
  }
}
