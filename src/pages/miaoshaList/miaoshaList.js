import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { CONFIG } from 'constants/index';
const app = getApp();

// 创建页面实例对象
Page({
    // 页面的初始数据
    data: {
        products: [],
        isRefresh: false,
        next_cursor: 0,
        page_title: '',
        share_title: '',
        post_type_title: '',
        taxonomy_title: '',
        isLoading: true
    },

    async loadProducts() {
        const { next_cursor, categoryId, isRefresh, products, type } = this.data;
        let promotion_type = 'miaosha_enable';
        if (type === 'bargain') {
            promotion_type = 'bargain_enable';
        }
        if (type === 'groupon') {
            promotion_type = 'groupon_enable';
        }
        const data = await api.hei.fetchProductList({
            cursor: next_cursor,
            promotion_type: promotion_type
        });
        console.log('miaoshaListdata', data);
        const newProducts = isRefresh ? data.products : products.concat(data.products);
        wx.setNavigationBarTitle({
            title: data.page_title
        });
        this.setData({
            products: newProducts,
            isRefresh: false,
            next_cursor: data.next_cursor,
            miaosha_banner: data.miaosha_banner || [],
            bargain_banner: data.bargain_banner || [],
            groupon_banner: data.groupon_banner || [],
            isLoading: false
        });
        return data;
    },

    async onLoad({ type = 'miaosha' }) {
        console.log('type', type);
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        this.setData({
            themeColor,
            type,
            tplStyle
        });
        this.loadProducts();
    },

    async onPullDownRefresh() {
        this.setData({
            isRefresh: true,
            next_cursor: 0,
            isLoading: true
        });
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
