Component({
	properties: {
		finalPay: {
            type: null,
            value: 0.00
        }
    },
    methods: {
        onPay(e) {
            const { formId } = e.detail;
            this.triggerEvent('onpay', {formId}, { bubbles: true })
        }
    }
});