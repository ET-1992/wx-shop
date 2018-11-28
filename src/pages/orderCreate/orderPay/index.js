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
        }
    },
    data: {
        globalData: app.globalData
    },
    methods: {
        onPay(e) {
            const { formId } = e.detail;
            this.triggerEvent('onpay', { formId }, { bubbles: true });
        }
    }
});