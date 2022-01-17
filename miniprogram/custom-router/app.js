// app.js
import Router from './utils/router'
App({
  onLaunch() {
    // 监听全局页面跳转
    wx.onAppRoute((res) => {
      const { webviewId, openType, path } = res
      console.log('当前页面栈：', getCurrentPages().map(page => page.route))
      console.log('页面跳转行为：' + openType, '跳转连接：', path)
      if (openType == 'appLaunch') {
        this.$router = new Router()
      }
    })
  },
  globalData: {
    userInfo: null
  },
})
