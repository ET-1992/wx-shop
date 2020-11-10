import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { go } from 'utils/util';

const app = getApp();
Page({
    data: {
        gift: {},
        order: {},
        isLoading: true,
        themeColor: {},
        address: {},
    },

    onLoad(params) {
        console.log(params);
        let { no } = params;
        let { themeColor } = app.globalData;
        this._no = no;
        this.setData({ themeColor });
        this.getCardDetail();
        app.event.on('setAddressListEvent', this.setAddressListEvent, this);
    },

    onUnload() {
        app.event.off('setAddressListEvent', this);
    },

    go,

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

    // 兑换礼品卡
    async onExchangeCard() {
        let gift_no = this._no,
            { address: { id: receiver_id }} = this.data;
        let post = { gift_no },
            errMsg = '',
            sucMsg = '';

        if (receiver_id) {
            Object.assign(post, { receiver_id });
        }
        try {
            await api.hei.exchangeGiftCard(post);
            sucMsg = '您已成功兑换该礼品卡';
        } catch (e) {
            console.log('e', e);
            errMsg = e.errMsg;
        }

        let data = await proxy.showModal({
            title: '温馨提示',
            content: sucMsg || errMsg,
            showCancel: false,
        });

        if (sucMsg) {
            this.getCardDetail();
        }
    },

    // 设置地址列表返回的数据
    setAddressListEvent(address) {
        console.log('从地址列表返回的地址', address);
        this.setData({
            address,
        });
    },
});
