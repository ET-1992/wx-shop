import { CONFIG } from 'constants/index';
const app = getApp();
Component({
    properties: {
        coupon: {
            type: Object,
            value: {},
        },
        status: {
            type: String,
            value: '',
        },
        canChoice: {
            type: Boolean,
            value: false,
        },
        isSelected: {
            type: Boolean,
            value: false,
        },
        tplStyle: {
            type: String,
            value: 'default',
        },
        config: {
            type: Object,
            value: {},
        },
        color: {
            type: String,
            value: 'gold'
        }
    },
    data: {
        globalData: app.globalData,
        config: null
    },
    lifetimes: {
        attached() {
            const config = wx.getStorageSync(CONFIG);
            this.setData({
                config
            });
        }
    }
});
