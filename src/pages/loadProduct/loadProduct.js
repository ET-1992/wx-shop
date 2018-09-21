import { PRODUCT_LAYOUT_STYLE, CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
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
        coupons: [],

        productListStyle: PRODUCT_LAYOUT_STYLE[0],
        categoryListStyle: CATEGORY_LIST_STYLE[2],
        isRefresh: false,
        isLoading: false,

        post_type_title: '',
        taxonomy_title: '',
        share_title: '',
        page_title: '',
        type: '',
    },

    async loadProducts() {

        this.setData({ isLoading: true });
        const { next_cursor, products, params } = this.data;

        const data = await api.hei.fetchProductList({
            cursor: next_cursor,
            ...params
        });

        const newProducts = products.concat(data.products);
        this.setData({
            products: newProducts,
            next_cursor: data.next_cursor,
        });

        this.setData({ isLoading: false });
        return data;
    },

    async onLoad(params) {
        const { themeColor, tplStyle } = app.globalData;
        this.setData({ themeColor, tplStyle, params });
        const data = await this.loadProducts();
        if (data.page_title) {
            wx.setNavigationBarTitle({
                title: data.page_title,
            });
        }
    },

    async onPullDownRefresh() {
        this.setData({
            isRefresh: true,
            next_cursor: 0,
            products: [],
        });
        await this.loadProducts();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) {
            return;
        }
        this.loadProducts();

        console.log(this.data);
    },

    onShareAppMessage: onDefaultShareAppMessage,

});
