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
        }
    },
    methods: {
        onPay(e) {
            const { formId } = e.detail;
            this.triggerEvent('onpay', { formId }, { bubbles: true });
        }
    }
});