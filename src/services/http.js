import { API_BASE_URL } from '@/config/runtime'
import { tokenStore } from '@/services/auth/token'
import { refreshTokens } from '@/services/auth/refresh'

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

// 业务成功码约定：按实际后端可扩展
const SUCCESS_CODES = new Set([0, 200])

// 刷新 token 的单飞（多个 401 并发时只触发一次刷新，其他请求复用同一个 Promise）
let refreshingPromise = null

// 最底层的请求函数：不做自动刷新、不做重试
const requestRaw = (options) => {
  const {
    url,
    method = 'GET',
    data,
    header,
    timeout = 15000,
    dataType,
    responseType,
    // 登录/刷新等接口可以跳过 Authorization 注入
    skipAuth = false
  } = options || {}

  const token = tokenStore.getAccessToken()
  const finalHeader = {
    ...(header || {}),
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {})
  }

  const finalUrl = joinUrl(API_BASE_URL, url)

  return new Promise((resolve, reject) => {
    uni.request({
      url: finalUrl,
      method,
      data,
      header: finalHeader,
      timeout,
      dataType,
      responseType,
      success(res) {
        const { statusCode, data: body } = res || {}
        // HTTP 非 2xx：统一按 http 错误抛出
        if (statusCode < 200 || statusCode >= 300) {
          reject({ type: 'http', statusCode, message: 'HTTP Error', data: body })
          return
        }

        // 业务结构：{ code, message, data }
        if (body && typeof body === 'object' && 'code' in body) {
          const ok = SUCCESS_CODES.has(body.code)
          if (!ok) {
            reject({ type: 'business', code: body.code, message: body.message || 'Business Error', data: body })
            return
          }
          resolve(body.data !== undefined ? body.data : body)
          return
        }

        // 非标准结构：原样返回
        resolve(body)
      },
      fail(err) {
        reject(normalizeError(err))
      }
    })
  })
}

// 判断是否为鉴权失效：既支持 HTTP 401，也支持业务 code
const isAuthError = (error) => {
  if (!error || typeof error !== 'object') return false
  if (error.statusCode === 401) return true
  if (error.code === 401) return true
  if (error.code === 10001) return true
  return false
}

// 保证只会有一个刷新流程在跑（并发请求共享）
const ensureRefreshed = async () => {
  if (!refreshingPromise) {
    refreshingPromise = refreshTokens().finally(() => {
      refreshingPromise = null
    })
  }
  return refreshingPromise
}

// 企业级请求入口：遇到 401 自动刷新 token 并重试一次（避免无限循环）
export const request = async (options) => {
  try {
    return await requestRaw(options)
  } catch (error) {
    const refreshToken = tokenStore.getRefreshToken()
    const canRefresh = Boolean(refreshToken) && !options?.skipAuth && !options?._retried
    if (canRefresh && isAuthError(error)) {
      try {
        await ensureRefreshed()
        return await requestRaw({ ...(options || {}), _retried: true })
      } catch (_) {
        // 刷新失败：清理 token，交由上层跳转登录/提示
        tokenStore.clear()
        throw error
      }
    }
    throw error
  }
}

// 暴露组合对象：既可按函数调用，也可按 http.request 使用
export const http = {
  request,
  requestRaw
}
