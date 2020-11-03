import api from 'utils/api';

const app = getApp();
Page({
    data: {
        title: 'giveGift',
        config: {},
        product: {},
        themeColor: {},
        currentCardIndex: 0,
        totalPrice: '-',  // 总价
        cardList: [],  // 礼品卡列表
        postage: 0,  // 运费
    },

    onLoad(params) {
        console.log(params);
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('productDetail', (data) => {
            let { currentOrder = {}} = data;
            this.getProductDetail(currentOrder);
        });
        let { themeColor } = app.globalData;
        this.setData({ themeColor });
    },

    // 获取商品详情
    async getProductDetail(e) {
        let { items, totalPrice } = e;
        let posts = JSON.stringify(items);
        const data = await api.hei.getGiftPrepare({ posts });
        let { posts: [product], gift_cards: cardList } = data;
        this.setData({
            product,
            totalPrice,
            cardList
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
