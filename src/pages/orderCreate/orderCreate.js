import api from "utils/api";
import { chooseAddress, showModal } from "utils/wxp";
import { wxPay } from "utils/pageShare";
import { ADDRESS_KEY } from "constants/index";

const app = getApp();

Page({
	data: {
		title: "orderCreate",

		savePrice: 0,
		totalPrice: 0,
		items: [],

		isGroupon: 0,
		grouponId: "",
		skuId: "",
		quantity: 1,
		address: {
			userName: ""
		},
		buyerMessage: "",
		totalPostage: 0,
		couponPrice: 0,
		orderPrice: 0,
		coupons: {
			recommend: {},
			available: [],
			unavailable: [],
			selected: {}
		}
	},

	async onShow() {
		try {
			const { isGroupon, grouponId, skuId, quantity } = wx.getStorageSync(
				"orderCreate"
			);
			const { currentOrder } = app.globalData;
			const { items, totalPrice } = currentOrder;
			const address = wx.getStorageSync(ADDRESS_KEY) || {};
			let totalPostage = 0;
			// let couponPrice = 0;

			//currentOrder.coupons为true时代表已经获取过可使用优惠券，手动选择优惠券后回到本页面的情况

			if (!isGroupon && !currentOrder.coupons) {
				const {
					recommend,
					unavailable,
					available
				} = await api.hei.fetchMyCouponList({ posts: JSON.stringify(items) });

				currentOrder.coupons = {
					recommend,
					unavailable,
					available,
					selected: recommend
				};
			}

			if (currentOrder.coupons && currentOrder.coupons.selected && currentOrder.coupons.selected.id) {
				const { type, reduce_cost, discount } = currentOrder.coupons.selected;
				currentOrder.couponPrice = +type === 1 ? reduce_cost : (totalPrice * discount / 100).toFixed(2);
			}
			else {
				currentOrder.couponPrice = 0;
			}


			currentOrder.items.forEach(item => {
				const { postage } = item;
				if (postage > totalPostage) {
					totalPostage = postage;
				}
			});
			currentOrder.totalPostage = totalPostage;
			currentOrder.isGroupon = isGroupon;
			currentOrder.grouponId = grouponId;
			currentOrder.skuId = skuId;
			currentOrder.quantity = quantity;
			currentOrder.address = address;
			currentOrder.orderPrice = (totalPrice + totalPostage - currentOrder.couponPrice).toFixed(2);

			console.log('orderCreate', currentOrder);
			this.setData(currentOrder);
		}
		catch (err) {
			console.log(err);
		}

	},

	onUnload() {
		console.log('--- onUnLoad ----');
		app.globalData.currentOrder = {};
		wx.removeStorageSync('orderCreate');
	},

	// onHide() {
	// 	console.log('--- onHide ----');
	// 	wx.clearStorageSync('orderCreate');
	// },

	onInput(ev) {
		const { value } = ev.detail;
		this.setData({ buyerMessage: value });
	},

	async onAddress() {
		const address = await chooseAddress();
		wx.setStorageSync(ADDRESS_KEY, address);
		this.setData({ address });
	},

	async onCoupon() {
		const { coupons } = this.data;
		// app.globalData.currentOrderCoupons = coupons;
		app.globalData.currentOrder = this.data;
		wx.navigateTo({
			url: "/pages/orderCoupons/orderCoupons"
		});
	},

	async onPay(ev) {
		const { formId } = ev.detail;
		const {
			address,
			items,
			buyerMessage,
			grouponId,
			isGroupon,
			skuId,
			quantity,
			coupons
		} = this.data;
		const {
			userName,
			telNumber,
			provinceName,
			cityName,
			countyName,
			postalCode,
			nationalCode,
			detailInfo
		} = address;
		const { vendor } = app.globalData;
		const couponId = coupons.selected.id;

		if (!userName) {
			wx.showModal({
				title: "提示",
				content: "请先填写地址",
				showCancel: false
			});
			return;
		}

		wx.setStorageSync(ADDRESS_KEY, address);

		let method = "createOrderAndPay";
		wx.showLoading({
			title: "处理订单中",
			mark: true
		});
		const requestData = {
			receiver_name: userName,
			receiver_phone: telNumber,
			receiver_country: nationalCode,
			receiver_state: provinceName,
			receiver_city: cityName,
			receiver_district: countyName,
			receiver_address: detailInfo,
			receiver_zipcode: postalCode,
			buyer_message: buyerMessage,
			form_id: formId,
			vendor
		};

		if (couponId) {
			requestData.coupon_id = couponId;
		}

		if (isGroupon) {
			requestData.sku_id = skuId;
			requestData.quantity = quantity;
			if (grouponId) {
				requestData.id = grouponId;
				method = "joinGroupon";
			} else {
				requestData.post_id = items[0].id;
				method = "createGroupon";
			}
		} else {
			requestData.posts = JSON.stringify(items);
		}

		try {
			const { order_no, pay_sign } = await api.hei[method](requestData);
			wx.hideLoading();
			if (pay_sign) {
				await wxPay(pay_sign);
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}`
				});
			}
		} catch (err) {
			wx.hideLoading();
			showModal({
				title: "温馨提示",
				content: err.errMsg,
				showCancel: false
			});
		}
	}
});
