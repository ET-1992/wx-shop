import { PRODUCT_LIST_STYLE,CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';



// 获取全局应用程序实例对象
// const app = getApp()

// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		products: [],
		// productListStyle: PRODUCT_LIST_STYLE[1],

		isRefresh: false,

		next_cursor: 0,

		page_title: '',
		share_title: '',
		post_type_title: '',
		taxonomy_title: '',
	},

	async loadProducts() {
		const { next_cursor, categoryId, isRefresh, products } = this.data;
		const data = await api.hei.fetchProductList({
			cursor: next_cursor,
			meta_key: 'miaosha_enable',
		});
		const newProducts = isRefresh ? data.products : products.concat(data.products);
		wx.setNavigationBarTitle({
			title: data.page_title
		  })
		this.setData({
			products: newProducts,
			isRefresh: false,
			next_cursor: data.next_cursor,
			miaosha_banner: data.miaosha_banner
		});
		return data;
	},

	async onLoad () {
		this.loadProducts();
	},

	async onPullDownRefresh() {
		this.setData({ isRefresh: true, next_cursor: 0 });
		await this.loadProducts();
		wx.stopPullDownRefresh();
	},

	async onReachBottom() {
		const { next_cursor } = this.data;
		if (!next_cursor) { return; }
		this.loadProducts();
	},

	// 页面分享设置
	onShareAppMessage: onDefaultShareAppMessage,

	// onShareAppMessage:function(res) {
	// 	console.log(this.data)
	// 	return {
	// 		title: this.data.share_title,
	// 		imageUrl:this.data.share_image,
	// 		path:'/pages/miaoshaList/miaoshaList?meta_key=miaosha_enable'
	// 	}
	// }
});
