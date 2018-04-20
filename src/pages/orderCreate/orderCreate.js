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

		isGroupon: 0,
		grouponId: '',
		skuId: '',
		quantity: 1,
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

	async onShow() {
		try {
			const { isGroupon, grouponId, skuId, quantity } = wx.getStorageSync(
				'orderCreate',
			);
			const { currentOrder } = app.globalData;
			const { items } = currentOrder;
			const address = wx.getStorageSync(ADDRESS_KEY) || {};
			const { isCancel, order_no } = this.options;
			const totalPrice = Number(currentOrder.totalPrice).toFixed(2)
			let totalPostage = 0;


			//跳转支付后返回 取消支付状态isCanecl为true
			if (isCancel) {
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}`,
				});
			}

			// let couponPrice = 0;

			// currentOrder.coupons为true时代表已经获取过可使用优惠券，手动选择优惠券后回到本页面的情况
			// console.log('currentOrder', JSON.stringify(currentOrder));
			if (!isGroupon && !currentOrder.coupons) {
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

			currentOrder.items.forEach((item) => {
				const { postage } = item;
				if (postage > totalPostage) {
					totalPostage = postage;
				}
			});

			const orderPrice = +totalPrice + totalPostage - currentOrder.couponPrice;

			currentOrder.totalPostage = totalPostage;
			currentOrder.isGroupon = isGroupon;
			currentOrder.grouponId = grouponId;
			currentOrder.skuId = skuId;
			currentOrder.quantity = quantity;
			currentOrder.address = address;
			currentOrder.orderPrice = orderPrice >= 0 ? orderPrice.toFixed(2) : '0.00';

			// currentOrder.totalPrice = totalPrice >= 0 ? totalPrice.toFixed(2) : '0.00';
			// console.log(currentOrder.totalPrice)
			// console.log(totalPrice)
			// currentOrder.orderPrice = (
			// 	+totalPrice +
			// 	totalPostage -
			// 	currentOrder.couponPrice
			// ).toFixed(2);
			//
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

		// console.log(authSetting);
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
			isGroupon,
			skuId,
			quantity,
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

		if (isGroupon) {
			requestData.sku_id = skuId;
			requestData.quantity = quantity;
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
			// if (status == 2) {
			// 	console.log('status == 2');
			// 	const { order_no, status, pay_sign, pay_appid } = await api.hei[method](
			// 		requestData,
			// 	);
			
			if(this.data.orderPrice<=0){
				wx.redirectTo({
					url:`../orderDetail/orderDetail?id=${order_no}`
				})
			}
			if (+status === 2) {
				wx.hideLoading();
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}`,
				});
			}
			else if (pay_sign) {
				console.log('自主支付');
				wx.hideLoading();
				await wxPay(pay_sign);
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}`,
				});
			}
			else if (pay_appid) {
				console.log('平台支付')
				console.log(this.data)

				console.log(this.data.items);


				await wx.navigateToMiniProgram({
					envVersion: 'release',
					appId: pay_appid,
				  	path: `/pages/peanutPay/index?order_no=${order_no}`,
				  	extraData: {
				    	order_no: order_no,
				    	address:this.data.address,
						items:this.data.items,
						totalPrice:this.data.totalPrice,
						totalPostage:this.data.totalPostage,
						quantity:this.data.quantity,
						orderPrice:this.data.orderPrice,
						coupons:this.data.coupons,
						buyerMessage:this.data.buyerMessage,
						couponPrice:this.data.couponPrice,
						orderPrice:this.data.orderPrice
				  	},
				});
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}`,
				});
			}
			else {
				wx.hideLoading();
				wx.redirectTo({
					url: `/pages/orderDetail/orderDetail?id=${order_no}`,
				});
			}
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
