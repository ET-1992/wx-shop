import api from 'utils/api';
import { showModal } from 'utils/wxp';
import getToken from 'utils/getToken';
import login from 'utils/login';
import { cloneDeep } from 'lodash';

const app = getApp();

// 创建页面实例对象
Page({

	// 页面的初始数据
	data: {
		items: [],

		isAllSelected: false,
		totalPrice: 0,
		savePrice: 0,
		postagePrice: 0,
		isLoading: false,
		isLogin: false,
		nowTS: Date.now() / 1000,
		// timestamp: (+new Date() / 1000) | 0,
	},

	calculatePrice() {
		const { items, nowTS } = this.data;
		const now = Date.now() / 1000;
		let totalPrice = 0;
		let savePrice = 0;
		let postagePrice = 0;
		items.forEach((item) => {
			if (item.isSelected) {

				// (item.miaosha_end_timestamp  - timestamp > 0) ? item.miaosha_price : item.price
				const {
					price,
					original_price,
					quantity,
					postage,
					miaosha_end_timestamp,
					miaosha_start_timestamp,
					miaosha_price,
				} = item;

				const isMiaoshaStart = nowTS >= miaosha_start_timestamp;
				const isMiaoshaEnd = nowTS >= miaosha_end_timestamp;

				const _price = !isMiaoshaEnd && isMiaoshaStart ? miaosha_price : price;
				const discountFee = (original_price - _price) * quantity;


				totalPrice = totalPrice + _price * quantity;
				savePrice = savePrice + discountFee;
				postagePrice = postage > postagePrice ? postage : postagePrice;
				console.log(savePrice);
			}
		});

		totalPrice = totalPrice.toFixed(2);
		savePrice = savePrice.toFixed(2);
		postagePrice = postagePrice.toFixed(2);

		this.setData({ totalPrice, savePrice, postagePrice });
	},

	async loadCart() {
		this.setData({ isLoading: true });
		const data = await api.hei.fetchCartList();
		if (data.items && data.items.length) {
			data.items.map((item) => {
				item.isSelected = true;
				return item;
			});
		}

		const cartList = wx.getStorageSync('cartList');
		let isTrue = true;

		if (cartList) {
			for (let i = 0; i < cartList.length; i++) {
				data.items.map((item) => {
					if (cartList[i].id === item.id) {
						if (cartList[i].isSelected !== true) isTrue = false;
						Object.assign(item, { isSelected: cartList[i].isSelected });
					}
				});
			}
		}

		this.setData({
			isAllSelected: isTrue,
			totalPrice: 0,
			savePrice: 0,
			postagePrice: 0,
			...data,
		});
		this.setData({ isLoading: false });
		this.calculatePrice();
	},

	async onShow() {
		const token = getToken();

		if (token) {
			this.setData({ isLogin: true });
			await this.loadCart();
		}
		else {
			this.setData({ isLogin: false });
		}
	},

	async onLogin() {
		const { user } = await login();
		if (user.openid) {
			this.setData({ isLogin: true });
			await this.loadCart();
		}
	},

	onHandleItemSelect(ev) {
		const { index } = ev.currentTarget.dataset;
		const key = `items[${index}].isSelected`;
		const { items } = this.data;
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
		this.saveCartAction();
		this.calculatePrice();
	},

	// onItemUnSelect(ev) {
	// 	const { index } = ev.currentTarget.dataset;
	// 	const updateData = { isAllSelected: false };
	// 	const key = `items[${index}].isSelected`;
	// 	updateData[key] = false;
	// 	this.setData(updateData);
	// 	this.calculatePrice();
	// },

	onSelectAll() {
		const { isAllSelected } = this.data;
		const { items } = this.data;
		const newItems = items.map((item) => {
			item.isSelected = !isAllSelected;
			return item;
		});
		this.setData({
			items: newItems,
			isAllSelected: !isAllSelected,
		});
		this.saveCartAction();
		this.calculatePrice();
	},

	async updateCart({ detail }) {
		const { items } = this.data;
		const { vendor } = app.globalData;
		const { value, postId, skuId } = detail;
		const data = await api.hei.updateCart({
			post_id: postId,
			sku_id: skuId,
			quantity: value,
			vendor,
		});
		const index = items.findIndex((item) => item.post_id === postId && item.sku_id === skuId);
		const updateData = {};
		const quantitykey = `items[${index}].quantity`;
		updateData[quantitykey] = value;
		this.setData(updateData);
		this.calculatePrice();
		// this.onItemSelect({
		// 	currentTarget: {
		// 		dataset: {
		// 			index,
		// 		},
		// 	},
		// });
		console.log(data);
	},

	async onDelete(ev) {
		const { items } = this.data;
		const { postId, skuId, index } = ev.currentTarget.dataset;
		const { confirm } = await showModal({
			title: '温馨提示',
			content: '确认删除商品？',
			confirmText: '删除',
			confirmColor: '#dc143c',
		});
		if (confirm) {
			await api.hei.removeCart({
				post_id: postId,
				sku_id: skuId,
			});
			wx.showToast({
				title: '成功删除',
			});
			items.splice(index, 1);
			this.setData({ items });
		}
		this.calculatePrice();
		this.saveCartAction();
	},

	async onClearCart() {
		const { confirm } = await showModal({
			title: '温馨提示',
			content: '确认清空购物车？',
			confirmText: '清空',
			confirmColor: '#dc143c',
		});
		if (confirm) {
			await api.hei.clearCart();
			wx.showToast({
				title: '成功清空购物车',
			});
			this.setData({ items: [] });
			this.calculatePrice();
		}
	},

	onCreateOrder() {
		const { items } = this.data;
		const selectdItems = items.filter((item) => item.isSelected);
		this.data.items = selectdItems; // 不需要更新UI,直接赋值即可
		app.globalData.currentOrder = this.data;
		app.globalData.currentOrder = cloneDeep(this.data);
		wx.navigateTo({
			url: '/pages/orderCreate/orderCreate',
		});
	},

	saveCartAction() {
		const { items } = this.data;
		wx.setStorageSync('cartList', items);
	},
});
