import { IS_DEV } from '@/config/runtime'

// 预留格式化入口：后续可统一加前缀、traceId、时间戳等
const format = (args) => args

// 统一日志出口：开发环境输出 debug/info/warn，生产环境只保留 error
export const logger = {
  // 调试日志（仅开发）
  debug(...args) {
    if (IS_DEV) console.debug(...format(args))
  },
  // 信息日志（仅开发）
  info(...args) {
    if (IS_DEV) console.info(...format(args))
  },
  // 警告日志（仅开发）
  warn(...args) {
    if (IS_DEV) console.warn(...format(args))
  },
  // 错误日志（开发/生产都输出）
  error(...args) {
    console.error(...format(args))
  }
}
