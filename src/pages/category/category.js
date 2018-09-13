import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { updateCart } from 'utils/util';
const app = getApp();

Page({

    data: {
        categories: [],

        selectedIndex: 0,
        isLoading: true,
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
        }
        catch (err) {
            console.log('load category error: ', err);
        }

    },

    onShow() {
        const { categoryIndex } = app.globalData;
        updateCart(categoryIndex.categoryIndex);
    },

    onMainCategoryItemClick(ev) {
        const { index } = ev.currentTarget.dataset;
        this.setData({ selectedIndex: index });
    },
    onShareAppMessage: onDefaultShareAppMessage,
});
