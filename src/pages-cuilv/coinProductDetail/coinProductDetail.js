import { CONFIG } from 'constants/index';
import { go } from 'utils/util';
import { createCurrentOrder, onDefaultShareAppMessage } from 'utils/pageShare';
import api from 'utils/api';
const WxParse = require('utils/wxParse/wxParse.js');

Page({
    data: {
        title: 'coinProductDetail',
        isLoading: true,
        isShowAcitonSheet: false,
        product: {},
        showShareModal: false,  // 分享弹窗
        posterModal: false,  // 海报弹窗
        routeQuery: {},
    },

    onLoad(params) {
        console.log(params);
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const config = wx.getStorageSync(CONFIG);
        const { themeColor } = getApp().globalData;
        let { id: routeQueryId } = this.options;
        this.setData({
            id: params.id,
            isIphoneX,
            config,
            themeColor,
            routeQuery: { id: routeQueryId },
        });
        this.getDetailData();
    },

    go,

    async getDetailData() {
        let { id } = this.data;
        const data = await api.hei.fetchProduct({ id });
        let { product } = data;
        this.setData({
            isLoading: false,
            product,
        });
        this.formatContent();
    },

    // 格式化商品详情
    formatContent() {
        let { product } = this.data;
        WxParse.wxParse(
            'contentList',
            'html',
            product.content,
            this,
        );
    },

    // 当选择好SKU数据
    onSkuConfirm(e) {
        let { shipping_type } = this.data;
        console.log('e', e);
        this.onSaveSku(e.detail);
        wx.navigateTo({ url: `/pages-cuilv/coinOrderCreate/coinOrderCreate?pageValue=1&expressType=${shipping_type}` });
    },

    // 储存sku数据，传递本地数据
    onSaveSku({ selectedSku = {}, quantity }) {
        let { product } = this.data;
        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
        });
        getApp().globalData.currentOrder = currentOrder;
    },

    // 获取配送方式 shipping_type
    getShippingType(e) {
        this.setData({
            shipping_type: e.detail.shipping_type
        });
    },

    // 展示sku
    onShowSku() {
        this.setData({ isShowAcitonSheet: true });
    },


    // 打开分享弹窗
    async openShareModal() {
        this.setData({
            showShareModal: true
        });
    },
    // 关闭分享弹窗
    closeShareModal() {
        this.setData({
            showShareModal: false
        });
    },
    // 打开海报弹窗
    async openPosterModal() {
        this.setData({
            posterModal: true,
            showShareModal: false
        });
    },
    // 关闭海报弹窗
    closePosterModal() {
        this.setData({
            posterModal: false
        });
    },
    // 分享好友
    onShareAppMessage() {
        this.closeShareModal();
        const { current_user = {}, product } = this.data;
        this.setData({
            share_title: product.title || '',
            share_image: product.thumbnail || '',
        });
        let opts = {};
        if (product.affiliate_enable && current_user.is_affiliate_member) {
            opts = {
                afcode: current_user.afcode || ''
            };
        }
        return onDefaultShareAppMessage.call(this, opts);
    },
});
