import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { CONFIG } from 'constants/index';
import { updateTabbar } from '../../utils/util';
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
            // const { themeColor, partner = {}, tabbarPages } = app.globalData;
            // let { navBarExtendHeight, navBarHeight } = app.globalSystemInfo;
            // let navHeight = navBarHeight + navBarExtendHeight;
            // this.setData({
            //     isLoading: true,
            //     navHeight,
            // });
            const data = await api.hei.fetchCategory();
            data.categories = data.product_categories;
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
        updateTabbar({ pageKey: 'category_list' });
        app.globalData.pageKey = 'category_list';
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
            categoryTops.push(rect && rect.top);
        }
        this.setData({ categoryTops });
        console.log(categoryTops, 'ooo');
    },

    async onScroll(e) {
        const { categoryTops } = this.data;
        if (categoryTops) {
            const { scrollTop } = e.detail;
            let index = categoryTops.findIndex((item) => {
                return item >= scrollTop;
            });
            if (scrollTop > categoryTops[categoryTops.length - 1]) {
                index = categoryTops.length - 1;
            }
            this.setData({
                showIndex: index
            });
        }
    },

    onMainCategoryItemClick(ev) {
        const { index } = ev.currentTarget.dataset;
        this.setData({
            selectedIndex: index
        });
    },
    onShareAppMessage: onDefaultShareAppMessage,

    // async onPullDownRefresh() {
    //     this.onLoad();
    //     wx.stopPullDownRefresh();
    // }
});
