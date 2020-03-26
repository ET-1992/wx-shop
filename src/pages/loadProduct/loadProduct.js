
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { CONFIG } from 'constants/index';

// 获取应用实例
const app = getApp();

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

        isLoading: true,

        post_type_title: '',
        taxonomy_title: '',
        share_title: '',
        page_title: '',
        type: '',
    },

    async loadProducts() {
        const { next_cursor, products, params } = this.data;
        const data = await api.hei.fetchProductList({
            cursor: next_cursor,
            ...params
        });
        const newProducts = products.concat(data.products);
        this.setData({
            products: newProducts,
            next_cursor: data.next_cursor,
            isLoading: false,
            share_image: data.share_image,
            share_title: data.share_title
        });
        return data;
    },

    async onLoad(params) {
        const { themeColor } = app.globalData;
        const { style_type: tplStyle = 'default' } = wx.getStorageSync(CONFIG);
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
            isLoading: true,
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
