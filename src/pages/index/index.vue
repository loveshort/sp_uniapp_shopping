<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <!-- 网络层示例：调用 demoApi.ping() -->
    <button type="primary" size="mini" @click="ping">Ping</button>
    <!-- 状态管理/鉴权示例：写入 mock token -->
    <button type="default" size="mini" @click="mockLogin">Mock Login</button>
    <!-- 鉴权示例：清理 token -->
    <button type="warn" size="mini" @click="logout">Logout</button>
  </view>
</template>

<script>
import { useAuthStore } from '@/store/auth'
export default {
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {
    // i18n 示例：通过 this.$t 获取多语言文案
    this.title = this.$t('home.hello')
    // 日志示例：开发环境输出调试信息
    this.$log.debug('query', this.$root?.$mp?.query || {})
  },
  methods: {
    async ping() {
      try {
        await this.$api.demoApi.ping()
        uni.showToast({ title: 'OK', icon: 'success' })
      } catch (e) {
        this.$log.error(e)
        uni.showToast({ title: '请求失败', icon: 'none' })
      }
    },
    mockLogin() {
      // Pinia 示例：更新鉴权 store，并同步写入本地缓存（tokenStore）
      const auth = useAuthStore()
      auth.setTokens({ accessToken: 'mock_access_token', refreshToken: 'mock_refresh_token' })
      uni.showToast({ title: '已写入 token', icon: 'none' })
    },
    logout() {
      // 清理鉴权状态与缓存
      useAuthStore().logout()
      uni.showToast({ title: '已退出', icon: 'none' })
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
