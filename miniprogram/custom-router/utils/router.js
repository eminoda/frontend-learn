
class Router {
  constructor(options = {}) {
    this.isVueRouter = options.isVueRouter == false ? false : true
    this.tabbars = options.tabbars || []
    this.MAX_LIMIT = 4
    this.routeStack = []
    this.middlePagePath = '/pages/middle/index'
    if (getCurrentPages().length > 0) {
      this.routeStack.push('/' + getCurrentPages()[0].route)
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
  back(delta) {
    debugger
    this.routeStack.splice(this.routeStack.length - delta, delta)
    if (this.routeStack >= this.MAX_LIMIT) {
      wx.navigateTo({
        url: this.routeStack[this.routeStack.length],
      })
    }
  }
  push(route) {
    const url = this.isVueRouter ? this._routeToWxUrl(route) : route
    if (this._isTabBar()) {
      // tabbar 页面重置页面栈，使用对应 api 跳转
      this.routeStack = [url]
      wx.switchTab({
        url,
      })
    } else {
      const len = this.routeStack.length;
      // 原生跳转
      if (len <= this.MAX_LIMIT - 2) {
        this.routeStack.push(url)
        wx.navigateTo({ url })
      }
      // 跳转中间页
      else if (len == this.MAX_LIMIT - 1) {
        const _url = this.middlePagePath + '?url=' + encodeURIComponent(url)
        this.routeStack.push(_url)
        wx.navigateTo({
          url: _url
        })
      } else if (len == this.MAX_LIMIT) {
        this.routeStack.push(url)
        wx.navigateTo({ url })
      } else {
        this.routeStack.push(url)
        // 最大页面栈、超出最大页面栈
        wx.redirectTo({ url })
      }
    }
  }
}

module.exports = Router