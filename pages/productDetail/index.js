// pages/shopDetail/index.js

import api from "../../utils/api/index";
const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		actions: [
			{
				type: "onBuy",
				text: "立即购买",
			},
		],
		isShowSkuModal: false,
	},

	async initPage() {
		console.log("000");
		const { id } = this.options;
		console.log(id, 'ii1')
		const data = await api.hei.getProductDetail({ id });
		console.log(data, "data");
		const { config, product, share_title, share_image } = data;
		this.config = config;
		this.product = product;
		wx.setNavigationBarTitle({
			title: data.page_title,
		});
		this.setData({ product, isShowSkuModal: true });
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log('===')
		console.log("091");
		this.initPage();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
