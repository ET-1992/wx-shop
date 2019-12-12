import proxy from 'utils/wxProxy';
import api from 'utils/api';
import { wxPay } from 'utils/pageShare';
import { getAgainUserForInvalid, go } from 'utils/util';

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
        }
    },

    attached() {
        const { isIphoneX } = app.systemInfo;
        this.setData({ isIphoneX });
    },

    methods: {
        async onPayOrder() {
            const { orderNo, orders, orderIndex, order } = this.data;
            const currentOrder = order.order_no ? order : orders[orderIndex];
            const { status, pay_sign, pay_appid } = await api.hei.payOrder({
                order_nos: JSON.stringify([orderNo]),
            });

            wx.hideLoading();

            if (this.data.orderPrice <= 0) {
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${orderNo}&isFromCreate=true`,
                });
            }

            // if (+status === 2) {

            // 	wx.redirectTo({
            // 		url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
            // 	});
            // }

            if (pay_sign) {
                console.log('orderOperations: 自主支付');

                await wxPay(pay_sign, orderNo);
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
                });
            }
            else if (pay_appid) {
                try {
                    console.log('orderOperations: 平台支付');
                    console.log(order);
                    const address = {
                        userName: currentOrder.receiver_name,
                        receiver_phone: currentOrder.receiver_phone,
                        provinceName: currentOrder.receiver_state,
                        cityName: currentOrder.receiver_city,
                        countyName: currentOrder.receiver_district,
                        detailInfo: currentOrder.receiver_address,
                    };

                    console.log(this.data);

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
                                    items: currentOrder.items,
                                    totalPrice: currentOrder.amount,
                                    totalPostage: currentOrder.postage,
                                    coinPrice: currentOrder.coins_fee,
                                    orderPrice: currentOrder.amount,
                                    buyerMessage: currentOrder.buyerMessage,
                                    couponPrice: currentOrder.coupon_discount_fee,
                                }
                            }
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        },

        async onConfirmOrder() {
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
        },

        async onCloseOrder() {
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
        },

        async onRefund() {
            const { orderNo } = this.data;
            wx.redirectTo({
                url: `/pages/refund/refund?id=${orderNo}`,
            });
        },

        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            console.log('来到支付这里');
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            if (user) {
                this.onPayOrder();
            }
        },

        /* 电话客服 */
        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },

        go
    },
});
