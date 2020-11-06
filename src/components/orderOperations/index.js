import proxy from 'utils/wxProxy';
import api from 'utils/api';
import { wxPay } from 'utils/pageShare';
import { getAgainUserForInvalid, go, subscribeMessage } from 'utils/util';

const app = getApp();

Component({
    properties: {
        statusCode: {
            type: Number,
            value: 0,
        },
        orderNo: {
            type: String,
            value: '',
        },
        isShowContact: {
            type: Boolean,
            value: false,
        },
        isShowService: {
            type: Boolean,
            value: false,
        },
        isShowRefund: {
            type: Boolean,
            value: false,
        },
        orderIndex: {
            type: Number,
            value: 0,
        },
        orders: {
            type: Array,
            value: [],
        },
        order: {
            type: Object,
            value: {},
        },
        user: {
            type: Object,
            value: {},
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        },
        phone: {
            type: String,
            value: ''
        },
        config: {
            type: Object,
            value: {}
        }
    },

    attached() {
        const { isIphoneX } = app.systemInfo;
        this.setData({ isIphoneX });
    },

    methods: {
        async onPayOrder() {
            const { orderNo, orders, orderIndex, order, config } = this.data;
            const currentOrder = order.order_no ? order : orders[orderIndex];

            let subKeys = [{ key: 'order_consigned' }];
            if (currentOrder && currentOrder.groupon && currentOrder.groupon.id) {
                subKeys.push({ key: 'groupon_finished' });
            }

            if (config.cashier_enable) {
                wx.navigateTo({ url: `/pages/payCashier/payCashier?order_no=${orderNo}&subKeys=${JSON.stringify(subKeys)}` });
                return;
            }

            if (this.data.orderPrice <= 0) {
                await subscribeMessage(subKeys);
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${orderNo}&isFromCreate=true`,
                });
                return;
            }

            try {
                const { pay_sign, pay_appid } = await api.hei.payOrder({
                    order_nos: JSON.stringify([orderNo]),
                });

                wx.hideLoading();

                if (pay_sign) {
                    await wxPay(pay_sign, orderNo, subKeys);
                    wx.redirectTo({ url: `/pages/orderDetail/orderDetail?id=${orderNo}` });
                } else if (pay_appid) {
                    const {
                        receiver_name,
                        receiver_phone,
                        receiver_state,
                        receiver_city,
                        receiver_district,
                        receiver_address,
                        items,
                        amount,
                        postage,
                        coins_fee,
                        buyerMessage,
                        coupon_discount_fee
                    } = currentOrder;
                    const address = {
                        userName: receiver_name,
                        receiver_phone: receiver_phone,
                        provinceName: receiver_state,
                        cityName: receiver_city,
                        countyName: receiver_district,
                        detailInfo: receiver_address
                    };
                    this.setData({
                        modal: {
                            title: '温馨提示',
                            isShowModal: true,
                            body: '确定要支付当前订单吗？',
                            type: 'navigate',
                            navigateData: {
                                url: `/pages/peanutPay/index?order_no=${orderNo}`,
                                appId: pay_appid,
                                target: 'miniProgram',
                                version: 'develop',
                                extraData: {
                                    address,
                                    order_no: orderNo,
                                    items,
                                    totalPrice: amount,
                                    totalPostage: postage,
                                    coinPrice: coins_fee,
                                    orderPrice: amount,
                                    buyerMessage,
                                    couponPrice: coupon_discount_fee,
                                }
                            }
                        }
                    });
                }
            } catch (err) {
                wx.showModal({
                    title: '温馨提示',
                    content: err.errMsg,
                    showCancel: false
                });
            }
        },

        async onConfirmOrder(e) {
            const user = await this.bindGetUserInfo(e);
            if (user) {
                const { confirm } = await proxy.showModal({
                    title: '确定收货？',
                });
                if (confirm) {
                    const { orderNo, orderIndex } = this.data;
                    try {
                        await api.hei.confirmOrder({
                            order_no: orderNo,
                        });
                        this.triggerEvent('confirmOrder', { orderNo, orderIndex });
                    }
                    catch (err) {
                        wx.showModal({
                            title: '收货失败',
                            content: err.errMsg,
                            showCancel: false,
                        });
                    }
                }
            }
        },

        // 使用礼品卡
        async onUseCard(e) {
            const user = await this.bindGetUserInfo(e);
            if (!user) { return }
            wx.navigateTo({
                url: '/pages/giftCardDetail/giftCardDetail',
            });
        },

        async onCloseOrder(e) {
            const user = await this.bindGetUserInfo(e);
            if (user) {
                const { order, orders, orderNo, orderIndex } = this.data;
                console.log('order', order, 'orders', orders, 'orderIndex', orderIndex);
                let content = '确定关闭订单？';
                if ((orders && orders[orderIndex] && orders[orderIndex].promotion_type === '5') || (order.promotion_type === '5')) {
                    content = '机会只有一次，取消了就不能再下单了喔！';
                }

                const { confirm } = await proxy.showModal({
                    title: '温馨提示',
                    content: content
                });

                if (confirm) {
                    try {
                        await api.hei.closeOrdery({
                            order_no: orderNo,
                        });
                        wx.showToast({
                            title: '已成功关闭订单',
                        });
                        this.triggerEvent('closeOrder', { orderNo, orderIndex });
                    }
                    catch (err) {
                        wx.showModal({
                            title: '关闭订单失败',
                            content: err.errMsg,
                            showCancel: false,
                        });
                    }
                }
            }
        },

        async onRefund(e) {
            const user = await this.bindGetUserInfo(e);
            const { orderNo } = this.data;
            if (user) {
                wx.redirectTo({
                    url: `/pages/refund/refund?id=${orderNo}`,
                });
            }
        },
        async onPay(e) {
            const user = await this.bindGetUserInfo(e);
            if (user) {
                this.onPayOrder();
            }
        },

        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            console.log('授权');
            if (iv && encryptedData) {
                const user = await getAgainUserForInvalid({ encryptedData, iv });
                return user;
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '需授权后操作',
                    showCancel: false,
                });
            }
        },

        async toPaymentVouchersPage(e) {
            const { orderNo } = this.data;
            const user = await this.bindGetUserInfo(e);
            if (user) {
                wx.navigateTo({
                    url: `/pages/paymentVouchers/paymentVouchers?order_no=${orderNo}`,
                });
            }
        },

        /* 电话客服 */
        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },

        // 展示企业微信联系方式
        onCustomService() {
            let customServiceModal = true;
            this.setData({
                customServiceModal,
            });
        },

        go
    },
});
