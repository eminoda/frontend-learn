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
    page: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toNext() {
      wx.navigateTo({
        url: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index`,
      })
    },
    toNextCustom() {
      const $router = getApp().$router
      $router.push({ path: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index` })
    }
  },

  lifetimes: {
    // 页面进入完页面栈
    ready() {
      const $router = getApp().$router
      const page = this.getCurrentPage()
      this.setData({
        wxRouterStack: $router.wxRouterStack,
        page,
        pageNumber: this.getPageNumber(page)
      })
    }
  },
  pageLifetimes: {
  }
})
