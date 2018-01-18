import api from 'utils/api';

const app = getApp();



// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		status: [
			{ name: '可使用优惠券', value: 'available' },
			{ name: '不可用优惠券', value: 'unavailable' },
		],
		selectedStatus: 'available',
		coupons: {
			available: [],
			unavailable: [],
			recommend: {},
			selected: {}
		},
	},

	// 生命周期函数--监听页面加载


	async onLoad () {
		console.log(app.globalData.currentOrder);
		const { coupons } = app.globalData.currentOrder;
		const { available, unavailable } = coupons;

		// available.forEach((coupon) => {
		// 	coupon.description = coupon.description.replace(/\n/g, '<br/>');
		// });
		// unavailable.forEach((coupon) => {
		// 	coupon.description = coupon.description.replace(/\n/g, '<br/>');
		// });

		this.setData({ coupons });
		// const data = await api.hei.fetchMyCouponList();
		// this.setData({ coupons: data })
	},

	onStautsItemClick(ev) {
		const { value } = ev.currentTarget.dataset;
		if (value === this.data.selectedStatus) { return; }
		this.setData({
			selectedStatus: value,
			// activeIndex: this.getIndex(value),
			isRefresh: true,
		});
	},

	onCouponClick(ev) {
		const { coupon, index } = ev.currentTarget.dataset;
		const { selected } = this.data.coupons;
		this.setData({
			'coupons.selected': selected.id === coupon.id ? {} : coupon
	 	});
	},

	onComfirm() {
		const { coupons } = this.data;
		app.globalData.currentOrder.coupons = coupons;
		console.log(app.globalData.currentOrder);
		wx.navigateBack({
			delta: 1
		});
	},
});
