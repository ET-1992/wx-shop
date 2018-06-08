Component({
	properties: {
		coupons: {
			type: Object,
			value: {},
		}
	},
	methods: {
		couponChange() {
			const { coupons } = this.data;
			wx.setStorageSync('orderCoupon', coupons);
			wx.navigateTo({
				url: '/pages/orderCoupons/orderCoupons',
			});
		}
	}
});