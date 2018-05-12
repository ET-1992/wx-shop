import { PRODUCT_LIST_STYLE, USER_KEY } from 'constants/index';
import api from 'utils/api';

Page({
	data: {
		title: 'redpacket',
		productListStyle: PRODUCT_LIST_STYLE[1],
		redpacket: {},
		products: [],
	},

	async onLoad({ id }) {
		const { errmsg, products = [], received_redpacket = {} } = await api.hei.receiveRedpacket({ packet_no: id });
		received_redpacket.item.reduceValue = +received_redpacket.item.reduce_cost;
		this.setData({
			isFinished: !!errmsg,
			// isFinished: true,
			products,
			redpacket: received_redpacket,
		});
	},

	onUse() {
		wx.switchTab({ url: '/pages/home/home' });
	},

	onShareAppMessage({ target }) {
		const { user = {} } = this.data.redpacket;
		const currentUser = wx.getStorageSync(USER_KEY);
		const { id } = this.options;
		const name = target === 'button' ? currentUser.nickname : user.nickname;

		return {
			title: `好友${name}给你发来了一个红包，快去领取吧`,
			path: `/pages/redpackek/redpackek?id=${id}`,
			imageUrl: '/icons/redpacketShare.jpg'
		}
	}
});
