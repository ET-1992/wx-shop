import { CONFIG, COLOR } from 'constants/index';
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
        }
    },
    data: {
        globalData: app.globalData,
        config: null
    },
    lifetimes: {
        attached() {
            const config = wx.getStorageSync(CONFIG);
            const color = wx.getStorageSync(COLOR);
            this.setData({
                config,
                color
            });
        }
    }
});
