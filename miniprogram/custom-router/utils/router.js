
class Router {
  constructor(options = {}) {
    this.isVueRouter = options.isVueRouter == false ? false : true
    this.tabbars = options.tabbars || []
    this.MAX_LIMIT = 10
    this.routeStack = []
    this.middlePagePath = '/pages/middle/index'
    this.listen()
    this.canRoute = false
  }
  listen(fn) {
    // 监听全局页面跳转
    wx.onAppRoute((res) => {

      this.canRoute = true
      const { webviewId, openType, path } = res
      const activePath = this._getActivePath()
      // 程序初始加载时，设置首个页面
      if (openType == 'appLaunch') {
        if (getCurrentPages().length > 0) {
          this.routeStack = [activePath]
        }
      } else if (openType == 'navigateBack') {
        this.handleNavigateBack(path)
      }
      console.log('wx.' + openType, ': ', path)
      console.log('wx页面栈：', getCurrentPages().map(page => page.route))
      console.log('js页面栈：', this.routeStack)
      fn && fn(res)
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
  _getActivePath() {
    const pages = getCurrentPages()
    return '/' + pages.map(page => page.route)[pages.length - 1]
  }
  _removeRouterStack(removeNum) {
    this.routeStack.splice(this.routeStack.length - removeNum)
  }
  handleNavigateBack(path) {
    console.log(path, this._getActivePath(), this.routeStack.length)
    // 10 -> 中间页
    if (this.routeStack.length == this.MAX_LIMIT) {
      // 移除末页
      this._removeRouterStack(1)
      // 此时微信页面堆栈还有中间页，再次返回
      wx.navigateBack()
    } else if (this.routeStack.length > this.MAX_LIMIT) {
      // 移除末页
      this._removeRouterStack(1)
      // 获取重定向页面
      const redirectPath = this.routeStack[this.routeStack.length - 1]
      // 移除重定向页，push 中自动会加入
      this._removeRouterStack(1)
      this.push({ path: redirectPath })
    } else {
      this._removeRouterStack(1)
    }
  }
  /**
   * 中间页跳转，只有两种情况会调用：
   * 1. 超出页面栈的返回
   * 2. 第 MAX_LIMIT 页面的返回
   */
  // middleRedirect() {
  //   if (this.routeStack.length > this.MAX_LIMIT) {
  //     // 跳转最新页面
  //     this.routeStack.splice(this.routeStack.length - 1, 1)
  //     const redirectPath = this.routeStack[this.routeStack.length - 1]
  //     this.push({ path: redirectPath })
  //   } else {
  //     wx.navigateBack()
  //   }
  // }
  back(delta = 1) {
    if (!this.canRoute) {
      return false
    }
    delta = Math.abs(delta)
    // 至少保留1个页面栈
    delta = this.routeStack.length - delta <= 1 ? 1 : delta
    // 移除当前页面
    this.routeStack.splice(this.routeStack.length - delta, delta)
    const len = this.routeStack.length
    const url = this.routeStack[len - 1]
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
      this.routeStack = [url]
      wx.switchTab({ url })
      return
    }
    const len = this.routeStack.length;
    let actionFn = 'navigateTo'
    // 保存中间页
    if (len + 1 == this.MAX_LIMIT - 1) {
      this.routeStack.push(this.middlePagePath)
      url = this.middlePagePath + '?url=' + encodeURIComponent(url)
    } else {
      this.routeStack.push(url)
    }
    if (this.routeStack.length > this.MAX_LIMIT) {
      actionFn = 'redirectTo'
    }
    wx[actionFn]({ url })
  }
}

module.exports = Router