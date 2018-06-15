import { showModal, showToast } from 'utils/wxp';
import api from 'utils/api';
import { wxPay } from 'utils/pageShare';

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

				await wxPay(pay_sign);

				// wx.redirectTo({
				// 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				// });
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
					await wx.navigateToMiniProgram({
						envVersion: 'release',
						appId: pay_appid,
						path: `/pages/peanutPay/index?order_no=${orderNo}`,
						extraData: {
							address,
							order_no: orderNo,
							items: currentOrder.items,
							totalPrice: currentOrder.amount,
							totalPostage: currentOrder.postage,
							// quantity: currentOrder.quantity,
							orderPrice: currentOrder.orderPrice,
							coupons: currentOrder.coupons,
							buyerMessage: currentOrder.buyerMessage,
							couponPrice: currentOrder.couponPrice,
						},
						fail(res) {
							wx.redirectTo({
								url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
							});
							console.log('navigateToMiniProgram fail: ' + res);
						},
					});
				}
				catch (err) {
					console.log(err);
				}

				// wx.redirectTo({
				// 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				// });
			}

			// else {
			// 	wx.redirectTo({
			// 		url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
			// 	});
			// }

			wx.redirectTo({
				url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
			});
		},

		async onConfirmOrder() {
			const { confirm } = await showModal({
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
					showModal({
						title: '收货失败',
						content: err.errMsg,
						showCancel: false,
					});
				}
			}
		},

		async onCloseOrder() {
			const { confirm } = await showModal({
				title: '温馨提示',
				content: '确定关闭订单？',
			});
			if (confirm) {
				const { orderNo, orderIndex } = this.data;
				try {
					await api.hei.closeOrdery({
						order_no: orderNo,
					});
					await showToast({
						title: '已成功关闭订单',
					});
					this.triggerEvent('closeOrder', { orderNo, orderIndex });
				}
				catch (err) {
					showModal({
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
	},
});
