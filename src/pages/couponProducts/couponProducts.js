// 获取全局应用程序实例对象
// const app = getApp()

// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		title: 'couponProducts'
	},

	// 生命周期函数--监听页面加载
	onLoad () {
		// TODO: onLoad
	},

	// 页面分享设置
	onShareAppMessage () {
		return {
			title: 'share title',
			path: '/pages/couponProducts/couponProducts'
		};
	}
});
