import api from 'utils/api';
import { checkNumber } from 'utils/util';
import { wxPay } from 'utils/pageShare';
import { Decimal } from 'decimal.js';

const app = getApp();

Page({
    data: {
        isDisablePay: true,
        amount: 0
    },

    async onShow() {
        const { config } = await api.hei.config();
        const { themeColor } = app.globalData;
        this.setData({
            themeColor,
            authorizer: config.authorizer,
            globalData: app.globalData,
            config
        });
    },
    saveValue(ev) {
        const { value } = ev.detail;
        this.setData({
            money: value,
            isDisablePay: !(value > 0 && checkNumber(value))
        });
    },
    async onPay() {
        const { vendor } = app.globalData;
        const { money, isDisablePay, config } = this.data;
        if (isDisablePay) {
            wx.showToast({ title: '请输入金额', icon: 'none' });
            return;
        }
        let queryData = {};

        if (!config.cashier_enable) {
            queryData.pay = '';
        }

        try {
            const amount = Math.floor(new Decimal(money).mul(100));
            const { order_no, pay_sign } = await api.hei.payDirect({ vendor, amount }, { ...queryData });

            if (config.cashier_enable) {
                wx.navigateTo({ url: `/pages/payCashier/payCashier?order_no=${order_no}&from_page=directPay` });
                return;
            }

            if (pay_sign) {
                await wxPay(pay_sign, order_no);
                wx.redirectTo({ url: `/pages/directPayResult/directPayResult?order_no=${order_no}` });
            }
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },
});
