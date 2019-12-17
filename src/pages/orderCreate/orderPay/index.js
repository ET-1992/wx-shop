const app = getApp();

Component({
    properties: {
        finalPay: {
            type: null,
            value: 0.00
        },
        isIphoneX: {
            type: Boolean,
            value: false
        },
        isPeanutPay: {
            type: Boolean,
            value: false
        },
        isDisablePay: {
            type: Boolean,
            value: true
        },
        crowd: {
            type: Boolean,
            value: false
        },
        themeColor: {
            type: Object,
            value: {}
        },
        freeShippingAmount: {
            type: Number,
            value: 0
        }
    },
    data: {
        globalData: app.globalData
    },
    methods: {
        onPay(e) {
            const { formId, target } = e.detail;
            const { crowdtype } = target.dataset;
            const { crowd, finalPay } = this.data;
            if (crowd) {
                finalPay > 0
                    ?
                    this.triggerEvent('onpay', { formId, crowd, crowdtype }, { bubbles: true })
                    :
                    wx.showModal({
                        title: '温馨提示',
                        content: '订单金额为0元',
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#3CC51F',
                    });
            } else {
                this.triggerEvent('onpay', { formId }, { bubbles: true });
            }
        }
    }
});