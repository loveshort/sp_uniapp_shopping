import { request } from '@/services/http'

// 示例接口：用于验证网络层、鉴权、错误处理是否正常
export const demoApi = {
  // ping：GET /ping
  ping() {
    return request({ url: '/ping', method: 'GET' })
  }
}
