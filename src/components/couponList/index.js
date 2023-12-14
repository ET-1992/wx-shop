import { CONFIG, PLATFFORM_ENV } from 'constants/index';
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
        color: '',
        PLATFFORM_ENV,
    },
    lifetimes: {
        attached() {
            const { fromMemberShipPage } = this.data;
            let config = wx.getStorageSync(CONFIG);
            const cdn_host = wx.getStorageSync('cdn_host');
            let color = app.globalData.couponBackgroundColor;
            if(cdn_host){
                config = {
                    cdn_host,
                    style_type:'newCoupon'
                };
                // color = 'orange'
            }
            const { style_type = 'default' } = config;
            let tplStyle = color ? 'coupon' : style_type;
            if(cdn_host){
                color = 'orange'
            }
            console.log('tplStyle',tplStyle)
            if (fromMemberShipPage) {
                tplStyle = 'vip_tpl';
            }
            this.setData({
                config,
                color,
                tplStyle
            });
        }
    },
    methods: {
        onGiveCoupon() {
            console.log('阻止事件冒泡');
        }
    },
});
