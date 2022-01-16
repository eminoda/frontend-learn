
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
            wx.navigateTo({
                url: `/pages/multiple-pages/page${this.data.pageNumber + 1}/index`,
            })
        }
    }
})