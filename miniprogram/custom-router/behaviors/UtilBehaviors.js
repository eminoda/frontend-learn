
import { getActivePage } from '../utils/util'

module.exports = Behavior({
    methods: {
        getCurrentPage() {
            return getActivePage()
        },
        getPageNumber(page) {
            const pageParts = page.route.split('/')
            return Number(pageParts[pageParts.length - 2].replace('page', ''))
        },
        toNext() {
            // wx.navigateTo({
            //     url: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index`,
            // })
            getApp().$router.push({
                path: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index`,
            })
        },
        toBack() {
            wx.navigateBack({
                delta: 20,
            })
        },
        toWebview() {
            const wvPage = encodeURIComponent('http://localhost:8080/#/page1')
            wx.navigateTo({
                url: '/pages/webview/index' + '?wvPage=' + wvPage,
            })
        },
    }
})