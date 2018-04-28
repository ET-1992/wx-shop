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
			const { orderNo, orderIndex, orders, order } = this.data;
			const { status, pay_sign, pay_appid } = await api.hei.payOrder({
				order_nos: JSON.stringify([orderNo]),
			});

			// console.log(payRes);

			// await showToast({ title: '支付成功' });
			if (status == 2) {
				wx.hideLoading();
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				});
			}
			else if (pay_sign) {
				console.log('自主支付2');
				wx.hideLoading();
				await wxPay(pay_sign);
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				});
			}
			else if (pay_appid) {
				console.log('平台支付2');

				if (orders.length < 1) {
					this.setData({
						orderList: order,
					});
				}
				else {
					this.setData({
						orderList: orders[orderIndex],
					});
				}

				// console.log('外面',orderList);
				const address = {
					userName: this.data.orderList.receiver_name,
					receiver_phone: this.data.orderList.receiver_phone,
					provinceName: this.data.orderList.receiver_state,
					cityName: this.data.orderList.receiver_city,
					countyName: this.data.orderList.receiver_district,
					detailInfo: this.data.orderList.receiver_address,
				};
				console.log(this.data);
				wx.navigateToMiniProgram({
					appId: pay_appid,
					path: `/pages/peanutPay/index?order_no=${orderNo}`,
					extraData: {

						// order_no: orderNo,
						address: address,
						items: this.data.orderList.items,
						totalPrice: this.data.orderList.amount,
						totalPostage: this.data.orderList.postage,
						quantity: this.data.orderList.quantity,
						orderPrice: this.data.orderList.orderPrice,
						coupons: this.data.orderList.coupons,
						buyerMessage: this.data.orderList.buyerMessage,
						couponPrice: this.data.orderList.couponPrice,
						orderPrice: this.data.orderList.amount,
					},
					envVersion: 'release',
					success(res) {
						console.log('success: ' + res.errMsg);
					},
					fail(res) {
						console.log(res);
						wx.redirectTo({
							url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
						});
						console.log('fail: ' + res.errMsg);
					},
					complete(res) {
						console.log('complete: ' + res.errMsg);
					},
				});

				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				});
			}
			else {
				wx.hideLoading();
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				});
			}

			// wx.redirectTo({
			// 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`
			// });
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

			// const { orderNo, orderIndex } = this.data;
			// try {
			// 	await api.hei.confirmOrder({
			// 		order_no: orderNo
			// 	});
			// 	await showToast({ title: '确认收货成功' });
			// 	// wx.redirectTo({
			// 	// 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`
			// 	// });
			// 	this.triggerEvent('confirmOrder', { orderNo, orderIndex });
			// }
			// catch (err) {
			// 	showModal({
			// 		title: '确认收货失败',
			// 		content: err.errMsg,
			// 		showCancel: false,
			// 	});
			// }
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

			// this.triggerEvent('refund', orderNo);
			wx.redirectTo({
				url: `/pages/refund/refund?id=${orderNo}`,
			});
		},
	},
});
