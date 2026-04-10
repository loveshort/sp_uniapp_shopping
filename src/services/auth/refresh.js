import { API_BASE_URL } from '@/config/runtime'
import { tokenStore } from './token'

// 拼接 baseUrl 与 path，保证只有一个 /
const joinUrl = (baseUrl, path) => {
  if (!baseUrl) return path
  if (!path) return baseUrl
  if (baseUrl.endsWith('/') && path.startsWith('/')) return baseUrl + path.slice(1)
  if (!baseUrl.endsWith('/') && !path.startsWith('/')) return `${baseUrl}/${path}`
  return baseUrl + path
}

// 统一错误结构：保证 reject 里始终是对象
const normalizeError = (error) => {
  if (error && typeof error === 'object') return error
  return { message: String(error || 'Unknown error') }
}

// 使用 refresh token 向后端换取新的 token
// 默认请求地址：POST /auth/refresh
export const refreshTokens = () => {
  const refreshToken = tokenStore.getRefreshToken()
  if (!refreshToken) return Promise.reject({ message: 'Missing refresh token' })

  return new Promise((resolve, reject) => {
    uni.request({
      url: joinUrl(API_BASE_URL, '/auth/refresh'),
      method: 'POST',
      data: { refreshToken },
      timeout: 15000,
      success(res) {
        const { statusCode, data: body } = res || {}
        if (statusCode < 200 || statusCode >= 300) {
          reject({ statusCode, message: 'HTTP Error', data: body })
          return
        }

        // 兼容两种返回：{ code, data: { accessToken, refreshToken } } 或 { accessToken, refreshToken }
        const payload = body && typeof body === 'object' ? body : {}
        const ok = payload.code === 0 || payload.code === 200 || payload.accessToken
        if (!ok) {
          reject({ code: payload.code, message: payload.message || 'Refresh Failed', data: payload })
          return
        }

        const accessToken = payload.data?.accessToken || payload.accessToken || ''
        const nextRefreshToken = payload.data?.refreshToken || payload.refreshToken || ''

        // 刷新成功：落地 token（refreshToken 若后端不返回则沿用旧值）
        tokenStore.setTokens({ accessToken, refreshToken: nextRefreshToken || refreshToken })
        resolve({ accessToken, refreshToken: nextRefreshToken || refreshToken })
      },
      fail(err) {
        reject(normalizeError(err))
      }
    })
  })
}
