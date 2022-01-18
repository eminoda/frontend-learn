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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    // 跳转下一页面
    if (!this.data.isBack) {
      this.setData({ isBack: true })
      getApp().$router.push({ path: this.data.nextPath })
    } else {
      // 返回上一页面
      this.setData({ nextPath: '' })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})