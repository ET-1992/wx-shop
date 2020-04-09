import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { updateCart } from 'utils/util';
import { CONFIG } from 'constants/index';
const app = getApp();

Page({

    data: {
        categories: [],
        selectedIndex: 0,
        isLoading: true,
        showIndex: 0
    },

    async onLoad() {
        try {
            this.setData({ isLoading: true });
            const data = await api.hei.fetchCategory();
            const { categories = [] } = data;
            categories.forEach((category) => {
                const { children = [] } = category;
                children.unshift({
                    id: category.id,
                    thumbnail: category.thumbnail,
                    name: '全部'
                });
            });

            this.setData({
                isLoading: false,
                ...data
            });

            this.getCategoryTop();
        }
        catch (err) {
            console.log('load category error: ', err);
        }

    },

    onShow() {
        const { categoryIndex } = app.globalData;
        if (categoryIndex !== -1) {
            updateCart(categoryIndex);
        }
    },


    getDomRect(id) {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().select(`#${id}`).boundingClientRect((rect) => {
                resolve(rect);
            }).exec();
        });
    },

    async getCategoryTop() {
        const { categories = [] } = this.data;
        const categoryTops = [];
        for (const i in categories) {
            const rect = await this.getDomRect('c' + i);
            categoryTops.push(rect.top);
        }
        this.setData({ categoryTops });
        console.log(categoryTops, 'ooo');
    },

    async onScroll(e) {
        const { categoryTops } = this.data;
        if (categoryTops) {
            const { scrollTop } = e.detail;
            const index = categoryTops.findIndex((item) => {
                return item >= scrollTop;
            });
            this.setData({
                showIndex: index
            });
        }
    },

    onMainCategoryItemClick(ev) {
        const { index } = ev.currentTarget.dataset;
        this.setData({ selectedIndex: index });
    },
    onShareAppMessage: onDefaultShareAppMessage,

    // async onPullDownRefresh() {
    //     this.onLoad();
    //     wx.stopPullDownRefresh();
    // }
});
