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
        isLoading: true,
        current_page: 1
    },

    async loadProducts() {
        let { categoryId, isRefresh, products, type, current_page } = this.data;
        let promotion_type = 'miaosha_enable';
        if (type === 'bargain') {
            promotion_type = 'bargain_enable';
        }
        if (type === 'groupon') {
            promotion_type = 'groupon_enable';
        }
        const data = await api.hei.fetchProductList({
            promotion_type: promotion_type,
            paged: current_page,
            product_category_id: categoryId
        });
        current_page++;
        const newProducts = isRefresh ? data.products : products.concat(data.products);
        wx.setNavigationBarTitle({
            title: data.page_title
        });
        const { miaosha_banner, bargain_banner, groupon_banner, total_pages, share_image, share_title } = data;
        this.setData({
            products: newProducts,
            isRefresh: false,
            miaosha_banner,
            bargain_banner,
            groupon_banner,
            total_pages,
            isLoading: false,
            share_image,
            share_title,
            current_page
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
            isLoading: true,
            current_page: 1
        });
        await this.loadProducts();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { current_page, total_pages } = this.data;
        if (current_page >= total_pages) { return }
        this.loadProducts();
    },

    // 页面分享设置
    onShareAppMessage: onDefaultShareAppMessage
});
