// 运行环境：由 Vite 注入（development / production 等）
export const MODE = import.meta.env.MODE

// 环境标记：开发/生产
export const IS_DEV = import.meta.env.DEV
export const IS_PROD = import.meta.env.PROD

// 接口域名：通过 .env.* 配置 VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
