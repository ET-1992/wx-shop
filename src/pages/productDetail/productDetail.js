import api from "utils/api";
import { createCurrentOrder, onDefaultShareAppMessage } from "utils/pageShare";
import { showToast, showModal } from "utils/wxp";
import getRemainTime from "utils/getRemainTime";
import getToken from 'utils/getToken';
import login from 'utils/login'

const app = getApp();

const findSelectedSku = (skus, selectedProperties) => {
	const selectedPropertiesNames = selectedProperties.reduce(
		(propertyNames, sku) => {
			return propertyNames + sku.key + ":" + sku.value + ";";
		},
		""
	);
	console.log(selectedPropertiesNames);
	const sku = skus.find(sku => {
		return sku.property_names === selectedPropertiesNames;
	});
	return sku || {};
};

Page({
	data: {
		title: "productDetail",
		autoplay: false,
		product: {
			skus: []
		},
		current: 0,

		output: "product",
		page_title: "",
		share_title: "",
		activeIndex: 0,
		isLoading: false,
		headerType: "images",
		grouponId: "",
		remainTime: {
			hour: "00",
			minute: "00",
			second: "00"
		},
		hasStart: true,
		hasEnd: false,
		timeLimit: 0,
		timestamp: (+new Date() / 1000) | 0,
		isShowAcitonSheet: false,
		isShowCouponList: false,
		selectedProperties: [],
		selectedSku: {},
		skuSplitProperties: [],
		quantity: 1,
		actions: [
			{
				type: "onBuy",
				text: "立即购买",
				isGroupon: false,
				isMiaosha: false,
				isSingle: false
			}
		],
		single: false,
		receivableCoupons: [],
		receivedCoupons: [],
	},

	onShowSku(ev) {
		const { status } = this.data.product;

		if ( status === 'unpublished' || status === 'sold_out') {
			return;
		}

		const updateData = { isShowAcitonSheet: true };
		if (ev) {
			const { actions, single } = ev.currentTarget.dataset;
			updateData.actions = actions;
			// updateData.single = (single === '0' ? true : false);
			updateData.single = single === "0";
		}
		updateData.timestamp = (+new Date() / 1000) | 0;
		this.setData(updateData);
	},

	countDown() {
		const {
			miaosha_end_timestamp,
			miaosha_start_timestamp
		} = this.data.product;
		const now = Math.round(Date.now() / 1000);
		let timeLimit = miaosha_end_timestamp - now;
		let hasStart = true;
		let hasEnd = false;
		if (now < miaosha_start_timestamp) {
			hasStart = false;
			timeLimit = now - miaosha_start_timestamp;
		}

		if (now > miaosha_end_timestamp) {
			hasEnd = true;
			timeLimit = 0;
		}
		this.setData({
			timeLimit,
			hasStart,
			hasEnd
		});

		if (timeLimit && !this.intervalId) {
			this.intervalId = setInterval(() => {
				const { timeLimit } = this.data;
				const [hour, minute, second] = getRemainTime(timeLimit);
				this.setData({
					timeLimit: timeLimit - 1,
					remainTime: {
						hour,
						minute,
						second
					}
				});
			}, 1000);
		}
	},

	async initPage() {
		this.setData({
			pendingGrouponId: "",
			selectedProperties: [],
			selectedSku: {},
			skuSplitProperties: [],
		});

		this.setData({ isLoading: true });

		const { id, grouponId } = this.data.indexparams;

		try {
			const data = await api.hei.fetchProduct({ id });
			const { skus, coupons } = data.product;

			const { receivableCoupons, receivedCoupons } = coupons.reduce(
				(classifyCoupons, coupon) => {
					const { receivableCoupons, receivedCoupons } = classifyCoupons;
					// coupon.fomatedTitle = coupon.title.split('-')[1];
					if (+coupon.status === 2) {
						receivableCoupons.push(coupon);
					}
					else {
						receivedCoupons.push(coupon);
					}
					return classifyCoupons;
				},
				{ receivableCoupons: [], receivedCoupons: [] }
			);

			wx.getBackgroundAudioManager({
				success(res) {
					console.log(res);
				}
			});
			wx.setNavigationBarTitle({
				title: data.page_title
			});

			const skuSplitProperties = skus.reduce(
				(skuSplitProperties, sku, index) => {
					const { properties } = sku;
					// const properties = JSON.parse(properties);
					const isInit = !index;

					sku.properties = properties;

					properties.forEach((property, propertyInex) => {
						const { k, v } = property;
						if (isInit) {
							skuSplitProperties.push({ key: k, values: [v] });
						}
						else {
							const isExits =
								skuSplitProperties[propertyInex].values.findIndex(
									value => value === v
								) >= 0;
							if (!isExits) {
								skuSplitProperties[propertyInex].values.push(v);
							}
						}
					});

					return skuSplitProperties;
				},
				[]
			);
			this.setData({
				skuSplitProperties,
				grouponId: grouponId || "",
				receivedCoupons,
				receivableCoupons,
				...data
			});
			this.countDown();
		}
		catch (err) {
			console.log(err);
		}
		this.setData({ isLoading: false });
	},

	async onShow() {
		await this.initPage();
	},

	currentIndex(e) {
		this.setData({ current: e.detail.current });
	},

	async onLoad({ id, grouponId }) {
		this.setData({ indexparams: { id, grouponId } });
	},

	onUnload() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	},

	grouponListener({ detail }) {
		const { grouponId } = detail;
		this.setData({ pendingGrouponId: grouponId });
		this.onShowSku();
	},

	async addCart() {
		console.log("addCart");
		const { vendor } = app.globalData;
		const { product: { id }, selectedSku, quantity } = this.data;

		if (selectedSku.stock === 0) {
			await showModal({
				title: '温馨提示',
				content: '无法购买库存为0的商品'
			});
			return;
		}

		const data = await api.hei.addCart({
			post_id: id,
			sku_id: selectedSku.id || 0,
			quantity,
			vendor
		});
		if (!data.errcode) {
			wx.showToast({
				title: "成功添加到购物车"
			});
		}
	},

	async onBuy() {
		const token = getToken();
		const {
			product,
			quantity,
			selectedSku,
			grouponId,
			pendingGrouponId,
			actions,
			single
		} = this.data;

		if (!token) {
			await login();
		}

		if (selectedSku.stock === 0) {
			await showModal({
				title: '温馨提示',
				content: '无法购买库存为0的商品'
			});
			return;
		}

		let url = "/pages/orderCreate/orderCreate";
		if (grouponId || pendingGrouponId || actions[0].isGroupon) {
			selectedSku.price = product.groupon_price;
			product.price = product.groupon_price;
			wx.setStorageSync("orderCreate", {
				isGroupon: 1,
				grouponId: grouponId || pendingGrouponId,
				skuId: selectedSku.id,
				quantity
			});

			// url = url;
		}

		let currentOrder, price;
		price = product.price;
		// original_price = product.original_price

		if (product.groupon_enable === "1") {
			if (single) {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({ quantity }, selectedSku),
					items: [product]
				});
			}
			else {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({ quantity, price }, selectedSku),
					items: [product]
				});
			}
		}
		else if (product.miaosha_enable === "1") {
			if (product.miaosha_end_timestamp - ((Date.now() / 1000) | 0) > 0) {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({ quantity }, selectedSku, {
						price: product.miaosha_price - 0
					}),
					items: [product]
				});
			}
			else {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({ quantity }, selectedSku),
					items: [product]
				});
			}
		}
		else {
			currentOrder = createCurrentOrder({
				selectedSku: Object.assign({ quantity }, selectedSku),
				items: [product]
			});
		}

		app.globalData.currentOrder = currentOrder;

		wx.navigateTo({ url });
	},

	onSkuItem(ev) {
		const { key, value, propertyIndex } = ev.currentTarget.dataset;
		const { selectedProperties } = this.data;
		const exValue =
			selectedProperties[propertyIndex] &&
			selectedProperties[propertyIndex].value;

		// const sku = this.data.product.skus[index];
		const updateData = {};
		const updatekey = `selectedProperties[${propertyIndex}]`;
		const updateValue = exValue === value ? {} : { key, value };
		updateData[updatekey] = updateValue;
		this.setData(updateData);

		const {
			selectedProperties: newSelectedProperties,
			product: { skus }
		} = this.data;
		const selectedSku = findSelectedSku(skus, newSelectedProperties);
		console.log("selectedSku", selectedSku);
		this.setData({ selectedSku, quantity: 1 });
		console.log(this.data.selectedSku);
	},

	updateQuantity({ detail }) {
		const { value } = detail;
		this.setData({ quantity: value });
	},

	onMockCancel() {
		this.onSkuCancel();
		this.onHideCouponList();
	},

	onReady() {
		this.videoContext = wx.createVideoContext("myVideo");
	},
	clickMe() {
		const that = this;
		that.setData({ autoplay: false, activeIndex: 1 });
		this.videoContext.requestFullScreen({
			direction: 0
		});
	},
	startPlay() {
		this.setData({ autoplay: false });
	},
	pause() {
		this.setData({ autoplay: true });
	},
	end() {
		this.setData({ autoplay: true });
	},
	fullScreen(e) {
		console.log(e.detail.fullScreen);
		if (e.detail.fullScreen === false) {
			this.setData({ autoplay: true, activeIndex: -1 });
		}
	},

	onHideCouponList() {
		this.setData({
			isShowCouponList: false
		});
	},

	async onReceiveCoupon(id, index) {
		try {
			const data = await api.hei.receiveCoupon({
				coupon_id: id
			});
			if (!data.errcode) {
				showToast({ title: "领取成功" });
				const updateData = {};
				const key = `receivableCoupons[${index}].status`;
				updateData[key] = 4;
				this.setData(updateData);
			}
		}
		catch (err) {
			await showModal({
				title: '温馨提示',
				content: err.errMsg,
				showCancel: false
			});
		}
	},

	async onCouponClick(ev) {
		const { id, index, status, title } = ev.currentTarget.dataset;
		const token = getToken();

		if (!token) {
			const { confirm } = await showModal({
				title: '未登录',
				content: '请先登录，再领取优惠券',
				confirmText: '登录'
			});
			if (confirm) {
				this.setData({ isShowCouponList: false });
				await login();
				await this.initPage();
			}
			return;
		}

		if (+status === 2) {
			await this.onReceiveCoupon(id, index);
		}
		else {
			wx.navigateTo({
				url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`
			});
		}
	},

	onShowCouponList() {
		console.log("onShowCoupons");
		this.setData({
			isShowCouponList: true
		});
	},

	onSkuCancel() {
		this.setData({
			isShowAcitonSheet: false,
			selectedSku: {},
			selectedProperties: [],
			quantity: 1,
			pendingGrouponId: ""
		});
	},

	onSkuConfirm(ev) {
		const { actionType } = ev.currentTarget.dataset;
		this.setData({
			isShowAcitonSheet: false
		});
		this[actionType]();
	},

	onShareAppMessage: onDefaultShareAppMessage
});
