import { CONFIG } from 'constants/index';
const app = getApp();
Component({
    properties: {
        title: {
            type: String,
            value: 'addressTwo Component',
        },
        address: {
            type: Object,
            value: {},
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        }
    },
    attached() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            themeColor,
            selfAddress: config && config.self_address
        });
    },
});