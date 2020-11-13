import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { onDefaultShareAppMessage } from 'utils/pageShare';

const app = getApp();
Page({
    data: {
        title: 'giftCardDetail',
        isLoading: true,
        gift: {},
        order: {},
        themeColor: {},
        order_no: '',  // 订单号
        gift_no: '',  // 礼品卡号
        current_user: {},
        isContributor: true,  // 赠送方
    },

    onLoad(params) {
        console.log(params);
        let { order_no = '', gift_no = '' } = params,
            { themeColor } = app.globalData,
            isContributor = Boolean(order_no);
        this.setData({
            order_no,
            gift_no,
            themeColor,
            isContributor,
        });
        this.getDeatil();
    },

    // 获取礼品卡详情
    async getDeatil() {
        let { order_no, gift_no } = this.data;
        let { gift, order, current_user } = await api.hei.fetchGiftCardDetail({
            order_no,
            gift_no,
        });
        this.setData({
            gift: gift,
            order,
            isLoading: false,
            current_user,
        });
    },

    // 输入祝福语
    onMessageInput(e) {
        let { value = '' } = e.detail;
        this._message = value;
    },

    // 放进钱包
    async onPutWallet() {
        let { cancel } = await proxy.showModal({
            title: '温馨提示',
            content: '放进卡包不会保存祝福语'
        });
        if (cancel) { return }
        wx.navigateBack();
    },

    // 赠送好友
    async onShareAppMessage() {
        wx.showLoading();
        let {
            gift: { gift_no, gift_cover_url },
            current_user: { nickname },
        } = this.data;

        let message = this._message || '';
        try {
            await api.hei.presentGiftCard({ gift_no, message });
            this.setData({
                share_title: `好友${nickname}给你发来了一个礼品卡，快去领取吧`,
                share_image: gift_cover_url,
            });
            let opts = { gift_no, order_no: '' },
                path = 'pages/giftCardDetail/giftCardDetail';
            return onDefaultShareAppMessage.call(this, opts, path);
        } catch (e) {
            proxy.showModal({
                title: '报错提示',
                content: e.errMsg,
            });
        } finally {
            wx.hideLoading();
        }
    },

    // 领取礼品卡
    async onReceiveCard() {
        let { gift_no } = this.data;
        wx.showLoading();
        try {
            await api.hei.receiveGiftCard({ gift_no });
            wx.hideLoading();
            let { cancel } = await proxy.showModal({
                title: '温馨提示',
                content: '您已经成功领取礼品，是否立即使用',
            });
            if (cancel) { return }
            wx.navigateTo({
                url: `/pages/giftCardExchange/giftCardExchange?no=${gift_no}`
            });
        } catch (e) {
            wx.hideLoading();
            await proxy.showModal({
                title: '报错提示',
                content: e.errMsg,
                showCancel: false,
            });
            wx.switchTab({
                url: '/pages/home/home'
            });

        }

    },
});
