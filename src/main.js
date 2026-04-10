import { createSSRApp } from 'vue'
import App from './App.vue'
import { setupApp } from './setup'

// uni-app 入口：创建应用实例，并在这里完成全局能力初始化
export function createApp() {
	const app = createSSRApp(App)
	// 统一初始化：Pinia、i18n、全局 API/日志/缓存等
	setupApp(app)
	return {
		app,
	}
}
