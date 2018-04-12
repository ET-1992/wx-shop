import api from 'utils/api';
import { STATUS_TEXT, USER_KEY } from 'constants/index';
import { formatTime } from 'utils/util';
import getRemainTime from 'utils/getRemainTime';

// const app = getApp();

const formatConfirmTime = (seconds) => {
	let remainSeconds = seconds;
	const day = Math.floor(remainSeconds / (24 * 60 * 60));
	remainSeconds = remainSeconds % (24 * 60 * 60);
	const hour = Math.floor(remainSeconds / (60 * 60));
	remainSeconds = remainSeconds % (60 * 60);
	const minute = Math.floor(remainSeconds / 60);
	const second = remainSeconds % 60;
	const unit = ['天', '时', '分', '秒'];
	const dateStr = [day, hour, minute, second].reduce((str, value, index) => {
		let dateStr = str;
		if (value) {
			dateStr = dateStr + value + unit[index];
		}
		return dateStr;
	}, '');
	return { remainTime: dateStr, remainSecond: seconds };
};

Page({
	data: {
		order: {},
		groupon: {},
		logistics: {},

		isLoading: false,
	},

	async loadOrder(id) {
		const { order } = await api.hei.fetchOrder({ order_no: id });
		const data = { order };
		const statusCode = +order.status;

		order.statusText = STATUS_TEXT[statusCode];
		order.statusCode = statusCode;
		order.buyer_message = order.buyer_message || '买家未留言';
		order.createDate = formatTime(new Date(order.time * 1000));
		order.payDate = formatTime(new Date(order.paytime * 1000));
		order.consignDate = formatTime(new Date(order.consign_time * 1000));
		order.refundDate = formatTime(new Date(order.refund_time * 1000));
		order.total_fee = (order.total_fee - 0).toFixed(2);
		order.discount_fee = (order.discount_fee - 0).toFixed(2);
		
		console.log(order.logistics_info);
		if (statusCode > 2 && statusCode < 5) {
			data.logistics = order.logistics_info
		
		}

		if (statusCode === 3) {
			const { remainTime, remainSecond } = formatConfirmTime(order.auto_confirm_in_seconds);
			data.remainTime = remainTime;
			data.remainSecond = remainSecond;
		}

		if (statusCode === 10) {
			const { time_expired } = order.groupon;
			const now = Math.round(Date.now() / 1000);
			const remainSecond = time_expired - now;
			data.remainSecond = remainSecond;
			data.remainTime = getRemainTime(remainSecond).join(':');
			console.log(data);
		}
		else {
			wx.hideShareMenu();
		}

		this.setData(data);
		console.log('测试',data)
		const {items} = order;
		let totalPrice = 0;
		items.forEach((item) => {
			const {
				price,
				quantity
			} = item;
			totalPrice = totalPrice + price * quantity;
			console.log(totalPrice)
		});
		this.setData({totalPrice:totalPrice})
	},
	async loadGroupon(id) {
		console.log('grouponId', id);
		const data = await api.hei.fetchGroupon({ id });
		const { time_expired } = data.groupon;
		const now = Math.round(Date.now() / 1000);
		const remainSecond = time_expired - now;
		data.remainSecond = remainSecond;
		data.remainTime = getRemainTime(remainSecond).join(':');
		this.setData(data);
	},

	countDown() {
		const { remainSecond } = this.data;
		if (remainSecond) {
			this.intervalId = setInterval(() => {
				const { remainSecond } = this.data;
				this.setData({
					remainSecond: remainSecond - 1,
					remainTime: getRemainTime(remainSecond - 1).join(':')
				});
			}, 1000);
		}
	},

	// async onLoad ({ id, grouponId }) {
	// 	this.setData({ isLoading: true });
	// 	console.log(id)
	// 	if (id) {
	// 		await this.loadOrder(id);
	// 	}
	// 	else {
	// 		await this.loadGroupon(grouponId);
	// 	}
	// 	this.setData({ isLoading: false });
	// 	this.countDown();
	// },
	async onShow() {
		const { id, grouponId } = this.options;
		this.setData({ isLoading: true });
		if (id) {
			await this.loadOrder(id);
		}
		else {
			await this.loadGroupon(grouponId);
		}
		this.setData({ isLoading: false });
		this.countDown();
	},
	
	onUnload() {
		clearInterval(this.intervalId);
	},

	onShare() {
		console.log('onShare');
		wx.showShareMenu();
	},

	onJoin() {
		const { groupon, order } = this.data;
		const id = groupon.post_id || order.items[0].post_id;
		const grouponId = groupon.id || order.groupon.id;
		console.log('id');
		wx.navigateTo({
			url: `/pages/productDetail/productDetail?id=${id}&grouponId=${grouponId}`
		});
	},

	onRelaodOrder(ev) {
		const { orderNo } = ev.detail;
		wx.redirectTo({
			url: `/pages/orderDetail/orderDetail?id=${orderNo}`
		});
	},

	onShareAppMessage() {
		const { nickname } = wx.getStorageSync(USER_KEY);
		const { groupon = {}, order = {} } = this.data;
		const grouponId = groupon.id || order.groupon_id;
		let shareMsg = {
			title: '小嘿店',
			path: '/pages/home/home',
			imageUrl: groupon.image_url || (order.items && order.items[0].image_url)
		};
		// if (grouponId && (order.statusCode === 10 || groupon.status === 2)) {
		if (order.id || groupon.status === 2) {
			shareMsg = {
				title: `${nickname}邀请你一起拼团`,
				path: `/pages/orderDetail/orderDetail?grouponId=${grouponId}`,
				imageUrl: groupon.image_url || order.groupon.image_url
			};
		}
		console.log(shareMsg);
		return shareMsg;
	}
});
