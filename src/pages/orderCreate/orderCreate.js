import api from 'utils/api';
import { chooseAddress, showModal, getSetting, openSetting } from 'utils/wxp';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY } from 'constants/index';

const app = getApp();

Page({
	data: {
		title: 'orderCreate',

		savePrice: 0,
		totalPrice: 0,
		items: [],

		isGrouponBuy: false,
		grouponId: '',
		isCancel: false,

		address: {
			userName: '',
		},
		buyerMessage: '',
		totalPostage: 0,
		couponPrice: 0,
		orderPrice: 0,
		coupons: {
			recommend: {},
			available: [],
			unavailable: [],
			selected: {},
		},
		nowTS: Date.now() / 1000,
	},

	onLoad() {
		const { themeColor } = app.globalData;
		const { isIphoneX } = app.systemInfo;
		this.setData({ themeColor, isIphoneX });
	},

	async onShow() {
		try {
			// isCancel 仅在跳转支付后返回 标识是否取消支付
			const { isCancel, order_no, grouponId, isGrouponBuy } = this.options;
			// const { isGroupon, grouponId, skuId, quantity } = wx.getStorageSync(
			// 	'orderCreate',
			// );
			const { currentOrder } = app.globalData;
			const { items, totalPostage } = currentOrder;
			const address = wx.getStorageSync(ADDRESS_KEY) || {};
			const totalPrice = Number(currentOrder.totalPrice).toFixed(2);
			// let totalPostage = 0;

			if (isCancel) {
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
				});
			}

			// let couponPrice = 0;

			// currentOrder.coupons为true时代表已经获取过可使用优惠券，手动选择优惠券后回到本页面的情况
			if (!isGrouponBuy && !currentOrder.coupons) {
				const {
					recommend,
					unavailable,
					available,
				} = await api.hei.fetchMyCouponList({ posts: JSON.stringify(items) });

				currentOrder.coupons = {
					recommend,
					unavailable,
					available,
					selected: recommend,
				};
			}

			const hasSelectedCoupon =
				currentOrder.coupons &&
				currentOrder.coupons.selected &&
				currentOrder.coupons.selected.id;

			if (hasSelectedCoupon) {
				const { type, reduce_cost, discount } = currentOrder.coupons.selected;
				currentOrder.couponPrice =
					+type === 1 ? reduce_cost : (totalPrice * discount / 100).toFixed(2);
			}
			else {
				currentOrder.couponPrice = 0;
			}

			// 使用reduce 或者不需要再次计算总运费, 直接传过来
			// currentOrder.items.forEach((item) => {
			// 	const { postage } = item;
			// 	if (postage > totalPostage) {
			// 		totalPostage = postage;
			// 	}
			// });

			const orderPrice = Number(totalPrice) + Number(totalPostage) - Number(currentOrder.couponPrice);

			// currentOrder.totalPostage = totalPostage;
			currentOrder.isGrouponBuy = isGrouponBuy;
			currentOrder.grouponId = grouponId;
			currentOrder.address = address;
			currentOrder.orderPrice =
				orderPrice >= 0 ? orderPrice.toFixed(2) : '0.00';
			this.setData(currentOrder);
		}
		catch (err) {
			console.log(err);
		}
	},

	onUnload() {
		console.log('--- onUnLoad ----');
		app.globalData.currentOrder = {};

		// console.log(JSON.stringify(app.globalData.currentOrder));
		wx.removeStorageSync('orderCreate');
	},

	onHide() {
		console.log('--- onHide ----');

		// wx.clearStorageSync('orderCreate');
	},

	onInput(ev) {
		const { value } = ev.detail;
		this.setData({ buyerMessage: value });
	},

	async onAddress() {
		const { authSetting } = await getSetting();

		// authSetting['scope.address']可能值：
		// 没有值  初始化状态 系统会自动弹框询问授权
		// false  此时需要使用openSetting
		if (authSetting['scope.address'] === false) {
			await openSetting();
		}
		const address = await chooseAddress();
		wx.setStorageSync(ADDRESS_KEY, address);
		this.setData({ address });
	},

	async onCoupon() {
		const { coupons } = this.data;

		// app.globalData.currentOrderCoupons = coupons;
		//
		// WARNING globalData若是指向this.data对象，若在其他页面改动，会导致这个页面的this.data有问题！！！
		app.globalData.currentOrder = this.data;
		wx.navigateTo({
			url: '/pages/orderCoupons/orderCoupons',
		});
	},

	async onPay(ev) {
		const { formId } = ev.detail;
		const {
			address,
			items,
			buyerMessage,
			grouponId,
			isGrouponBuy,
			coupons,
		} = this.data;
		const {
			userName,
			telNumber,
			provinceName,
			cityName,
			countyName,
			postalCode,
			nationalCode,
			detailInfo,
		} = address;
		const { vendor } = app.globalData;
		const couponId = coupons.selected && coupons.selected.id;

		if (!userName) {
			wx.showModal({
				title: '提示',
				content: '请先填写地址',
				showCancel: false,
			});
			return;
		}

		wx.setStorageSync(ADDRESS_KEY, address);

		let method = 'createOrderAndPay';

		wx.showLoading({
			title: '处理订单中',
			mark: true,
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
			vendor,
		};

		if (couponId) {
			requestData.coupon_id = couponId;
		}

		// 如果团购 团购接口 上传的数据 不是直接上传posts, 需要上传sku_id, quantity, post_id|id(grouponId)
		if (isGrouponBuy) {
			requestData.sku_id = items[0].sku_id;
			requestData.quantity = items[0].quantity;
			if (grouponId) {
				requestData.id = grouponId;
				method = 'joinGroupon';
			}
			else {
				requestData.post_id = items[0].id;
				method = 'createGroupon';
			}
		}
		else {
			requestData.posts = JSON.stringify(items);
		}

		try {


			const { order_no, status, pay_sign, pay_appid } = await api.hei[method](requestData);
			console.log('status:', status);
			wx.hideLoading();

			if (this.data.orderPrice <= 0) {
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
				});
			}

			if (pay_sign) {
				console.log('自主支付');
				await wxPay(pay_sign);

			}
			else if (pay_appid) {
				console.log('平台支付');

				await wx.navigateToMiniProgram({
					envVersion: 'release',
					// envVersion: 'develop',
					appId: pay_appid,
					path: `/pages/peanutPay/index?order_no=${order_no}`,
					extraData: {
						order_no: order_no,
						address: this.data.address,
						items: this.data.items,
						totalPrice: this.data.totalPrice,
						totalPostage: this.data.totalPostage,
						orderPrice: this.data.orderPrice,
						coupons: this.data.coupons,
						buyerMessage: this.data.buyerMessage,
						couponPrice: this.data.couponPrice,
					},
				});
			}

			wx.redirectTo({
				url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
			});
		}
		catch (err) {
			console.log(err);
			wx.hideLoading();
			showModal({
				title: '温馨提示',
				content: err.errMsg,
				showCancel: false,
			});
		}
	},
});
