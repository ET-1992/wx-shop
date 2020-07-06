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