const app = getApp();

Component({
    properties: {
        scrollTop: {
            type: Number,
            optionalTypes: [String],
            value: 0,
        },
        activeTab: {
            type: Number,
            value: 0,
        },
        tabList: {
            type: Array,
            value: [],
        },
    },
    data: {
        menuRect: {},  // 导航栏右侧信息
        themeColor: {},
        tabsBottom: {},  // 暴露出去的视图高度
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
            let tabsHeight = 44 + 8 * 2;
            let tabsBottom = menuRect.bottom + tabsHeight;
            this.setData({ menuRect, themeColor, tabsBottom });
        },
        // 点击标签
        handleClickTab(e) {
            let { index } = e.detail;
            this.triggerEvent('click', { index });
        },
    },
});

