import api from 'utils/api';
import { USER_KEY, CONFIG } from 'constants/index';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { updateCart } from 'utils/util';
const app = getApp();

Page({
    data: {
        articles: [],
        categories: [],
        categoryId: 0,
        categoryParent: 0,
        isLoading: true,
        isInit: true,
        current_page: 1,
        clientX: 0,
        activeIndex: 0,
    },
    async onLoad({ categoryId = '', categoryParent = '', module_id = '' }) {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        this.setData({
            categoryId,
            categoryParent,
            config,
            module_id
        });
        await this.getArticleList();
        const { categories } = this.data;

        let navbarListData = categories.map(item => {
            return {
                text: item.name,
                value: item.id
            };
        });
        navbarListData.unshift({ text: '全部', value: '' });
        let activeIndex = navbarListData.findIndex((item) => {
            return item.value === Number(categoryId);
        });
        if (activeIndex === -1) {
            activeIndex = 0;
        }

        this.setData({
            themeColor,
            tplStyle,
            globalData: app.globalData,
            navbarListData,
            activeIndex,
            isInit: false
        });
    },
    onShow() {
        const { categoryIndex } = app.globalData;
        if (categoryIndex !== -1) {
            updateCart(categoryIndex);
        }
    },

    async getArticleList() {
        let { current_page, categoryId, activeIndex, articles, categoryParent, config: { share_title, share_image }, module_id} = this.data;
        let options = {
            paged: current_page,
            article_category_id: categoryId,
            article_category_parent: categoryParent,
            module_id
        };

        this.data.fetchProductListStatus = 'Pending';

        const data = await api.hei.articleList(options);
        current_page++;

        this.data.fetchProductListStatus = 'Success';

        if (articles.length > 0) {
            data.articles = articles.concat(data.articles);
        }
        wx.setNavigationBarTitle({
            title: activeIndex - 1 >= 0 ? data.categories[activeIndex - 1].page_title : data.page_title,
        });
        this.setData({
            ...data,
            share_title,
            share_image,
            current_page,
            isLoading: false
        });
    },
    changeNavbarList(e) {
        const { index, value } = e.detail;
        this.setData({
            articles: [],
            categoryId: value,
            activeIndex: index,
            isLoading: true,
            current_page: 1
        });
        this.getArticleList();
    },

    onTouchStart(e) {
        this.data.clineX = e.touches[0].clientX;
    },
    onTouchEnd(e) {
        let { activeIndex } = this.data;
        if (e.changedTouches[0].clientX - this.data.clineX < -120) {
            this.moveIndex(activeIndex + 1);
        }
        if (e.changedTouches[0].clientX - this.data.clineX > 120) {
            this.moveIndex(activeIndex - 1);
        }
    },
    moveIndex(index) {
        let activeIndex = index;
        const { navbarListData } = this.data;
        const { length, last = length - 1 } = navbarListData;
        if (activeIndex < 0) {
            return;
        }
        if (index > last) {
            activeIndex = 0;
        }
        this.setData({
            articles: [],
            categoryId: navbarListData[activeIndex].value,
            activeIndex,
            isLoading: true,
            current_page: 1
        });
        this.getArticleList();
    },
    async onPullDownRefresh() {
        this.setData({
            articles: [],
            isLoading: true,
            current_page: 1,
        });
        await this.getArticleList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        let { current_page, total_pages } = this.data;
        if (current_page > total_pages) { return }
        if (this.data.fetchProductListStatus === 'Success') {
            this.getArticleList();
        }
    },
    onShareAppMessage: onDefaultShareAppMessage,
});
