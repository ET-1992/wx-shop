import { PRODUCT_LAYOUT_STYLE } from 'constants/index';
import api from 'utils/api';
// import { showToast, showModal } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
// import getToken from 'utils/getToken';
// import login from 'utils/login';

const WxParse = require('utils/wxParse/wxParse.js');

const app = getApp();

Page({

    /**
	 * 页面的初始数据
	 */
    data: {
        id: 0,
        isLoading: true,
        type: 'topic',
        topic: null,
        user: null,
        page_title: '',
        share_title: '',
        headerType: 'images',
        currentPageLength: 0,
        productLayoutStyle: PRODUCT_LAYOUT_STYLE[3],
    },

    onLoad({ id }) {
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        this.setData({ themeColor });
        const pages = getCurrentPages();
        this.getDetail(id);
        this.setData({
            isIphoneX,
            currentPageLength: pages.length
        });
    },

    async getDetail(id) {
        const { article, share_title, page_title } = await api.hei.articleDetail({
            id: id,
        });
        const { themeColor } = this.data;
        const fomatedContent = article.content.replace(/class="product-card-button"/g, `class="product-card-button" style="background-color: ${themeColor.primaryColor}"`);

        WxParse.wxParse(
            'article_content',
            'html',
            fomatedContent,
            this,
        );

        this.setData({
            id,
            article: article,
            fav_count: article.fav_count,
            is_faved: article.is_faved,
            product: article.products,
            share_title: share_title,
            topic: {
                reply_count: article.replies ? article.replies.length : 0,
                replies: article.replies,
            },
            isLoading: false
        });
        if (page_title) {
            wx.setNavigationBarTitle({
                title: page_title,
            });
        }
    },
    wxParseTagATap(e) {
        wx.navigateTo({
            url: '/' + e.currentTarget.dataset.src,
        });
    },
    // async onFav(e) {
    // 	console.log(this.data);
    // 	const data = await api.hei.fav({
    // 		post_id: e.currentTarget.id,
    // 	});
    // 	this.setData({
    // 		is_faved: true,
    // 		fav_count: this.data.fav_count + 1,
    // 	});
    // 	wx.showToast({
    // 		title: data.errmsg,
    // 		icon: 'success',
    // 		duration: 2000,
    // 	});
    // },
    // async onUnfav(e) {
    // 	const data = await api.hei.unfav({
    // 		post_id: e.currentTarget.id,
    // 	});
    // 	this.setData({
    // 		is_faved: false,
    // 		fav_count: this.data.fav_count - 1,
    // 	});
    // 	wx.showToast({
    // 		title: data.errmsg,
    // 		icon: 'success',
    // 		duration: 2000,
    // 	});
    // },

    async onToggleFav() {
        const { is_faved, article: { id }, fav_count } = this.data;
        const favMethod = is_faved ? 'unfav' : 'fav';
        const data = await api.hei[favMethod]({
            post_id: id,
        });
        if (data) {
            const nextFavCount = is_faved ? fav_count - 1 : fav_count + 1;
            this.setData({
                is_faved: !is_faved,
                fav_count: nextFavCount,
            });
            wx.showToast({
                title: data.errmsg,
                icon: 'success',
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
    clickMe() {
        const that = this;
        that.setData({
            autoplay: false,
            activeIndex: 1,
        });
        this.videoContext.requestFullScreen({

            // direction: 0,
        });
    },
    startPlay() {
        this.setData({
            autoplay: false,
        });
    },
    pause() {
        this.setData({
            autoplay: true,
        });
    },
    end() {
        this.setData({
            autoplay: true,
        });
    },
    fullScreen(e) {
        console.log(e.detail.fullScreen);
        if (e.detail.fullScreen === false) {
            this.setData({
                autoplay: true,
                activeIndex: -1,
            });
        }
    },
    onHideCouponList() {
        this.setData({
            isShowCouponList: false,
        });
    },

    async reLoad() {
        const { id } = this.data;
        const { article } = await api.hei.articleDetail({ id });
        const { fav_count, is_faved, replies } = article;
        this.setData({
            fav_count,
            is_faved,
            topic: {
                reply_count: replies ? replies.length : 0,
            },
        });
    },

    onShareAppMessage: onDefaultShareAppMessage,
});
