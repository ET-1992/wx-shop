import { go, colorRgb } from 'utils/util';
const app = getApp();

Component({
    properties: {
        // 是否显示搜索框
        showSearch: {
            type: Boolean,
            value: true
        },
        // 是否显示当前门店
        showStore: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        capsulePosition: {},
        currentStore: {},
    },
    lifetimes: {
        attached() {
            const { themeColor, themeColor: { backgroundColor }} = app.globalData;
            const capsulePosition = wx.getMenuButtonBoundingClientRect() || {};
            let showBackgroundColor = true;
            this.setData({
                capsulePosition,
                showBackgroundColor,
                themeColor,
                backgroundColor: colorRgb(backgroundColor),
            });
        },
    },
    methods: {
        go,
        // 更新门店信息
        updatestore() {
            let { currentStore } = app.globalData;
            this.setData({ currentStore, });
            this.triggerEvent('updatestore');
        },
    },
});

