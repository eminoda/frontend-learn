import UtilBehaviors from '../../../behaviors/UtilBehaviors'

Page({
    behaviors: [UtilBehaviors],
    data: {
        pageNumber: ''
    },
    onLoad: function (options) {
        const page = this.getCurrentPage()
        const pageNumber = this.getPageNumber(page)
        this.setData({
            pageNumber
        })
    }
})
