import api from 'utils/api';

// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		status: [
			{ name: '可使用', value: '4' },
			{ name: '已使用', value: '5' },
			{ name: '已过期', value: '3' },
		],
		selectedStatus: '4',
	},

	// 生命周期函数--监听页面加载


	async onLoad () {
		const data = await api.hei.fetchMyCouponList();
		this.setData(data);
		console.log(data);
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

	// 页面分享设置
	onShareAppMessage () {
		return {
			title: 'share title',
			path: '/pages/myCoupons/myCoupons'
		};
	}
});
