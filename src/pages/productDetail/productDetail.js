import api from 'utils/api';
import {createCurrentOrder, onDefaultShareAppMessage} from 'utils/pageShare';
import getRemainTime from 'utils/getRemainTime';

const app = getApp();

const findSelectedSku = (skus, selectedProperties) => {
	const selectedPropertiesNames = selectedProperties.reduce((propertyNames, sku) => {
		return propertyNames + sku.key + ':' + sku.value + ';';
	}, '');
	console.log(selectedPropertiesNames);
	const sku = skus.find((sku) => {
		return sku.property_names === selectedPropertiesNames;
	});
	return sku || {};
};


Page({
	data: {
		title: 'productDetail',
		autoplay: false,
		product: {
			skus: []
		},
		current: 0,

		output: 'product',
		page_title: '',
		share_title: '',
		activeIndex: 0,
		isLoading: false,
		headerType: 'images',
		grouponId: '',
		remainTime: {
			hour: '00',
			minute: '00',
			second: '00',
		},
		hasStart: true,
		hasEnd: false,
		timeLimit: 0,
		timestamp: +new Date() / 1000 | 0,
		isShowAcitonSheet: false,
		selectedProperties: [],
		selectedSku: {},
		skuSplitProperties: [],
		quantity: 1,
		actions: [{
			type: 'onBuy',
			text: '立即购买',
			isGroupon: false,
			isMiaosha: false,
			isSingle: false
		}],
		single: false
	},

	onShowSku(ev) {
		const updateData = {isShowAcitonSheet: true};
		if (ev) {
			const {actions, single} = ev.currentTarget.dataset;
			updateData.actions = actions;
			// updateData.single = (single === '0' ? true : false);
			updateData.single = single === '0';
		}
		updateData.timestamp = +new Date() / 1000 | 0;
		this.setData(updateData);
	},

	countDown() {
		const {miaosha_end_timestamp, miaosha_start_timestamp} = this.data.product;
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

		if (timeLimit) {
			this.intervalId = setInterval(() => {
				const {timeLimit} = this.data;
				const [hour, minute, second] = getRemainTime(timeLimit);
				this.setData({
					'timeLimit': timeLimit - 1,
					remainTime: {
						hour,
						minute,
						second,
					}
				});
			}, 1000);
		}
	},

	async onShow() {
		this.setData({
			pendingGrouponId: '',
			selectedProperties: [],
			selectedSku: {},
			skuSplitProperties: []
		});

		this.setData({isLoading: true});

		const {id, grouponId} = this.data.indexparams;

		try {
			const data = await api.hei.fetchProduct({id});
			const {skus} = data.product;
			wx.getBackgroundAudioManager({
				success(res) {
					console.log(res)
				}
			})
			wx.setNavigationBarTitle({
				title: data.page_title
			})

			const skuSplitProperties = skus.reduce((skuSplitProperties, sku, index) => {
				const {properties} = sku;
				// const properties = JSON.parse(properties);
				const isInit = !index;

				sku.properties = properties;

				properties.forEach((property, propertyInex) => {
					const {k, v} = property;
					if (isInit) {
						skuSplitProperties.push({key: k, values: [v]});
					}
					else {
						const isExits = skuSplitProperties[propertyInex].values.findIndex(value => value === v) >= 0;
						if (!isExits) {
							skuSplitProperties[propertyInex].values.push(v);
						}
					}
				});

				return skuSplitProperties;

			}, []);
			this.setData({
				skuSplitProperties,
				grouponId: grouponId || '',
				...data
			});
			this.countDown();
		}

		catch (err) {
			console.log(err);
		}
		this.setData({isLoading: false});
	},

	currentIndex(e) {
		this.setData({current: e.detail.current})
	},

	async onLoad ({id, grouponId}) {
		this.setData({indexparams: {id, grouponId}});
	},

	onUnload() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	},

	grouponListener({detail}) {
		const {grouponId} = detail;
		this.setData({pendingGrouponId: grouponId});
		this.onShowSku();
	},

	async addCart() {
		console.log('addCart');
		const {vendor} = app.globalData;
		const {product: {id}, selectedSku, quantity} = this.data;
		const data = await api.hei.addCart({
			post_id: id,
			sku_id: selectedSku.id || 0,
			quantity,
			vendor,
		});
		if (!data.errcode) {
			wx.showToast({
				title: '成功添加到购物车',
			});
		}
	},

	async onBuy() {
		const {
			product,
			quantity,
			selectedSku,
			grouponId,
			pendingGrouponId,
			actions,
			single
		} = this.data;
		let url = '/pages/orderCreate/orderCreate';
		if (grouponId || pendingGrouponId || actions[0].isGroupon) {
			selectedSku.price = product.groupon_price;
			product.price = product.groupon_price;
			wx.setStorageSync('orderCreate', {
				isGroupon: 1,
				grouponId: grouponId || pendingGrouponId,
			});

			// url = url;
		}

		let currentOrder, price;
		price = product.price;
		// original_price = product.original_price

		if (product.groupon_enable === '1') {

			if (single) {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({quantity}, selectedSku),
					items: [product]
				});
			} else {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({quantity, price}, selectedSku),
					items: [product],
				});
			}
		} else if (product.miaosha_enable === '1') {
			if (product.miaosha_end_timestamp - (Date.now() / 1000 | 0) > 0) {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({quantity}, selectedSku, {price: (product.miaosha_price - 0)}),
					items: [product],
				});
			} else {
				currentOrder = createCurrentOrder({
					selectedSku: Object.assign({quantity}, selectedSku),
					items: [product],
				});

			}

		} else {

			currentOrder = createCurrentOrder({
				selectedSku: Object.assign({quantity}, selectedSku),
				items: [product],
			});

		}

		app.globalData.currentOrder = currentOrder;

		wx.navigateTo({ url });
	},

	onSkuItem(ev) {
		const {key, value, propertyIndex} = ev.currentTarget.dataset;
		const {selectedProperties} = this.data;
		const exValue = selectedProperties[propertyIndex] && selectedProperties[propertyIndex].value;

		// const sku = this.data.product.skus[index];
		const updateData = {};
		const updatekey = `selectedProperties[${propertyIndex}]`;
		const updateValue = exValue === value ? {} : {key, value};
		updateData[updatekey] = updateValue;
		this.setData(updateData);

		const {selectedProperties: newSelectedProperties, product: {skus}} = this.data;
		const selectedSku = findSelectedSku(skus, newSelectedProperties);
		console.log('selectedSku', selectedSku);
		this.setData({selectedSku, quantity: 1});
		console.log(this.data.selectedSku);
	},

	updateQuantity({detail}) {
		const {value} = detail;
		this.setData({quantity: value});
	},

	onMockCancel() {
		this.onSkuCancel();
	},
	onReady() {
		this.videoContext = wx.createVideoContext('myVideo')
	},
	clickMe() {
		const that = this;
		that.setData({autoplay: false, activeIndex: 1})
		this.videoContext.requestFullScreen({
			direction: 0
		})
	},
	startPlay() {
		this.setData({autoplay: false})
	},
	pause() {
		this.setData({autoplay: true});
	},
	end() {
		this.setData({autoplay: true});
	},
	fullScreen(e) {
		console.log(e.detail.fullScreen)
		if (e.detail.fullScreen === false) {
			this.setData({autoplay: true, activeIndex: -1})
		}
	},

	onShowCoupons() {
		console.log('onShowCoupons');
	},

	onSkuCancel() {
		this.setData({
			isShowAcitonSheet: false,
			selectedSku: {},
			selectedProperties: [],
			quantity: 1,
			pendingGrouponId: '',
		});
	},

	onSkuConfirm(ev) {
		const {actionType} = ev.currentTarget.dataset;

		this.setData({
			isShowAcitonSheet: false,
		});
		this[actionType]();
	},

	onShareAppMessage: onDefaultShareAppMessage,
});
