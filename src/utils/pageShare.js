// 用于Page中
// 若需要使用this，不能使用箭头函数，不然this为undefinde

import api from 'utils/api';
import { SHARE_TITLE } from 'constants/index';
import { showModal, requestPayment } from 'utils/wxp';

// 获取应用实例
const app = getApp(); // eslint-disable-line no-undef

// export const onDefaultShareAppMessage = function() {
// 	return {
// 		title: this.data.page,
// 		path: this.sharePath,
// 	};
// };

export const onShareHomeAppMessage = () => {
	return {
		title: SHARE_TITLE,
		path: '/pages/home/home'
	};
};

export const onDefaultShareAppMessage = function () {
	const { share_title, share_image } = this.data;
	const { options, route } = this;
	const optionsKeys = Object.keys(options);
	const hasOptions = !!optionsKeys.length;
	let path = route;
	if (hasOptions) {
		path = optionsKeys.reduce((path, key, index) => {
			const joinSymbol = index ? '&' : '?';
			return `${path}${joinSymbol}${key}=${options[key]}`;
		}, path);
	}
	console.log(path);
	const shareMsg = {
		title: share_title,
		path,
	};
	if (share_image) {
		shareMsg.imageUrl = share_image;
	}
	return shareMsg;
};

export const createCurrentOrder = ({ items, selectedSku }) => {
	const order = {
		items: [],
		totalPrice: 0,
		savePrice: 0,
	};

	console.log('selectedSku', selectedSku);
	if (selectedSku) {
		const item = items[0];
		const { price, id: skuId, property_names, image_url, original_price, quantity } = selectedSku;
		item.post_id = item.id;
		item.quantity = quantity;
		item.sku_id = skuId;
		item.sku_property_names = property_names;
		item.price = price || items[0].price;
		item.original_price = original_price || items[0].original_price;
		item.image_url = image_url || item.images[0];
	};

	order.items = items;
	console.log('items', items);

	items.forEach((item) => {
		const { price, original_price, quantity } = item;
		console.log(original_price, price);
		order.totalPrice = order.totalPrice + (price * quantity);
		order.savePrice = order.savePrice + ((original_price - price) * quantity);
	});

	return order;
};

export const wxPay = async (options = {}) => {
	const { timeStamp, nonceStr, package: pkg, signType, paySign } = options;
	try {
		const res = await requestPayment({
			timeStamp,
			nonceStr,
			package: pkg,
			signType,
			paySign,
		});
		console.log(res);
		return res;
	}
	catch (err) {
		console.log(err);
		const { errMsg } = err;
		if (errMsg.indexOf('cancel') >= 0) {
			await showModal({
				title: '支付取消',
				content: '请尽快完成付款',
				showCancel: false,
			});
		}
		else {
			await showModal({
				title: '支付失败',
				content: '网络错误，请稍后重试',
				showCancel: false,
			});
			throw err;
		}
	}
	// wx.redirectTo({
	// 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`
	// });
};


