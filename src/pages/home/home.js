import { PRODUCT_LIST_STYLE, CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { showToast, showModal } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import getToken from 'utils/getToken';
import login from 'utils/login';

// 获取应用实例
const app = getApp(); // eslint-disable-line no-undef

Page({
	data: {
		pageName: 'home',

		products: [],
		product_categories: [],
		home_sliders: {
			home_sliders: [],
		},
		miaoshas: [],
		groupons: [],
		featured_products: [],
		coupons: [],

		productListStyle: PRODUCT_LIST_STYLE[1],
		categoryListStyle: CATEGORY_LIST_STYLE[2],
		isRefresh: false,
		isLoading: false,

		post_type_title: '',
		taxonomy_title: '',
		share_title: '',
		page_title: ''
	},

	async loadHome() {
		this.setData({ isLoading: true });
		const data = await api.hei.fetchHome();
		if (data.page_title) {
			wx.setNavigationBarTitle({
				title: data.page_title
			});
		}

		// delete data.coupons;

		// const { shop_setting: { category_style, product_list_style } } = data;
		// data.productListStyle = PRODUCT_LIST_STYLE[+product_list_style - 1];
		// data.categoryListStyle = CATEGORY_LIST_STYLE[+category_style - 1];

		this.setData({
			isLoading: false,
			...data
		});
	},

	async onLoad() {
		this.loadHome();
	},

	async onReceiveCoupon(id, index) {
		const { coupons } = this.data;

		if (!coupons[index].stock_qty) { return; }

		try {
			const data = await api.hei.receiveCoupon({
				coupon_id: id
			});
			const { errcode } = data;
			if (!errcode) {
				showToast({ title: '领取成功' });
				const updateData = {};
				const key = `coupons[${index}].status`;
				updateData[key] = 4;
				this.setData(updateData);
			}
		}
		catch (err) {
			await showModal({
				title: '温馨提示',
				content: err.errMsg,
				showCancel: false
			});
		}
	},

	async onCouponClick(ev) {
		const { id, index, status, title } = ev.currentTarget.dataset;
		const token = getToken();

		if (!token) {
			const { confirm } = await showModal({
				title: '未登录',
				content: '请先登录，再领取优惠券',
				confirmText: '登录'
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
				url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`
			});
		}
	},

	async onPullDownRefresh() {
		await this.loadHome();
		wx.stopPullDownRefresh();
	},

	onShareAppMessage: onDefaultShareAppMessage,
	// onShareAppMessage:function(res) {
	// 	console.log(this.data)
	// 	return {
	// 		title: this.data.share_title,
	// 		imageUrl:this.data.share_image,
	// 		path:'/pages/home/home'
	// 	}
	// }
});

