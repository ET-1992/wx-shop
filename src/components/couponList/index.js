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
        fromMemberShipPage: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        globalData: app.globalData,
        config: null,
        color: ''
    },
    lifetimes: {
        attached() {
            const { fromMemberShipPage } = this.data;
            const config = wx.getStorageSync(CONFIG);
            const { style_type = 'default' } = config;
            const color = app.globalData.couponBackgroundColor;
            let tplStyle = color ? 'coupon' : style_type;
            if (fromMemberShipPage) {
                tplStyle = 'vip_tpl';
            }
            this.setData({
                config,
                color,
                tplStyle
            });
        }
    }
});
