import { PRODUCT_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

// 获取全局应用程序实例对象
const app = getApp();

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
            meta_key: 'groupon_enable',
        });
        console.log(data);
        wx.setNavigationBarTitle({
            title: data.page_title
        });
        const newProducts = isRefresh ? data.products : products.concat(data.products);
        this.setData({
            products: newProducts,
            isRefresh: false,
            next_cursor: data.next_cursor,
            groupon_banner: data.groupon_banner
        });
        return data;
    },

    async onLoad() {
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
        this.loadProducts();
    },
    async submit(e) {
        const data = await api.hei.submitFormId({
            form_id: e.detail.formId
        });
    },
    async onPullDownRefresh() {
        this.setData({ isRefresh: true, next_cursor: 0 });
        await this.loadProducts();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadProducts();
    },

    // 页面分享设置
    onShareAppMessage: onDefaultShareAppMessage,

    // onShareAppMessage:function(res) {
    // 	console.log(this.data)
    // 	return {
    // 		title: this.data.share_title,
    // 		imageUrl:this.data.share_image,
    // 		path:'/pages/grouponList/grouponList?meta_key=groupon_enable'
    // 	}
    // }
});
