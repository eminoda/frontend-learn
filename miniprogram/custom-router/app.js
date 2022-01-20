// app.js
import Router from './utils/router'
App({
  onLaunch() {
    this.$router = new Router({
      tabbars: ['/pages/multiple-pages/page1/index']
    })
    // this.$router
  },
  globalData: {
    userInfo: null
  },
})
