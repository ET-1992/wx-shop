import api from 'utils/api';

const app = getApp();
Page({
    data: {
        title: 'giftCardDetail',
        gCard: {},
        order: {},
        themeColor: {},
        fromShare: false,
    },

    onLoad(params) {
        console.log(params);
        let { order_no = '', gift_no = '' } = params,
            { themeColor } = app.globalData;
        Object.assign(this, {
            order_no,
            gift_no,
        });
        this.setData({ themeColor });
        this.getDeatil();
        this.getEnterPages();
    },

    // 获取礼品卡详情
    async getDeatil() {
        let { order_no, gift_no } = this;
        let { gift, order } = await api.hei.fetchGiftCardDetail({
            order_no,
            gift_no,
        });
        this.setData({
            gCard: gift,
            order,
        });
    },

    // 获取页面栈
    getEnterPages() {
        const pages = getCurrentPages();
        let fromShare = false;
        if (pages.length === 1) {
            fromShare = true;
        }
        this.setData({ fromShare });
    },
});
