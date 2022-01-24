import UtilBehaviors from '../../behaviors/UtilBehaviors'

Component({
  behaviors: [UtilBehaviors],
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    pageNumber: '',
    page: '',
    delta: 1,
    navigatorIndex: wx.getStorageSync('isCustomRouter'),
    navigators: [
      { label: '微信原生跳转', value: 0 },
      { label: '自定义跳转', value: 1 }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changePicker(event) {
      const navigatorIndex = this.data.navigators[event.detail.value].value
      wx.setStorageSync('isCustomRouter', navigatorIndex == 1)
      this.setData({ navigatorIndex })
    },
    toNext() {
      if (wx.getStorageSync('isCustomRouter')) {
        const $router = getApp().$router
        $router.push({ path: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index` })
      } else {
        wx.navigateTo({
          url: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index`,
        })
      }
    },
    handleInput(event) {
      this.setData({ delta: event.detail.value })
    },
    toBack() {
      const delta = Number((this.data.delta || 0))
      if (wx.getStorageSync('isCustomRouter')) {
        const $router = getApp().$router
        $router.back(delta)
      } else {
        wx.navigateBack({
          delta: delta,
        })
      }
    },
  },

  lifetimes: {
    // 页面进入完页面栈
    ready() {
      const $router = getApp().$router
      const page = this.getCurrentPage()
      this.setData({
        wxRouterStack: $router.wxRouterStack,
        routerStack: $router.routerStack,
        page,
        pageNumber: this.getPageNumber(page)
      })
    }
  },
  pageLifetimes: {
  }
})
