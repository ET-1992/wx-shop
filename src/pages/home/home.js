import { PRODUCT_LIST_STYLE, CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { showToast } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';

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
		coupons: [
			{
				"id": 2,
				"scope": 1, // 使用范围，1:全场通用，2:指定商品
				"type": 1, // 类型，1:满减，2:折扣
				"title": "满11减10",
				"description": "满11减10，全场通用",
				"image_url": "http://cdn2.wpweixin.com/wp-content/uploads/sites/339/2018/01/c69210ce8733e836454709320a5bb720.png",
				"reduce_cost": 10, // 优惠券面额（最大减免金额）
				"least_cost": 11, // 起用金额, 0: 无门槛
				"discount": 0, // 折扣额度（百分比），30就是七折
				"total_qty": 100, // 总数量
				"stock_qty": 100, // 库存数量
				"start_time": "2018-01-08T23:21", // 可用开始时间
				"end_time": "2018-01-11T23:21", // 可用结束时间
				"status": 2, // 优惠券状态，2: 可领取, 3: 已过期，不可领取，4:用户已领取，5:用户已使用
				"start_timestamp": 1515424860,
				"end_timestamp": 1515684060
			},
			{
				"id": 3,
				"scope": 1, // 使用范围，1:全场通用，2:指定商品
				"type": 2, // 类型，1:满减，2:折扣
				"title": "满11减10",
				"description": "满11减10，全场通用",
				"image_url": "http://cdn2.wpweixin.com/wp-content/uploads/sites/339/2018/01/c69210ce8733e836454709320a5bb720.png",
				"reduce_cost": 10, // 优惠券面额（最大减免金额）
				"least_cost": 11, // 起用金额, 0: 无门槛
				"discount": 0, // 折扣额度（百分比），30就是七折
				"total_qty": 100, // 总数量
				"stock_qty": 100, // 库存数量
				"start_time": "2018-01-08T23:21", // 可用开始时间
				"end_time": "2018-01-11T23:21", // 可用结束时间
				"status": 2, // 优惠券状态，2: 可领取, 3: 已过期，不可领取，4:用户已领取，5:用户已使用
				"start_timestamp": 1515424860,
				"end_timestamp": 1515684060
			},
			{
				"id": 3,
				"scope": 1, // 使用范围，1:全场通用，2:指定商品
				"type": 2, // 类型，1:满减，2:折扣
				"title": "满11减10",
				"description": "满11减10，全场通用",
				"image_url": "http://cdn2.wpweixin.com/wp-content/uploads/sites/339/2018/01/c69210ce8733e836454709320a5bb720.png",
				"reduce_cost": 10, // 优惠券面额（最大减免金额）
				"least_cost": 11, // 起用金额, 0: 无门槛
				"discount": 30, // 折扣额度（百分比），30就是七折
				"total_qty": 100, // 总数量
				"stock_qty": 100, // 库存数量
				"start_time": "2018-01-08T23:21", // 可用开始时间
				"end_time": "2018-01-11T23:21", // 可用结束时间
				"status": '4', // 优惠券状态，2: 可领取, 3: 已过期，不可领取，4:用户已领取，5:用户已使用
				"start_timestamp": 1515424860,
				"end_timestamp": 1515684060
			},
		],

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
		wx.setNavigationBarTitle({
			title: data.page_title
		});


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
		const data = await api.hei.receiveCoupon({
			coupon_id: id
		});
		const { errcode } = data;
		if (!errcode) {
			showToast({ title: '领取成功' });
			const updateData = {};
			const key = `coupons[${index}].status`;
			updateData[key] = '4';
			this.setData(updateData);
		}
	},

	async onCouponClick(ev) {
		const { id, index, status } = ev.currentTarget.dataset;
		console.log(ev.currentTarget.dataset);
		if (+status === 2) {
			await this.onReceiveCoupon(id, index);
		}
		else {
			wx.navigateTo({
				url: '/pages/couponProducts/couponProducts'
			})
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

