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
			'available': [],
			'unavailable': [],
		}
	},

	// 生命周期函数--监听页面加载


	async onLoad () {
		const { currentOrderCoupons } = app.globalData;
		this.setData({ coupons: currentOrderCoupons });

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
});
