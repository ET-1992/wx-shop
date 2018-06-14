import { PRODUCT_LIST_STYLE, CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { showToast, showModal, getSystemInfo } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import getToken from 'utils/getToken';
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
		hasNewUserCoupons: false,

		productListStyle: PRODUCT_LIST_STYLE[1],
		categoryListStyle: CATEGORY_LIST_STYLE[2],
		isRefresh: false,
		isLoading: false,

		post_type_title: '',
		taxonomy_title: '',
		share_title: '',
		page_title: '',
		type: '',

		hasMask: false
	},

	onBannerClick(ev) {
		const { path } = ev.currentTarget.dataset;
		const type = 'navigate';
		if ((path, type)) {
			autoRedirect({ url: path, type: type });
		}
	},
	async submitFormId(e) {
		const data = await api.hei.submitFormId({
			form_id: e.detail.formId,
		});
		console.log( data);
	},

	async loadHome() {

		this.setData({ 
			isLoading: true,
			hasMask: false
		});

		const data = await api.hei.fetchHome();
		// console.log('home data:', data);
		const { current_user = {}, coupons } = data;
		// if (current_user) {
		// 	this.setData({
		// 		newUser: current_user.new_user,
		// 	});
		// }
		// else {
		// 	this.setData({
		// 		newUser: 1,
		// 	});
		// }

		/**
		*	target_user_type 1:所有人可领取, 2:新人专属
		*	status 2 可使用
		*/
		const newUserCouponIndex = coupons.findIndex(({ status, target_user_type, stock_qty }) => target_user_type === '2' && status === 2 && stock_qty !== 0);
		const userCoupon = coupons.filter(({ status, target_user_type, stock_qty }) => target_user_type !== '2');
		const hasNewUserCoupons = newUserCouponIndex >= 0;

		if (data.page_title) {
			wx.setNavigationBarTitle({
				title: data.page_title,
			});
		}
		let width;
		if (userCoupon && userCoupon.length) {
			width = userCoupon.length * 250 + 20 * userCoupon.length;
		}

		// delete data.coupons;

		// const { shop_setting: { category_style, product_list_style } } = data;
		// data.productListStyle = PRODUCT_LIST_STYLE[+product_list_style - 1];
		// data.categoryListStyle = CATEGORY_LIST_STYLE[+category_style - 1];
		// const newUser = data.current_user ? data.current_user.new_user : null;
		
		this.setData({
			userCoupon, 
			isLoading: false,
			conWidth: width || '',
			hasNewUserCoupons,
			newUser: current_user ? current_user.new_user : 1,
			...data,
		});

		if(this.data.newUser === 1 && this.data.hasNewUserCoupons){
			this.setData({
				hasMask: true
			})
		}

		let products = this.data.products;
		if( products && products[products.length-1]){
			let next_cursor = products[products.length-1].timestamp;
			this.setData({
				next_cursor: next_cursor
			});
		}else{
			this.setData({
				next_cursor: 0
			});
		}

	},

	async onLoad() {
		const { themeColor } = app.globalData;
		this.setData({ themeColor });
		this.loadHome();
	},

	async onReceiveCoupon(id, index) {
		const { coupons } = this.data;
		if (!coupons[index].stock_qty) {
			return;
		}
		console.log('第' + index +'个');
		console.log('qty:'+coupons[index].stock_qty);
		console.log(coupons[index]);
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
				await this.loadHome();
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
		const token = getToken();

		if (!token) {
			const { confirm } = await showModal({
				title: '未登录',
				content: '请先登录，再领取优惠券',
				confirmText: '登录',
			});
			if (confirm) {
				// await login();
				wx.navigateTo({ url: '/pages/login/login' });
			}
			return;
		}

		const { id } = e.currentTarget.dataset;
		let result = [];
		id.map(({ id, target_user_type }, index) => {
			if (target_user_type === '2') result.push(id);
		});
		const allResult = result.join(',');
		const data = await api.hei.receiveCouponAll({
			coupon_ids: allResult,
		});
		showToast({ title: '领取成功' });
		this.setData({
			newUser: 2,
			hasMask: false
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
				// await login();
				wx.navigateTo({ url: '/pages/login/login' });
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
			hasMask: false
		});
	},
	async onPullDownRefresh() {
		this.setData({
			isRefresh: true,
			next_cursor: 0,
		});
		await this.loadHome();
		wx.stopPullDownRefresh();
	},

	// async needAuth(e) {
	// 	const user = await login();
	// 	console.log(user);
	// 	this.setData({
	// 		user: user,
	// 	});
	// },

	async loadProducts() {
		const { next_cursor, products } = this.data;
		const data = await api.hei.fetchProductList({
			cursor: next_cursor,
		});
		const newProducts = products.concat(data.products);
		this.setData({
			products: newProducts,
			next_cursor: data.next_cursor,
		});
		return data;
	},

	/* 触底加载 */
	// async onReachBottom() {
	// 	let modules = this.data.modules;
	// 	if(modules[modules.length-1].key === 'products'){
	// 		const { next_cursor } = this.data;
	// 		if (!next_cursor) {
	// 			console.log(next_cursor);
	// 			return;
	// 		}
	// 		this.loadProducts();
	// 		console.log('products在底部');
	// 	}else{
	// 		console.log('products不在底部');
	// 	}
	// },

	/* 无限加载 */
	showProducts(){
		var that = this;
		wx.getSystemInfo({
			success: function(res) {
				let windowHeight = res.windowHeight;
				that.setData({
					height: windowHeight
				});
				let height = that.data.height;  // 页面的可视高度
				// console.log('页面的可视高度：'+ height);

				wx.createSelectorQuery().select('#loadProducts').boundingClientRect((rect) => {
					// console.log('节点的上边界坐标：' + rect.top);
					// console.log('节点/高度：' + rect.top / height);
					if (rect.top / height < 3 ) { //判断是否在显示范围内
						const { next_cursor } = that.data;
						if (!next_cursor) {
							// console.log('商品加载到底了' + next_cursor);
							return;
						}
						that.loadProducts();
						// console.log('products在底部');
					}
				}
				).exec()
			}
		});
		
	},
	onPageScroll(){ // 监听页面滚动事件
		let modules = this.data.modules;
		if(modules[modules.length-1].key === 'products'){
			this.showProducts();
		}
	},

	onShareAppMessage: onDefaultShareAppMessage,

	reLoad() {
		this.loadHome();
	},
});
