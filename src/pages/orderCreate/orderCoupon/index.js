const app = getApp();

Component({
	properties: {
		coupons: {
			type: Object,
			value: {}
		},
		shouldGoinDisplay: {
			type: Boolean,
			value: false
		},
		coins: {
			type: Number,
			value: 0
		},
		maxUseCoin: {
			type: Number,
			value: 0
		},
		goldInputBeginValue: {
			type: Number,
			value: 0
		},
		fee: {
			type: Object,
			value: {}
		}
	},
	methods: {
		couponChange() {
			const { coupons } = this.data;
			wx.setStorageSync('orderCoupon', coupons);
			app.event.on('toOrderCoupon', this.eventSetCoupon, this);
			wx.navigateTo({
				url: '/pages/orderCoupons/orderCoupons',
			});
		},
		bindInput(e) {
			let { value } = e.detail;
			value = Number(value);
			const { maxUseCoin, coins } = this.data;
			if (value > maxUseCoin || value > coins) {
				value = Math.min(maxUseCoin, coins);
			}
			this.triggerEvent('setusecoin', value, { bubbles: true });
			return value;
		},
		eventSetCoupon(data) {
			console.log(data, 'data');
		}
	},
	detached() {
		app.event.off('toOrderCoupon', this);
		console.log(this.data, 'sas');
	}
});