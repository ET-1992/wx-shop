import { CONFIG } from 'constants/index';

Component({
    properties: {
        total: {
            type: String,
            value: ''
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
        // 是否只显示搜索框
        onlySearchBox: {
            type: Boolean,
            value: true,
        }
    },
    data: {
        config: {},
        currentStore: {},
    },
    lifetimes: {
        attached: function() {
            let config = wx.getStorageSync(CONFIG);
            this.setData({ config });
        },
    },
});