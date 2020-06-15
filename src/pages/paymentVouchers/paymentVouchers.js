import api from 'utils/api';
import { ORDER_STATUS_TEXT, CONFIG } from 'constants/index';
import { valueToText, subscribeMessage } from 'utils/util';
import proxy from 'utils/wxProxy';
import { showModal, chooseImage } from 'utils/wxp';

const app = getApp();

Page({
    data: {
        title: '支付凭证',
        activeIndex: 0,
        transfers: [],
        transfer_image: '',
        isLoading: true,
        order_no: ''
    },

    onLoad(params) {
        console.log('params', params); // order_no、subKeys
        const config = wx.getStorageSync(CONFIG);
        const { themeColor } = app.globalData;
        let { subKeys } = params;
        subKeys = subKeys ? JSON.parse(subKeys) : [];
        this.setData({
            ...params,
            config,
            themeColor,
            globalData: app.globalData,
            subKeys
        }, () => {
            this.loadData();
        });
    },

    async loadData() {
        const { order_no } = this.data;
        let data = {};
        let requestData = {};
        if (order_no) {
            requestData.order_no = order_no;
        }

        let { order, config } = await api.hei.fetchOrder(requestData);
        this.loadPaymentInfo();

        const NOW_TIME = Math.round(Date.now() / 1000);
        /**
		 * 拼团支付过期时间 1h
		 * 普通订单支付过期时间 12h
		 */
        const EXPIRED_TIME = order.groupon_id
            ? Number(order.time) + 60 * 60
            : Number(order.time) + 12 * 60 * 60;

        const timeLimit = (EXPIRED_TIME - NOW_TIME) * 1000;
        order.timeLimit = timeLimit > 0 ? timeLimit : 0;
        console.log('timeLimit', order.timeLimit);

        const statusCode = Number(order.status);
        order.statusText = valueToText(ORDER_STATUS_TEXT, statusCode);
        order.statusCode = statusCode;

        data.order = order;
        data.config = config;
        data.amount = order.amount;
        data.transfer_image = order.transfer_images && order.transfer_images[0];
        data.exchange_info = order.exchange_info || {};

        this.setData({ ...data });
    },

    async loadPaymentInfo() {
        let { transfers } = await api.hei.getShopRule({ key: 'transfers' });
        this.setData({ transfers, isLoading: false });
    },

    onClick(event) {
        console.log('event', event);
        let activeIndex = event.detail.index;
        this.setData({ activeIndex });
    },

    async onUpload() {
        const { tempFilePaths } = await chooseImage({ count: 1 });
        wx.showLoading({ title: '上传中', mask: true });
        try {
            const data = await api.hei.upload({ filePath: tempFilePaths[0] });
            wx.hideLoading();
            const { url, errcode, errmsg } = JSON.parse(data);
            if (errcode) {
                wx.showModal({
                    title: '温馨提示',
                    content: errmsg,
                    showCancel: false
                });
            } else {
                this.setData({ transfer_image: url });
                wx.showToast({ title: '上传成功', icon: 'success' });
            }
        } catch (err) {
            wx.hideLoading();
            console.log(err);
        }

    },

    onDeleteImage() {
        this.setData({ transfer_image: '' });
    },

    previewImage(ev) {
        const { image } = ev.currentTarget.dataset;
        wx.previewImage({
            urls: [image],
        });
    },

    async onSubmit() {
        const { transfer_image, order_no, transfers, activeIndex, subKeys } = this.data;
        if (!transfer_image) {
            wx.showModal({
                title: '温馨提示',
                content: '请上传您的支付凭证',
                showCancel: false
            });
            return;
        }

        if (!(transfers && transfers.length)) {
            return;
        }

        subKeys.push({ key: 'order_pay_audited' });

        await subscribeMessage(subKeys);

        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认提交付款凭证？',
            confirmText: '我确定',
            cancelText: '再检查',
            mask: true
        });

        if (confirm) {
            try {
                let args = {
                    transfer_images: JSON.stringify([transfer_image]),
                    order_no,
                    transfer_id: transfers[activeIndex].id
                };
                const data = await api.hei.paymentCheck({ ...args });
                const { errcode } = data;
                if (errcode === 0) {
                    const { confirm } = await showModal({
                        title: '温馨提示',
                        content: '提交成功',
                        showCancel: false,
                        mask: true
                    });
                    if (confirm) {
                        wx.redirectTo({
                            url: `/pages/orderDetail/orderDetail?id=${order_no}`
                        });
                    }
                }
                else {
                    throw new Error(`错误代码：${errcode}`);
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }

    },

    async setClipboardVp(e) {
        const { value } = e.currentTarget.dataset;
        console.log(e);
        await proxy.setClipboardData({ data: String(value) });
        wx.showToast({
            title: '复制成功',
            icon: 'success'
        });
    },

    onReload(e) {
        console.log(e, '倒计时结束');
        this.loadData();
    },
});
