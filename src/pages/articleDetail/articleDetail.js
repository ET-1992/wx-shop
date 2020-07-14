import api from 'utils/api';
import { onDefaultShareAppMessage, onDefaultShareAppTimeline } from 'utils/pageShare';
import { PLATFFORM_ENV } from 'constants/index';
import { go } from 'utils/util';

const WxParse = require('utils/wxParse/wxParse.js');

const app = getApp();

Page({

    data: {
        isLoading: true,
        current_user: {},
        isShowShareModal: false,
        showPosterModal: false,
        PLATFFORM_ENV,  // 平台环境变量
    },

    go,

    async onLoad({ id }) {
        const {
            globalData: { themeColor },
            systemInfo: { isIphoneX }
        } = app;

        this.setData({
            id,
            isIphoneX,
            themeColor
        });

        this.getDetail(id);
    },

    async getDetail(id) {
        try {
            const { article, share_title, share_image, page_title, current_user } = await api.hei.articleDetail({ id });

            const { themeColor = {}} = this.data;
            const fomatedContent = article.content.replace(/class="product-card-button"/g, `class="product-card-button" style="background-color: ${themeColor.primaryColor}"`);

            WxParse.wxParse('article_content', 'html', fomatedContent, this);

            this.setData({
                article,
                share_title,
                share_image: share_image,
                current_user,
                isLoading: false,
                product: article.products || [],
            });
            if (page_title) {
                wx.setNavigationBarTitle({ title: page_title });
            }
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    wxParseTagATap(e) {
        wx.navigateTo({
            url: '/' + e.currentTarget.dataset.src,
        });
    },

    async onToggleFav() {
        try {
            const { article: { id, is_faved, fav_count }} = this.data;
            const method = is_faved ? 'unfav' : 'fav';
            const { errmsg, current_user } = await api.hei[method]({ post_id: id });

            this.setData({
                'article.is_faved': !is_faved,
                'article.fav_count': is_faved ? fav_count - 1 : fav_count + 1,
                current_user
            });
            wx.showToast({
                title: errmsg,
                icon: 'success'
            });

        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    // 一键加车逻辑
    async addCard() {
        const { vendor } = app.globalData;
        let { product } = this.data;

        let params = product.map((item) => ({ post_id: item.id, vendor }));
        const data = await api.hei.addCart({ posts: JSON.stringify(params) });
        console.log(data);
        if (!data.errcode) {
            wx.showToast({
                title: '成功添加'
            });
        }
    },

    onReady() {
        this.videoContext = wx.createVideoContext('myVideo');
    },
    currentIndex(e) {
        this.setData({
            current: e.detail.current,
        });
    },

    onShare() {
        this.setData({
            isShowShareModal: !this.data.isShowShareModal
        });
    },

    onShowPoster() {
        const { id, banner, title, excerpt, author } = this.data.article;
        let posterData = {
            id,
            banner,
            title,
            author,
            excerpt
        };
        this.setData({
            showPosterModal: true,
            isShowShareModal: false,
            posterData
        });
    },

    onClosePoster() {
        this.setData({
            showPosterModal: false
        });
    },

    onShareAppMessage() {
        return onDefaultShareAppMessage.call(this, {}, '', { key: '/pages/home/home' });
    },


    // 分享朋友圈按钮
    onShareTimeline() {
        return onDefaultShareAppTimeline.call(this);
    }
});
