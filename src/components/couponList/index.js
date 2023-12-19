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
        },
        config: {
          type: Object,
          value: {},
      },
    },
    data: {
        globalData: app.globalData,
        color: 'orange',
        PLATFFORM_ENV,
    },
    lifetimes: {
        attached() {
            const { fromMemberShipPage, config } = this.data;
            // let config = wx.getStorageSync(CONFIG);
            // const cdn_host = wx.getStorageSync('cdn_host');
            let color = app.globalData.couponBackgroundColor;
            const { style_type = 'default' } = config;

            // if (fromMemberShipPage) {
            //     tplStyle = 'vip_tpl';
            // }
            this.setData({
                config,
                color,
                tplStyle: config.style_type
            });
        }
    },
    methods: {
        onGiveCoupon() {
            console.log('阻止事件冒泡');
        }
    },
});
