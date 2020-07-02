import { go } from 'utils/util';
import api from 'utils/api';
import { createCloudOrder, onDefaultShareAppMessage } from 'utils/pageShare';
const WxParse = require('utils/wxParse/wxParse.js');

Page({
    data: {
        title: 'productDetail',
        isLoading: true,
        totalRound: '',  // 商品总期数
        currentRound: '',  // 商品选中期数
        activeTab: 0,  // 期数选中标签
        status: 1,  // 商品状态，默认是进行中
        joinShow: false,  // 立即参与弹窗
        product: {},  // 产品数据
        productNum: 1,  // 产品数量
        post_id: '',
        activity_id: '',
        blog_id: '',
        firstNoUpdateProduct: true,  // 首次不更新商品活动数据
        showShareModal: false,  // 分享弹窗
        posterModal: false,  // 海报弹窗
        routeQuery: {},
    },

    async onLoad(params) {
        let { id, round = 0 } = params;
        let { id: routeQueryId } = this.options;
        this.setData({
            post_id: id,
            currentRound: round,
            routeQuery: { id: routeQueryId },
        });
        this.initPage();
        await this.getProductData();
        await this.updateTabs();
    },

    onShow() {
        this.updateProductData();
    },

    go,

    // 初始化数据
    initPage() {
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const { themeColor } = getApp().globalData;
        this.setData({ themeColor, isIphoneX });
    },

    // 获取商品详情数据
    async getProductData() {
        this.setData({ isLoading: true });
        let { post_id, currentRound } = this.data;
        try {
            const data = await api.hei.fetchCoinProduct({
                id: post_id,
                round: currentRound,
            });
            let {
                activity: { status, id },
                blog_id,
                luckydraw: { current_round },
                is_release,  // 店铺是否发布该商品
            } = data.product;
            // 展示全部期数
            let showTotalRound = current_round;
            if (!is_release) { showTotalRound-- }

            this.setData({
                isLoading: false,
                product: data.product,
                totalRound: showTotalRound,
                status,
                activity_id: id,
                blog_id,
            });
            this.formatContent();
        } catch (error) {
            console.log('error', error);
        }
    },

    // 更新商品活动情况
    async updateProductData() {
        let { firstNoUpdateProduct, post_id, currentRound } = this.data;
        // 首次onshow不更新
        if (firstNoUpdateProduct) {
            this.setData({ firstNoUpdateProduct: false });
            return;
        }
        try {
            const data = await api.hei.fetchCoinProduct({
                id: post_id,
                round: currentRound,
            });
            let { product } = data;
            this.setData({ product });
        } catch (error) {
            console.log('error', error);
        }
    },

    // 更新tab标签栏
    updateTabs() {
        let { currentRound, totalRound } = this.data;
        if (currentRound > 0) {
            let activeTab = totalRound - currentRound;
            this.setData({ activeTab });
        }
    },

    // 切换期数标签
    onChangeTabs(e) {
        let { index } = e.detail;
        let { totalRound } = this.data;
        this.setData({
            activeTab: index,
            currentRound: totalRound - index,
        });
        this.getProductData();
    },

    // 查看最新一期
    onShiftLatest() {
        let { totalRound } = this.data;
        const index = 0;
        this.setData({
            activeTab: index,
            currentRound: totalRound,
        });
        this.getProductData();
    },

    // 获得购买数量
    onNumChange(event) {
        this.setData({ productNum: event.detail });
    },

    // 立即参与
    createOrder() {
        let { product, productNum } = this.data;
        let arr = [{ product, productNum }];
        const currentOrder = createCloudOrder(arr);
        getApp().globalData.currentOrder = currentOrder;
        this.onCloseJoinPopup();
        wx.navigateTo({ url: `/pages-cuilv/coinOrderCreate/coinOrderCreate?pageValue=2` });
    },

    // 加入心愿单
    async addCloudCart() {
        let { post_id, blog_id } = this.data;
        let source_blog_id = blog_id;
        try {
            await api.hei.addCart({ post_id, source_blog_id });
            wx.hideToast();
            wx.showToast({
                title: '成功添加',
                icon: 'success',
            });
        } catch (error) {
            console.log('error', error);
        }
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

    // 监听下拉刷新
    onPullDownRefresh() {
        this.getProductData();
        wx.stopPullDownRefresh();
    },

    // 展示参与弹窗
    showJoinPopup() {
        this.setData({ joinShow: true });
    },
    // 隐藏参与弹窗
    onCloseJoinPopup() {
        this.setData({ joinShow: false });
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
