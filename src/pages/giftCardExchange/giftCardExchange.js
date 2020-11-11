import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { go, valueToText } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';

const app = getApp();
Page({
    data: {
        gift: {},
        order: {},
        isLoading: true,
        themeColor: {},
        address: {},
        ORDER_STATUS_TEXT,
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
        let { status, receiver_name, receiver_phone, receiver_address, room = '' } = order;
        order.statusText = valueToText(ORDER_STATUS_TEXT, status);
        let address = {
            userName: receiver_name,
            telNumber: receiver_phone,
            detailInfo: receiver_address,
            room,
        };
        this.setData({
            gift,
            order,
            address,
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

    // 拷贝订单号
    async setClipboard() {
        try {
            const { no } = this.data.gift.logistic;
            await proxy.setClipboardData({ data: String(no) });
            wx.showToast({ title: '订单号复制成功！', icon: 'success' });
        } catch (err) {
            console.log(err);
        }
    },
});
