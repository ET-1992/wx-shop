import { USER_KEY } from 'constants/index';
import api from 'utils/api';

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
		const { themeColor } = app.globalData;
		this.setData({ themeColor });
		const user = wx.getStorageSync(USER_KEY);
		this.setData({ user });
	},

	async onShow() {
		const { openid } = this.data.user;
		if (openid) {
			this.loadOrderCount();
		}
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

	reLoad() {
		const user = wx.getStorageSync(USER_KEY);
		this.setData({ user });
		if (user.openid) {
			this.loadOrderCount();
		}
	}
});
