import api from 'utils/api';
import { checkNumber } from 'utils/util';
import { wxPay } from 'utils/pageShare';
import { CONFIG } from 'constants/index';

const app = getApp();

Page({
    data: {
        isFocus: true,
        size: 15,
        isDisablePay: true,
        amount: 0,
        isLoading: true
    },

    async onShow(parmas) {
        console.log(parmas);
        const { config } = await api.hei.config();
        const { themeColor } = app.globalData;
        this.setData({
            themeColor,
            authorizer: config.authorizer,
            globalData: app.globalData,
            isLoading: false
        });
    },
    clickInput() {
        this.setData({
            isFocus: true
        });
    },
    getLen(e) {
        let len = e.detail.value.length * this.data.size;
        this.setData({
            len
        });
    },
    saveValue(e) {
        const { value } = e.detail;
        console.log(value);
        if (value > 0 && checkNumber(value)) {
            this.setData({
                isDisablePay: false
            });
        } else {
            this.setData({
                isDisablePay: true
            });
        }
        this.setData({
            money: value
        });
    },
    async onPay(ev) {
        console.log(ev);
        const { formId } = ev.detail;
        const { vendor } = app.globalData;
        const { money, isDisablePay } = this.data;
        if (isDisablePay) {
            wx.showToast({ title: '请输入金额', icon: 'none', image: '', duration: 1000 });
            return;
        }
        try {
            const data = await api.hei.payDirect({
                formId,
                vendor,
                amount: Number(money) * 100
            });
            console.log(data);
            if (data.errcode === 0) {
                const { order_no, pay_sign } = data;
                if (pay_sign) {
                    console.log('自主支付');
                    const res = await wxPay(pay_sign, order_no);
                    if (res.errMsg === 'requestPayment:ok') {
                        console.log(res);
                        wx.redirectTo({
                            url: `/pages/directPayResult/directPayResult?order_no=${order_no}`
                        });
                    }
                }
            }
        } catch (e) {
            wx.showToast({ title: '支付失败，请重试', icon: 'none', image: '', duration: 1000 });
        }
    },
});
