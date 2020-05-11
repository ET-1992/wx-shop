import { PRODUCT_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

Page({
    data: {
        products: [],
        productListStyle: PRODUCT_LIST_STYLE[1],
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
            promotion_type: 'miaosha_enable',
            meta_value: '1'
        });
        const newProducts = isRefresh ? data.products : products.concat(data.products);
        this.setData({
            products: newProducts,
            isRefresh: false,
            next_cursor: data.next_cursor,
            miaosha_banner: data.miaosha_banner,
            share_image: data.share_image,
            share_title: data.share_title
        });
        return data;
    },

    async onLoad() {
        this.loadProducts();
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
    onShareAppMessage: onDefaultShareAppMessage
});

