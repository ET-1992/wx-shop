import api from 'utils/api';
import { formatTime } from 'utils/util';
import { showToast, chooseImage } from 'utils/wxp';

const app = getApp();

Page({
	data: {
		order: {
			items: [],
		},

		refundImages: [],
		isAllSelected: false,
		selectedRefundType: null,
		refundReason: '',
	},

	// onItemSelect(ev) {
	// 	const { index } = ev.currentTarget.dataset;
	// 	const updateData = {};
	// 	const key = `order.items[${index}].isSelected`;
	// 	const { items } = this.data.order;

	// 	updateData[key] = true;

	// 	this.setData(updateData);

	// 	const selectdItems = items.filter(item => item.isSelected);
	// 	if (selectdItems.length === items.length) {
	// 		this.setData({ isAllSelected: true });
	// 	}

	// 	// this.calculatePrice();
	// },

	onHandleItemSelect(ev) {
		const { index } = ev.currentTarget.dataset;
		const key = `order.items[${index}].isSelected`;
		const { items } = this.data.order;
		const { isSelected } = items[index];
		const updateData = isSelected ? { isAllSelected: false } : {};

		updateData[key] = !isSelected;

		this.setData(updateData);

		if (!isSelected) {
			const selectdItems = items.filter((item) => item.isSelected);
			if (selectdItems.length === items.length) {
				this.setData({ isAllSelected: true });
			}
		}

		// this.calculatePrice();
	},

	// onItemUnSelect(ev) {
	// 	const { index } = ev.currentTarget.dataset;
	// 	const updateData = { isAllSelected: false };
	// 	const key = `order.items[${index}].isSelected`;
	// 	updateData[key] = false;
	// 	this.setData(updateData);
	// 	// this.calculatePrice();
	// },

	onSelectAll() {
		const { isAllSelected } = this.data;
		const { items } = this.data.order;
		const newItems = items.map((item) => {
			item.isSelected = !isAllSelected;
			return item;
		});
		this.setData({
			'order.items': newItems,
			isAllSelected: !isAllSelected
		});
		// this.calculatePrice();
	},

	async onLoad({ id }) {
		const { themeColor } = app.globalData;
		this.setData({ themeColor });

		const { order } = await api.hei.fetchOrder({ order_no: id });
		order.formatTime = formatTime(new Date(order.time * 1000));
		// const { orderDetail } = app.globalData;
		this.setData({ order });
	},

	onRefundTypeSelect(ev) {
		const { type } = ev.currentTarget.dataset;
		this.setData({ selectedRefundType: type });
	},

	async onUpload () {
		const { refundImages } = this.data;
		const { tempFilePaths } = await chooseImage({
			count: 1
		});
		try {
			const data = await api.hei.upload({
				filePath: tempFilePaths[0]
			});
			const { url } = JSON.parse(data);
			refundImages.push(url);
			this.setData({ refundImages });
		}
		catch (err) {
			console.log(err);
		}

	},

	onInput(ev) {
		const { value } = ev.detail;
		this.setData({ refundReason: value });
	},

	async onRefund() {
		const { order, selectedRefundType, refundReason, refundImages } = this.data;
		const { items, order_no } = order;
		const selectdItems = items.filter((item) => item.isSelected);
		console.log('selectedRefundType', selectedRefundType);
		try {
			if (!selectdItems.length) {
				throw new Error('必须选择退款商品');
			}
			else if (selectedRefundType !== 0 && selectedRefundType !== 1) {
				throw new Error('必须选择退款类型');
			}
			else if (!refundReason) {
				throw new Error('必须填写退款原因');
			}
			else {
				const itemsId = selectdItems.map((item) => item.id);
				const data = await api.hei.refund({
					order_no,
					items: JSON.stringify(itemsId),
					reason: refundReason,
					type: selectedRefundType,
					images: refundImages
				});
				const { result, errcode } = data;
				if (result) {
					await showToast({
						title: '提交成功',
					});
					wx.redirectTo({
						url: `/pages/orderDetail/orderDetail?id=${order_no}`
					});
				}
				else {
					throw new Error(`错误代码：${errcode}`);
				}
			}
		}
		catch (err) {
			console.log(err.message);
			wx.showModal({
				title: '提交失败',
				content: err.message || err.errMsg,
				showCancel: false
			});
		}
	},

	onDeleteImage(ev) {
		const { index } = ev.currentTarget.dataset;
		const { refundImages } = this.data;
		refundImages.splice(index, 1)
		this.setData({ refundImages });
	}

	// onUnload() {
	// 	app.globalData.orderDetail = { items: [] };
	// }
});
