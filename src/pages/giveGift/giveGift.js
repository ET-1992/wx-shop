import api from 'utils/api';

const app = getApp();
Page({
    data: {
        title: 'giveGift',
        config: {},
        product: {},
        themeColor: {},
        currentCardIndex: 0,
    },

    onLoad(params) {
        console.log(params);
        let { id } = params,
            { themeColor } = app.globalData;
        this.setData({ themeColor });
        this._id = id;
        this.getProductDetail();
    },

    // 获取商品详情
    async getProductDetail() {
        let id = this._id;
        const data = await api.hei.fetchProduct({ id });
        let { config, product } = data;
        this.setData({
            config,
            product,
        });
    },

    // 选择卡片
    onSelectCard(e) {
        let { index } = e.target.dataset;
        if (index >= 0) {
            this.setData({
                currentCardIndex: index,
            });
        }
    },
});
