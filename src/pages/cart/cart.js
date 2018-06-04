import api from 'utils/api';
import { showModal } from 'utils/wxp';
import getToken from 'utils/getToken';
import forceUserInfo from 'utils/forceUserInfo';
import { cloneDeep } from 'lodash';
import { CART_LIST_KEY } from 'constants/index';

const app = getApp();

// 创建页面实例对象
Page({

	// 页面的初始数据
	data: {
		items: [],

		isAllSelected: false,
		totalPrice: 0,
		savePrice: 0,
		totalPostage: 0,
		isLoading: false,
		isLogin: false,
		nowTS: Date.now() / 1000,
	},

	calculatePrice() {
		const { items, nowTS } = this.data;
		let totalPrice = 0;
		let savePrice = 0;
		let totalPostage = 0;
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
				totalPostage = postage > totalPostage ? postage : totalPostage;
				console.log(savePrice);
			}
		});
		totalPrice = totalPrice.toFixed(2);
		savePrice = savePrice.toFixed(2);
		totalPostage = totalPostage.toFixed(2);

		this.setData({ totalPrice, savePrice, totalPostage });
	},

	async loadCart() {
		var that = this;
		wx.getSystemInfo({
			success: function(res) {
				that.setData({
					phoneModel: res.model,
					isLoading: true
				});
				console.log('手机型号：' + that.data.phoneModel)
			}
		});
		const data = await api.hei.fetchCartList();
		let isAllSelected = true;

		// 初次默认全部选中, 再次进入读取storage的信息
		const cartList = wx.getStorageSync(CART_LIST_KEY);

		if (data.items && data.items.length) {
			data.items.forEach((item) => {
				const { id, status } = item;
				const cartListItem = cartList && cartList.find((listItem) => listItem.id === id);
				// item.status === 0 为售罄或者下架
				if (status === 0) {
					item.isSelected = false;
				}
				else {
					item.isSelected = cartListItem ? cartListItem.isSelected : true;
					if (!cartListItem.isSelected) {
						isAllSelected = false;
					}
				}
			});
		}

		// 初次默认全部选中
		// if (data.items && data.items.length) {
		// 	data.items.forEach((item) => {
		// 		item.isSelected = true;
		// 	});
		// }

		// 再次进入读取storage的信息
		// const cartList = wx.getStorageSync(CART_LIST_KEY);
		// let isTrue = true;

		// if (cartList) {
		// 	for (let i = 0; i < cartList.length; i++) {
		// 		data.items.map((item) => {
		// 			if (cartList[i].id === item.id) {
		// 				if (cartList[i].isSelected !== true) isTrue = false;
		// 				Object.assign(item, { isSelected: cartList[i].isSelected });
		// 			}
		// 		});
		// 	}
		// }

		this.setData({

			// totalPrice: 0,
			// savePrice: 0,
			// totalPostage: 0,
			isAllSelected,
			...data,
		});
		this.setData({ isLoading: false });
		this.calculatePrice();
	},

	onLoad() {
		const { themeColor } = app.globalData;
		this.setData({ themeColor });
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

	async onLogin(ev) {
		// const { code } = this.data;
		// const { errMsg, iv, encryptedData } = ev.detail;
		// const isDenied = errMsg.indexOf('deny') >= 0;
		// if (!isDenied) {
		// 	const { user } = await login({ iv, encryptedData });
		// 	if (user.openid) {
		// 		this.setData({ isLogin: true });
		// 		await this.loadCart();
		// 	}
		// }
		wx.navigateTo({ url: '/pages/login/login' });
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

	onSelectAll() {
		const { isAllSelected } = this.data;
		const { items } = this.data;
		let isAllSoldout = true;

		const newItems = items.map((item) => {
			const isSoldOut = item.status === 0;
			if (!isSoldOut) {
				isAllSoldout = false;
			}
			item.isSelected = isSoldOut ? false : !isAllSelected;
			return item;
		});

		if (isAllSoldout) {
			wx.showToast('购物车的商品均已售罄');
		}
		else {
			this.setData({
				items: newItems,
				isAllSelected: !isAllSelected,
			});
			this.calculatePrice();
			this.saveCartAction();
		}
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
			this.saveCartAction();
		}
	},

	async onCreateOrder(ev) {
		const { encryptedData, iv } = ev.detail;

		if (encryptedData && iv) {
			await forceUserInfo({ encryptedData, iv });
			const { items } = this.data;
			const selectdItems = items.filter((item) => item.isSelected);
			this.data.items = selectdItems; // 不需要更新UI,直接赋值即可
			app.globalData.currentOrder = this.data;
			app.globalData.currentOrder = cloneDeep(this.data);
			wx.navigateTo({
				url: '/pages/orderCreate/orderCreate',
			});
		}
		else {
			showModal({
				title: '需授权后操作',
				showCancel: false,
			});
		}

	},

	saveCartAction() {
		const { items } = this.data;
		wx.setStorageSync(CART_LIST_KEY, items);
	},
});
