import { USER_KEY } from 'constants/index';
import api from 'utils/api';
import login from 'utils/login';

const itemActions = {
	address: wx.chooseAddress,
	coupon: () => console.log('coupon'),
	notice: () => console.log('notice'),
};

// 获取全局应用程序实例对象
// const app = getApp()

// 创建页面实例对象
Page({

	// 页面的初始数据
	data: {
		user: {},
		active: 0,
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
		const user = wx.getStorageSync(USER_KEY);
		this.setData({ user });
	},

	async onShow() {
		const { openid } = this.data.user;
		if (openid) {
			this.loadOrderCount();
		}
	},

	async onLogin() {
		const { user } = await login();
		this.setData({ user });
		console.log(user);
		if (user.openid) {
			this.loadOrderCount();
		}
	},
	free() {
		this.setData({
			active: 1,
		});
	},
	close() {
		this.setData({
			active: 0,
		});
	},
	onItemClick(ev) {
		const { name } = ev.currentTarget.dataset;
		const action = itemActions[name];
		action();
	},
});
