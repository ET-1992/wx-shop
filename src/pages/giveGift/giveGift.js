import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { api_hei_create_order } from 'utils/pageShare';

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
        let { themeColor } = app.globalData;
        this.setData({ themeColor });
        // this.getProductDetail();
        // return;
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('productDetail', (data) => {
            let { currentOrder = {}} = data;
            this.getProductDetail(currentOrder);
        });
    },

    // 获取商品详情
    async getProductDetail(e) {
        let { items, totalPrice } = e;
        let posts = JSON.stringify(items);
        // let totalPrice = '100';
        // let posts = '[{"post_id":5553,"title":"农夫山泉矿泉水1.5L*6","original_price":15.99,"image_url":"http://pospalstoreimg.area28.pospal.cn:80/productImages/3470442/ffc4a08e-db11-4ea7-8e02-22f8ae65a9f7.jpg","price":1,"id":5553,"postage":0,"quantity":1,"sku_id":28030,"sku_property_names":"尺寸:11;"}]';
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

    // 支付订单
    async onOrderPay() {
        let { product, cardList, currentCardIndex } = this.data,
            orderType = 'gift_card';
        let annotation = {
            card_code: cardList[currentCardIndex].code
        };
        try {
            let { cancel } = await proxy.showModal({
                title: '温馨提示',
                content: '您确定要提交订单吗',
            });
            if (cancel) { return }
            // 传递后端字段数据到POST请求中
            let post = {
                posts: [product],
                annotation,
                orderType,
            };
            await api_hei_create_order(post);
        } catch (e) {
            wx.showModal({
                title: '报错提示',
                content: e.errMsg,
                showCancel: false,
            });
        }
    },
});
