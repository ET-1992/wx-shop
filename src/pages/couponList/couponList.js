// pages/couponList/couponList.js
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import getToken from 'utils/getToken';
import { showToast, showModal } from 'utils/wxp';
import login from 'utils/login';
import { USER_KEY } from 'constants/index';

const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		coupons: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		this.loadCoupon();
	},
	async loadCoupon() {
		const { vendor } = app.globalData;
		const data = await api.hei.couponList({
			vendor,
		});
		this.setData({
			...data,
		});
	},
	async onReceiveCoupon(id, index) {
		const { coupons } = this.data;

		try {
			const data = await api.hei.receiveCoupon({
				coupon_id: id,
			});
			console.log(data);
			const { errcode } = data;

			if (!errcode) {
				showToast({ title: '领取成功' });
				const updateData = {};
				const key = `coupons[${index}].status`;
				updateData[key] = 4;
				console.log(updateData);
				this.setData(updateData);
			}
		}
		catch (err) {
			await showModal({
				title: '温馨提示',
				content: err.errMsg,
				showCancel: false,
			});
		}
	},
	async onCouponClick(ev) {
		console.log(ev);
		const { id, index, status, title } = ev.currentTarget.dataset;
		const token = getToken();

		if (!token) {
			const { confirm } = await showModal({
				title: '未登录',
				content: '请先登录，再领取优惠券',
				confirmText: '登录',
			});
			if (confirm) {
				await login();
				await this.loadHome();
			}
			return;
		}

		if (+status === 2) {
			await this.onReceiveCoupon(id, index);
		}
		else {
			wx.navigateTo({
				url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
			});
		}
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
