import api from 'utils/api';

const app = getApp();
Page({
    data: {
        title: 'giftCardDetail',
        gCard: {},
        order: {},
        themeColor: {},
        order_no: '',  // 订单号
        gift_no: '',  // 礼品卡号
    },

    onLoad(params) {
        console.log(params);
        let { order_no = '', gift_no = '' } = params,
            { themeColor } = app.globalData;
        this.setData({
            order_no,
            gift_no,
            themeColor,
        });
        this.getDeatil();
    },

    // 获取礼品卡详情
    async getDeatil() {
        let { order_no, gift_no } = this.data;
        // 赠送者查看使用订单号/领取者查看使用礼品卡号
        let { gift, order } = await api.hei.fetchGiftCardDetail({
            order_no,
            gift_no,
        });
        this.setData({
            gCard: gift,
            order,
        });
    },
});
