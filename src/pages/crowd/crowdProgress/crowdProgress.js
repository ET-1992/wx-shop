import api from 'utils/api';
import { Decimal } from 'decimal.js';
import { USER_KEY } from 'constants/index';
const app = getApp();

Page({
    data: {

    },

    onLoad(options) {
        console.log(options);
        const userInfo = wx.getStorageSync(USER_KEY);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        wx.setNavigationBarTitle({
            title: '代付进度'
        });
        this.setData({
            themeColor,
            isIphoneX,
            userInfo
        });
    },
    async onShow() {
        const { id } = this.options;
        await this.loadOrder(id);
    },
    async loadOrder(id) {
        const { order } = await api.hei.fetchOrder({ order_no: id });

        // -----------------处理价格显示
        let info = {};

        info.couponFeeDispaly = order.coupon_discount_fee; // 优惠券
        info.couponFee = Number(order.coupon_discount_fee);

        info.coinForPayDispaly = order.coins_fee; // 金币
        info.coinForPay = Number(order.coins_fee);

        info.postageDispaly = Number(order.postage).toFixed(2); // 运费
        info.postage = order.postage;

        info.totalPrice = Number(order.amount) - info.postage + info.couponFee + info.coinForPay;// 商品价格
        info.totalPriceDispaly = Number(info.totalPrice).toFixed(2);

        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);
        // -----------------End

        this.setData({
            items: order.items,
            crowd: order.crowd,
            crowd_users: order.crowd_users,
            avatarurl: order.avatarurl,
            openid: order.openid,
            info
        });
    }
});
