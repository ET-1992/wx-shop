import api from 'utils/api';
import { wxPay } from 'utils/pageShare';

const app = getApp();

Page({
    data: {
        orderNo: '',
    },

    onLoad: function () {
        const { items, totalPrice, postage, address, buyer_message, couponPrice, orderPrice, order_no, coinPrice } = app.globalData.extraData;
        this.setData({
            orderNo: order_no,
            order: items,
            totalPrice,
            postage,
            address,
            buyer_message,
            couponPrice,
            orderPrice,
            coinPrice
        });
    },

    async onShow() {
        console.log(this.data);
        const { orderNo } = this.data;
        try {
            const { pay_sign } = await api.hei.peanutPayOrder({
                order_no: orderNo,
            });

            const { isCancel } = await wxPay(pay_sign);

            wx.navigateBackMiniProgram({
                extraData: {
                    order_no: this.data.orderNo,
                    isCancel,
                    isPeanutPayOk: true
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    },
});
