import api from 'utils/api';

const app = getApp();
Page({
    data: {
        gift: {},
        order: {},
        isLoading: true,
        themeColor: {},
    },

    onLoad(params) {
        console.log(params);
        let { no } = params;
        let { themeColor } = app.globalData;
        this._no = no;
        this.setData({ themeColor });
        this.getCardDetail();
    },

    // 获取礼品卡信息
    async getCardDetail() {
        let { _no } = this;
        let { gift, order } = await api.hei.fetchGiftCardDetail({
            order_no: '',
            gift_no: _no,
        });
        let title = gift.gift_title || '兑换礼品卡';
        wx.setNavigationBarTitle({ title });
        this.setData({
            gift,
            order,
            isLoading: false,
        });
    },
});
