const app = getApp();

Component({
    properties: {
        scrollTop: {
            type: Number,
            optionalTypes: [String],
            value: 0,
        }
    },
    data: {
        menuRect: {},  // 导航栏右侧信息
        themeColor: {},
    },
    lifetimes: {
        attached() {
            this.getPageData();
        },
    },
    methods: {
        // 页面初始化
        getPageData() {
            let { themeColor } = app.globalData;
            let menuRect = wx.getMenuButtonBoundingClientRect();
            this.setData({ menuRect, themeColor });
        },
        // 点击标签
        handleClickTab(e) {
            let { name } = e.detail;
            this.triggerEvent('click', { name });
        },
    },
});

