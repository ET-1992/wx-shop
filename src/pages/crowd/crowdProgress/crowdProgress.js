import api from 'utils/api';
import { Decimal } from 'decimal.js';
import { USER_KEY } from 'constants/index';
const app = getApp();

Page({
    data: {
        isLoading: true,
    },

    onLoad(options) {
        console.log(options);
        const userInfo = wx.getStorageSync(USER_KEY);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        this.setData({
            themeColor,
            isIphoneX,
            userInfo
        });
    },
    async onShow() {
        const { id } = this.options;
        await this.loadOrder(id);
        let title;
        this.data.userInfo.openid === this.data.openid ? title = '代付进度' : title = '土豪帮帮忙';
        wx.setNavigationBarTitle({
            title: title
        });

    },
    async loadOrder(id) {
        const { order } = await api.hei.fetchOrder({ order_no: id });

        // -----------------处理价格显示
        let info = {};

        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);

        let rest_amount = new Decimal(order.amount).minus(order.crowd.pay_amount).toNumber().toFixed(2);    // 剩余价格

        let progress = new Decimal(order.crowd.pay_amount).div(order.amount).mul(100).toNumber();    // 进度条
        // -----------------End

        this.setData({
            items: order.items,
            crowd: order.crowd,
            crowd_users: order.crowd_users,
            avatarurl: order.avatarurl,
            openid: order.openid,
            finalPay: info.finalPay,
            finalPayDispaly: info.finalPayDispaly,
            rest_amount,
            progress,
            isLoading: false
        });
    }
});
