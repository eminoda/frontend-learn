
class Router {
  constructor(options = {}) {
    this.isVueRouter = options.isVueRouter == false ? false : true
    this.tabbars = options.tabbars || []
    this.MAX_LIMIT = options.MAX_LIMIT || 10
    this.routerStack = []
    this.wxRouterStack = []
    this.middlePagePath = '/pages/middle/index'
    this.onWxRouterChange()
    this.debug = options.debug == false ? false : true
  }
  onWxRouterChange(fn) {
    // 监听全局页面跳转
    wx.onAppRoute((res) => {
      if (fn) {
        fn && fn(res)
        return;
      }
      this.wxRouterStack = getCurrentPages().map(page => '/' + page.route)
      const { webviewId, openType, path } = res
      const activePath = this._getActivePath()
      // 程序初始加载时，设置首个页面
      if (openType == 'appLaunch' || openType == 'switchTab') {
        this.routerStack = ['/' + path]
      } else if (openType == 'navigateTo') {
      } else if (openType == 'navigateBack') {
        // 通过微信原生返回箭头的操作，手动更新页面栈
        this._updateRouterStack(activePath)
      }
      if (this.debug) {
        console.log('wx.' + openType, ': ', path)
        console.log('wx页面栈:', this.wxRouterStack)
        console.log('js页面栈:', this.routerStack)
      }
    })
  }
  _updateRouterStack(path) {
    // back调用和微信元素返回处在不同区域，需要统一化处理
    for (let i = this.routerStack.length - 1; i >= 0; i--) {
      if (this.routerStack[i] == path) {
        break;
      }
      this.routerStack.pop()

    }
  }
  handleMiddleRedirect(isBack) {
    const activePath = this._getActivePath()
    if (activePath != this.middlePagePath) {
      throw new Error('当前路径不是中转页')
    }
    if (!isBack) {
      throw new Error('中间页非返回状态')
    }
    // 当前页面栈 > 微信页面栈限制时
    if (this.routerStack.length > this.MAX_LIMIT) {
      this.routerStack.pop()
      // 当前微信页面栈为：MAX_LIMIT-1，空出一位置，使用 navigateTo
      wx.navigateTo({
        url: this.routerStack[this.routerStack.length - 1]
      })
    } else {
      this.back(1)
    }
  }
  back(delta = 1) {
    if (this.routerStack.length <= 1) {
      return;
    }
    delta = Math.abs(delta)
    // 至少保留1个页面栈
    delta = this.routerStack.length - delta < 1 ? 1 : delta

    // 获取返回地址
    const backUrl = this.routerStack[this.routerStack.length - delta - 1]

    if (this._isTabBar(backUrl)) {
      wx.switchTab({ url: backUrl })
    } else if (this.routerStack.length - delta >= this.MAX_LIMIT) {
      // backUrl 在最大页面栈之后
      this._updateRouterStack(backUrl)
      wx.redirectTo({
        url: backUrl,
      })
    } else {
      const overMaxCount = this.routerStack.length - this.MAX_LIMIT
      this._updateRouterStack(backUrl)
      if (overMaxCount > 0) {
        delta = delta - overMaxCount
        wx.navigateBack({
          delta,
        })
      } else {
        wx.navigateBack({ delta })
      }
    }
  }
  push(route) {
    let url = this.isVueRouter ? this._routeToWxUrl(route) : route
    if (this._isTabBar(url)) {
      this.routerStack = [url]
      wx.switchTab({ url })
    } else {
      // 跳转中间页
      if (this.routerStack.length == this.MAX_LIMIT - 2) {
        this.routerStack.push(this.middlePagePath)
        // 定义中转页参数
        url = this.middlePagePath + '?url=' + encodeURIComponent(url)
      } else {
        this.routerStack.push(url)
      }
      const actionFn = this.routerStack.length > this.MAX_LIMIT ? 'redirectTo' : 'navigateTo'
      wx[actionFn]({ url })
    }
  }
  /**
   * @description vue 路由转微信 url
   * @example { path:'/xxx', query:{a:1} } => '/xxx?a=1'
   * @param {*} route.path
   * @param {*} route.query
   */
  _routeToWxUrl(route) {
    if (typeof (route) == 'string') {
      return route
    } else {
      if (route.query) {
        const _search = Object.keys(route.query).reduce((acc, cur) => {
          acc = '&' + cur + '=' + route.query[cur]
          return acc
        }, '').substr(1)
        return route.path + (_search ? '?' + _search : '')
      }
      return route.path
    }
  }
  /**
   * @description tabbar 页面自动清空堆栈
   * @param {*} url 
   */
  _isTabBar(url) {
    for (const _url of this.tabbars) {
      if (url && url.indexOf(_url) !== -1) {
        return true
      }
    }
    return false
  }
  // 获取当前页面
  _getActivePath() {
    const pages = getCurrentPages()
    return '/' + pages.map(page => page.route)[pages.length - 1]
  }
}

module.exports = Router