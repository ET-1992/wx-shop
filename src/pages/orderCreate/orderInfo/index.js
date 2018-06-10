Component({
	properties: {
		useCoin: {
			type: Number,
			value: 0,
			observer(newValue) {
				console.log(newValue, this);
				if (newValue) {
					this.setData({
						coinForPay: Number(newValue/100).toFixed(2)
					})
				}
			}
		},
		totalPrice: {
			type: null,
			value: 0
		},
		fee: {
			type: Object,
			value: {},
		},
		shouldGoinDisplay: {
			type: Boolean,
			value: false
		},
	},
	data: {
		coinForPay: '0.00'
	}
});