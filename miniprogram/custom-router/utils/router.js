
class Router {
  constructor(options = {}) {
    this.isVueRouter = options.isVueRouter == false ? false : true
    this.tabbars = options.tabbars || []
    this.MAX_LIMIT = 10
    this.routerStack = []
    this.wxRouterStack = []
    this.middlePagePath = '/pages/middle/index'
    this.onWxRouterChange()
    this.canRoute = false
  }
  onWxRouterChange(fn) {
    // 监听全局页面跳转
    wx.onAppRoute((res) => {
      if (fn) {
        fn && fn(res)
        return;
      }
      this.canRoute = true
      this.wxRouterStack = getCurrentPages().map(page => '/' + page.route)
      const { webviewId, openType, path } = res
      const activePath = this._getActivePath()
      // 程序初始加载时，设置首个页面
      if (openType == 'appLaunch') {
        if (getCurrentPages().length > 0) {
          this.routerStack = [activePath]
        }
      } else if (openType == 'navigateBack') {
        if (activePath !== this.middlePagePath) {
          this.routerStack.pop()
        }
      }
      console.log('wx.' + openType, ': ', path)
      console.log('wx页面栈:', this.wxRouterStack)
      console.log('js页面栈:', this.routerStack)
    })
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
  /**
   * 通过返回进入中间页后：
   * 1. 页面栈 >= 微信页面栈限制时，当前微信页面栈为：MAX_LIMIT-1，空出一位置，使用 navigateTo
   * 2. 反之，自动再返回一级
   */
  handleMiddleRedirect(isBack) {
    const activePath = this._getActivePath()
    if (activePath != this.middlePagePath) {
      throw new Error('当前路径不是中转页')
    }
    if (!isBack) {
      throw new Error('中间页非返回状态')
    }
    // 移除末页（返回起始页）
    this.routerStack.pop()
    if (this.routerStack.length >= this.MAX_LIMIT) {
      wx.navigateTo({
        url: this.routerStack[this.routerStack.length - 1]
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  }
  /**
   * 中间页跳转，只有两种情况会调用：
   * 1. 超出页面栈的返回
   * 2. 第 MAX_LIMIT 页面的返回
   */
  back(delta = 1) {
    if (!this.canRoute) {
      return false
    }
    delta = Math.abs(delta)
    // 至少保留1个页面栈
    delta = this.routerStack.length - delta <= 1 ? 1 : delta
    // 移除当前页面
    this.routerStack.splice(this.routerStack.length - delta, delta)
    const len = this.routerStack.length
    const url = this.routerStack[len - 1]
    if (this._isTabBar(url)) {
      wx.switchTab({ url })
    } else if (url == this.middlePagePath) {
      // 跳转至中间页，自动再回退一级
      this.back()
    } else if (len > this.MAX_LIMIT) {
      wx.redirectTo({ url })
    } else {
      wx.navigateTo({ url })
    }
  }
  push(route) {
    if (!this.canRoute) {
      return false
    }
    let url = this.isVueRouter ? this._routeToWxUrl(route) : route
    // tabbar 页面重置页面栈，使用对应 api 跳转
    if (this._isTabBar(url)) {
      this.routerStack = [url]
      wx.switchTab({ url })
      return
    }
    const len = this.routerStack.length;
    let actionFn = 'navigateTo'
    // 保存中间页
    if (len + 1 == this.MAX_LIMIT - 1) {
      this.routerStack.push(this.middlePagePath)
      url = this.middlePagePath + '?url=' + encodeURIComponent(url)
    } else {
      this.routerStack.push(url)
    }
    if (this.routerStack.length > this.MAX_LIMIT) {
      actionFn = 'redirectTo'
    }
    wx[actionFn]({ url })
  }
}

module.exports = Router