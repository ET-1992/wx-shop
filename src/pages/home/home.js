import { PRODUCT_LIST_STYLE, CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { showToast, showModal } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import getToken from 'utils/getToken';
import login from 'utils/login';
import autoRedirect from 'utils/autoRedirect';

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
		hasCoupons: false,

		productListStyle: PRODUCT_LIST_STYLE[1],
		categoryListStyle: CATEGORY_LIST_STYLE[2],
		isRefresh: false,
		isLoading: false,

		post_type_title: '',
		taxonomy_title: '',
		share_title: '',
		page_title: '',
		type: '',
	},

	onBannerClick(ev) {
		const { path } = ev.currentTarget.dataset;
		const type = 'navigate';
		if ((path, type)) {
			autoRedirect({ url: path, type: type });
		}
	},
	async submitFormId(e) {
		console.log('fork');
		const data = await api.hei.submitFormId({
			form_id: e.detail.formId,
		});
		console.log(data);
	},
	async loadHome() {
		this.setData({ isLoading: true });

		const data = await api.hei.fetchHome();
		if (data.current_user) {
			this.setData({
				newUser: data.current_user.new_user,
			});
		}
		else {
			this.setData({
				newUser: 1,
			});
		}

		data.coupons.forEach((item) => {
			if (item.target_user_type == '2') {
				this.setData({
					hasCoupons: true,
				});
			}
		});

		if (data.page_title) {
			wx.setNavigationBarTitle({
				title: data.page_title,
			});
		}
		let width;
		if (data.coupons && data.coupons.length) {
			width = data.coupons.length * 250 + 20 * data.coupons.length;
		}

		// delete data.coupons;

		// const { shop_setting: { category_style, product_list_style } } = data;
		// data.productListStyle = PRODUCT_LIST_STYLE[+product_list_style - 1];
		// data.categoryListStyle = CATEGORY_LIST_STYLE[+category_style - 1];
		// const newUser = data.current_user ? data.current_user.new_user : null;
		this.setData({
			isLoading: false,
			conWidth: width || '',

			// newUser: data.current_user.new_user,
			...data,
		});
	},

	async onLoad() {
		console.log(1);
		const { themeColor } = app.globalData;
		this.setData({ themeColor });
		console.log(2);
		this.loadHome();
	},
	async onReceiveCoupon(id, index) {
		const { coupons } = this.data;

		if (!coupons[index].stock_qty) {
			return;
		}

		try {
			const data = await api.hei.receiveCoupon({
				coupon_id: id,
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
				showCancel: false,
			});
		}
	},
	async receiveCouponAll(e) {
		if (!this.data.current_user) {
			this.needAuth();
		}
		const { id } = e.currentTarget.dataset;
		let result = [];
		id.map(({ id, target_user_type }, index) => {
			if (target_user_type == '2') result.push(id);
		});
		const allResult = result.join(',');
		const data = await api.hei.receiveCouponAll({
			coupon_ids: allResult,
		});
		showToast({ title: '领取成功' });
		this.setData({
			newUser: 2,
		});
	},
	async onCouponClick(ev) {
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

	closeCoupon() {
		this.setData({
			newUser: 2,
		});
	},
	async onPullDownRefresh() {
		await this.loadHome();
		wx.stopPullDownRefresh();
	},

	async onReachBottom() {
		const { next_cursor } = this.data;
		if (!next_cursor) {
			return;
		}
		this.loadProducts();
	},
	async needAuth(e) {
		const user = await login();
		console.log(user);
		this.setData({
			user: user,
		});
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
