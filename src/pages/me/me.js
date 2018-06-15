import api from 'utils/api';
import { getUserInfo, getAgainUserForInvalid } from 'utils/util';

const itemActions = {
	address: wx.chooseAddress,
	coupon: () => console.log('coupon'),
	notice: () => console.log('notice'),
};

// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({

	// 页面的初始数据
	data: {
		// active: 0,
		user: {},
		orderCount: {
			1: 0,
			2: 0,
			3: 0,
			10: 0,
		},
	},

	async loadOrderCount() {
		const data = await api.hei.fetchOrderCount({
			status: '1,2,3,10',
		});
		this.setData({ orderCount: data.counts });
	},

	onLoad() {
		// user用户客服对接
		const { themeColor } = app.globalData;
		this.setData({ themeColor });
	},
	
	async onShow() {
		const user = getUserInfo();
		this.setData({ user });
		this.loadOrderCount();
	},

	onLogin() {
		wx.navigateTo({ url: '/pages/login/login' });
	},
	// free() {
	// 	this.setData({
	// 		active: 1,
	// 	});
	// },
	// close() {
	// 	this.setData({
	// 		active: 0,
	// 	});
	// },
	onItemClick(ev) {
		const { name } = ev.currentTarget.dataset;
		const action = itemActions[name];
		action();
	},

	async bindGetUserInfo(e) {
		const { encryptedData, iv } = e.detail;
		const user = await getAgainUserForInvalid({ encryptedData, iv });
		this.setData({
			user
		})
	}
});
