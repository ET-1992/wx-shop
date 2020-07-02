import api from 'utils/api';
import { wxPay } from 'utils/pageShare';
import { CONFIG } from 'constants/index';

const app = getApp();

Page({
    data: {
        orderNo: ''
    },

    async onLoad() {
        const {
            items,
            totalPrice,
            postage,
            address,
            buyer_message,
            couponPrice,
            orderPrice,
            order_no,
            coinPrice,
            from_page
        } = app.globalData.extraData;

        const config = wx.getStorageSync(CONFIG);

        let data = {};
        if (from_page !== 'member') {
            data = {
                order: items,
                totalPrice,
                postage,
                address,
                buyer_message,
                couponPrice,
                orderPrice,
                coinPrice,
                globalData: app.globalData,
            };
        }
        this.setData({
            config,
            orderNo: order_no,
            from_page,
            ...data
        }, this.peanutPay);
    },

    async peanutPay() {
        const { orderNo, from_page } = this.data;
        let method = 'peanutPayOrder';

        if (from_page === 'member') {
            method = 'membershipPeanutPay';
        }

        try {
            const { pay_sign } = await api.hei[method]({ order_no: orderNo });
            const { isCancel } = await wxPay(pay_sign, orderNo);
            wx.navigateBackMiniProgram({
                extraData: {
                    order_no: orderNo,
                    isCancel,
                    isPeanutPayOk: true
                }
            });
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },
});
