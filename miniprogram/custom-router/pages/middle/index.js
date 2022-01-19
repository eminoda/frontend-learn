// pages/middle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBack: false,
    nextPath: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保存跳转页
    console.log('onLoad')
    if (options.url) {
      this.setData({
        nextPath: decodeURIComponent(options.url)
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 跳转下一页面
    if (!this.data.isBack) {
      this.setData({ isBack: true })
      getApp().$router.push({ path: this.data.nextPath })
    } else {
      // 返回上一页面
      this.setData({ nextPath: '' })
      getApp().$router.handleMiddleRedirect(this.data.isBack)
    }
  },
})