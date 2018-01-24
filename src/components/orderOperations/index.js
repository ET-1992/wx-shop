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
			const { pay_sign } = await api.hei.payOrder({
				order_nos: JSON.stringify([orderNo])
			});
			// console.log(payRes);
			await wxPay(pay_sign);
			await showToast({ title: '支付成功' });
			// wx.redirectTo({
			// 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`
			// });
			this.triggerEvent('payOrder', { orderNo, orderIndex });
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
