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
            userInfo,
            order_no: options.id,
            crowd_pay_no: options.crowd_pay_no
        });
    },
    async onShow() {
        await this.loadOrder();
        let title = '';
        const { userInfo, openid } = this.data;
        userInfo.openid === openid ? title = '代付进度' : title = '土豪帮帮忙';
        wx.setNavigationBarTitle({ title });

    },
    async loadOrder() {
        const { order_no, crowd_pay_no } = this.data;
        let queryOption = { order_no };
        if (crowd_pay_no) {
            queryOption.crowd_pay_no = crowd_pay_no;
        }
        const { order } = await api.hei.fetchOrder(queryOption);

        // -----------------处理价格显示
        let info = {};

        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);

        let rest_amount = new Decimal(order.amount).minus(order.crowd.pay_amount).toNumber();    // 尾款
        let rest_amount_display = rest_amount.toFixed(2);

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
            rest_amount_display,
            progress,
            isLoading: false
        });
    }
});
