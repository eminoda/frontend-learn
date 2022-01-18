// app.js
import Router from './utils/router'
App({
  onLaunch() {
    this.$router = new Router()
    // this.$router
  },
  globalData: {
    userInfo: null
  },
})
