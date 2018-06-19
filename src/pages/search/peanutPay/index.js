import api from 'utils/api';
import { chooseAddress, showModal, getSetting, openSetting } from 'utils/wxp';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY } from 'constants/index';

const app = getApp();

Page({

    data: {
        orderNo: ''
    },

    onLoad: function (options) {
        console.log('peanutPay', options);
        this.setData({
            orderNo: options.order_no,
            order: app.globalData.extraData.items,
            totalPrice: app.globalData.extraData.totalPrice,
            postage: app.globalData.extraData.postage,
            address: app.globalData.extraData.address,
            buyer_message: app.globalData.extraData.buyer_message,
            couponPrice: app.globalData.extraData.couponPrice,
            orderPrice: app.globalData.extraData.orderPrice
        });
    },

    async onShow() {
        console.log(this.data);
        const { orderNo } = this.data;
        try {
            const { pay_sign } = await api.hei.peanutPayOrder({
                order_no: orderNo
            });

            const { isCancel } = await wxPay(pay_sign);
            wx.navigateBackMiniProgram({
                extraData: {
                    order_no: this.data.orderNo,
                    isCancel
                },
                success(res) {
                    console.log('成功');
                }
            });
        } catch (err) {
            console.log(err);
        }

    }
});
