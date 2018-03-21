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
	},

	methods: {
		async onPayOrder() {
			const { orderNo, orderIndex } = this.data;
			const { status,pay_sign,pay_appid } = await api.hei.payOrder({
				order_nos: JSON.stringify([orderNo])
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
				console.log('自主支付')
				wx.hideLoading();
				await wxPay(pay_sign);
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
				});
			}
			else if (pay_appid) {
				console.log('平台支付')
				 wx.navigateToMiniProgram({
					appId: pay_appid,
				  	path: `/pages/peanutPay/index?order_no=${orderNo}`,
				  	extraData: {
				    	order_no: orderNo
				  	},
				  	envVersion: 'develop',
					success(res) {
					    console.log('success: ' + res.errMsg)
					},
					fail(res) {
						console.log('fail: ' + res.errMsg)	
					},
					complete(res) {
						console.log('complete: ' + res.errMsg)	
					}
					

				})
				
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
						order_no: orderNo
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
				content: '确定关闭订单？'
			});
			if (confirm) {
				const { orderNo, orderIndex } = this.data;
				try {
					await api.hei.closeOrdery({
						order_no: orderNo
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
				url: `/pages/refund/refund?id=${orderNo}`
			});
		},
	}
});
