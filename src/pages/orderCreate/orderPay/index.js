Component({
	properties: {
		finalPay: {
            type: null,
            value: 0.00
        },
        phoneModel: {
            type: String,
            value: ''
        }
    },
    methods: {
        onPay(e) {
            const { formId } = e.detail;
            this.triggerEvent('onpay', {formId}, { bubbles: true })
        }
    }
});