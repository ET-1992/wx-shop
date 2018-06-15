import { PRODUCT_LIST_STYLE, USER_KEY } from 'constants/index';
import api from 'utils/api';
import { showToast } from 'utils/wxp';
const app = getApp();
Page({
	data: {
		title: 'redpacket',
		productListStyle: PRODUCT_LIST_STYLE[1],
		redpacket: {},
		products: [],
		hasRecived: false,
		isFinished: false,
	},

	async loadRepacket() {
		const { isIphone5 } = app.systemInfo;
		const { id } = this.options;
		const { products = [], received_redpacket, shared_redpacket } = await api.hei.fetchRedpacket({ packet_no: id });
		console.log(products);
		// const { stock_qty } = shared_redpacket;
		if (received_redpacket) {
			received_redpacket.item.reduceValue = +received_redpacket.item.reduce_cost;
		}
		this.setData({
			products,
			redpacket: received_redpacket,
			hasRecived: !!received_redpacket,
			isIphone5,
			goldNumer: parseInt(received_redpacket.item.amount*100)
		});
		console.log('--loadRepacket()--');
		console.log(this.data);
	},

	async onRecive() {
		// wx.showLoading();
		const { id } = this.options;
		const res = await api.hei.receiveRedpacket({ packet_no: id });
		// wx.hideLoading();
		if (res) {
			const { errmsg, products = [], received_redpacket = {} } = res;
			received_redpacket.item.reduceValue = +received_redpacket.item.reduce_cost;

			if (errmsg) {
				await showToast({ title: errmsg });
			}
			else {
				await showToast({ icon: 'success', title: '领取成功' });
			}
			this.setData({
				isFinished: !!errmsg,
				hasRecived: true,
				// isFinished: true,
				products,
				redpacket: received_redpacket,
				goldNumer: parseInt(received_redpacket.item.amount*100)
			});
			console.log('--onRecive()--');
			console.log( this.data );
		}

	},

	async onShow() {
		await this.loadRepacket();
	},

	onUse() {
		wx.switchTab({ url: '/pages/home/home' });
	},

	// async reLoad() {
	// 	await this.loadRepacket();
	// },

	onShareAppMessage({ target }) {
		const { user = {} } = this.data.redpacket;
		const currentUser = wx.getStorageSync(USER_KEY);
		const { id } = this.options;
		const name = target === 'button' ? currentUser.nickname : user.nickname;

		return {
			title: `好友${name}给你发来了一个红包，快去领取吧`,
			path: `/pages/redpacket/redpacket?id=${id}`,
			imageUrl: '/icons/redpacketShare.jpg'
		}
	},
	
});
