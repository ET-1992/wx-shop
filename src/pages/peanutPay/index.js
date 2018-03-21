import api from 'utils/api';
import { chooseAddress, showModal, getSetting, openSetting } from 'utils/wxp';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY } from 'constants/index';

const app = getApp();

Page({

	data: {
		orderNo: ''
	},

	onLoad: function (options) {
		console.log('pay on load')
		console.log(options)
		this.setData({orderNo:options.order_no})
		console.log(this.data)
	},

	async onShow() {
		
		const { orderNo } = this.data;
		try {
			console.log(orderNo)
			const { pay_sign } = await api.hei.peanutPayOrder({
				order_no: orderNo
			});
			
			await wxPay(pay_sign);
			wx.navigateBackMiniProgram({
				extraData: {
					order_no: this.data.orderNo
				},
				success(res) {

				}
			})
		}catch(err) {
			console.log(err)
		}
		
	}
});