import api from 'utils/api';
import { STATUS_TEXT } from 'constants/index';
// 获取全局应用程序实例对象
// const app = getApp()

Page({
	data: {
		title: 'orderList',
		orders: [],
		next_cursor: 0,

		activeIndex: 0,
		isRefresh: true,
		status: [
			{ name: '全部', value: null },
			{ name: '待付款', value: '1' },
			{ name: '待成团', value: '10' },
			{ name: '待发货', value: '2' },
			{ name: '待收货', value: '3' },
			{ name: '已完成', value: '5' },

		],
		selectedStatus: null,
		clientX: 0,
		clientX_move: 0
	},

	async loadOrders() {
		const { next_cursor, isRefresh, orders, selectedStatus } = this.data;
		const queryOption = { next_cursor };
		if (selectedStatus) {
			queryOption.status = selectedStatus;
		}
		if (isRefresh) {
			wx.showLoading();
		}
		const data = await api.hei.fetchOrderList(queryOption);
		const formatedOrders = data.orders.map((order) => {
			const statusCode = +order.status;
			order.statusCode = statusCode;
			order.statusText = STATUS_TEXT[+order.status];
			order.productCount = order.items.reduce((count, item) => {
				return count + +item.quantity;
			}, 0);
			return order;
		});
		const newOrders = isRefresh ? formatedOrders : orders.concat(formatedOrders);
		this.setData({
			orders: newOrders,
			isRefresh: false,
			next_cursor: data.next_cursor,
		});

		wx.hideLoading();
		return data;
	},

	onStautsItemClick(ev) {
		const { value } = ev.currentTarget.dataset;
		console.log(ev.currentTarget.dataset.value)
		console.log(this.data)
		if (value === this.data.activeId) { return; }
		this.setData({
			selectedStatus: value,
			activeIndex: this.getIndex(value),
			isRefresh: true,
		});
		this.loadOrders();
	},

	async onLoad({ status }) {
		// const selectedStatus = status || '1,2,3';
		const state = status ? status : null;
		var index = this.getIndex(state);
		this.setData({ selectedStatus: state,activeIndex: index });
		this.loadOrders();
	},

	async onPullDownRefresh() {
		this.setData({ isRefresh: true, next_cursor: 0 });
		await this.loadOrders();
		wx.stopPullDownRefresh();
	},

	async onReachBottom() {
		const { next_cursor } = this.data;
		if (!next_cursor) { return; }
		this.loadOrders();
	},

	onConfirmOrder(ev) {
		const { orderNo, orderIndex } = ev.detail;
		const updateData = {};
		updateData[`orders[${orderIndex}].statusCode`] = 4;
		updateData[`orders[${orderIndex}].status`] = 4;
		updateData[`orders[${orderIndex}].statusText`] = STATUS_TEXT[4];
		this.setData(updateData);
	},

	getIndex(value){
		var index = 0;
		switch (value) {
			case null:
				index=0
				break;
			case '1':
				index=1
				break;
			case '10':
				index=2
				break;
			case '2':
				index=3
				break;
			case '3':
				index=4
				break;
					break;
		}
		return index;
	},

	onPayOrder(ev) {
		const { orderNo, orderIndex } = ev.detail;
		const updateData = {};
		updateData[`orders[${orderIndex}].statusCode`] = 2;
		updateData[`orders[${orderIndex}].status`] = 2;
		updateData[`orders[${orderIndex}].statusText`] = STATUS_TEXT[2];
		this.setData(updateData);
	},

	onTouchStart(e) {
		this.data.clientX = e.touches[0].clientX;
	},

	onTouchMove(e){
		this.data.clientX_move = e.touches[0].clientX;
	},

	onTouchEnd(e) {
		var val,idx;
		if(this.data.clientX_move - this.data.clientX > 30) { // prev
			if(this.data.activeIndex === 0) {
				idx = this.data.status.length- 1
				val = this.data.status[idx].value
				this.setData({ selectedStatus:val ,activeIndex: idx,isRefresh: true });
			}else {
				idx = this.data.activeIndex - 1
				val = this.data.status[idx].value
				this.setData({ selectedStatus:val ,activeIndex: idx,isRefresh: true });
			}
			this.loadOrders();
		}

		if(this.data.clientX_move - this.data.clientX < -30) {
			if(this.data.activeIndex === (this.data.status.length- 1)) {
				val = this.data.status[0].value
				this.setData({ selectedStatus:val ,activeIndex: 0,isRefresh: true});
			}else {
				idx = this.data.activeIndex + 1
				val = this.data.status[idx].value
				this.setData({ selectedStatus:val ,activeIndex: idx,isRefresh: true});
			}
			this.loadOrders();
		}

	},

	onCloseOrder(ev) {
		const { orderNo, orderIndex } = ev.detail;
		console.log(orderIndex);
		const updateData = {};
		updateData[`orders[${orderIndex}].statusCode`] = 7;
		updateData[`orders[${orderIndex}].status`] = 7;
		updateData[`orders[${orderIndex}].statusText`] = STATUS_TEXT[7];
		this.setData(updateData);
	},
});
