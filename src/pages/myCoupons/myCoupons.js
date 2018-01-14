import api from 'utils/api';



// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		status: [
			{ name: '可使用', value: 'available' },
			{ name: '已使用', value: 'used' },
			{ name: '已过期', value: 'expired' },
		],
		selectedStatus: 'available',
		coupons: {
			'available': [],
			'used': [],
			'expired': [],
		}
	},

	// 生命周期函数--监听页面加载


	async onLoad () {
		try {
			const { available = [], unavailable = [] } = await api.hei.fetchMyCouponList();

			available.forEach((coupon) => {
				coupon.description = coupon.description.replace(/\n/g, '<br/>');
			});

			const { used, expired } = unavailable.reduce((coupons, coupon) => {
				const { used, expired } = coupons;
				coupon.description = coupon.description.replace(/\n/g, '<br/>');
				if (+coupon.status === 3) {
					expired.push(coupon);
				}
				else {
					used.push(coupon);
				}
				return coupons;
			}, { used: [], expired: [] });

			this.setData({
				'coupons.available': available,
				'coupons.used': used,
				'coupons.expired': expired,
				// 'coupons.used': available,
				// 'coupons.expired': available,
			});
			console.log(this.data);
		}
		catch (err) {
			console.log(err);
		}

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
