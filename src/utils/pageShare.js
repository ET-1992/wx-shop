// 用于Page中
// 若需要使用this，不能使用箭头函数，不然this为undefinde

import api from 'utils/api';
import { SHARE_TITLE, CONFIG, USER_KEY } from 'constants/index';
import { showModal, showToast, requestPayment } from 'utils/wxp';

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
// 全页面分享
export const onDefaultShareAppMessage = function (params = {}, path_ = '') {
    const { share_title, share_image } = this.data;
    const user = wx.getStorageSync(USER_KEY);
    let { options = {}, route } = this;
    options = { ...options, ...params };
    if (!options.hasOwnProperty('afcode') && user.afcode) {
        options.afcode = user.afcode;
    }
    const optionsKeys = Object.keys(options);
    const hasOptions = !!optionsKeys.length;
    let path = path_ || route;
    if (hasOptions) {
        path = optionsKeys.reduce((path, key, index) => {
            const joinSymbol = index ? '&' : '?';
            return `${path}${joinSymbol}${key}=${options[key]}`;
        }, path);
    }
    console.log('pageShare.js/path42', path);
    const shareMsg = {
        title: share_title,
        path,
    };
    if (share_image) {
        shareMsg.imageUrl = share_image;
    }

    shopShare(path);
    return shareMsg;
};

function shopShare(path) {
    const config = wx.getStorageSync(CONFIG);
    if (config.share_enable) {
        setTimeout(() => {
            api.hei.shopShare({ share_url: path });
        }, 1000);
    }
}

export const createCurrentOrder = ({ product, selectedSku = {}, quantity = 1, isGrouponBuy = false, isMiaoshaBuy = false }) => {

    try {

        console.log('selectedSku', selectedSku, product);

        const item = {
            post_id: product.id,
            title: product.title,
            original_price: product.original_price,
            image_url: product.thumbnail,
            price: product.price,
            id: product.id,
            postage: product.postage,
            quantity,
        };

        const order = {
            items: [],
            totalPrice: 0,
            savePrice: 0,
            totalPostage: 0,
        };


        if (selectedSku.id) {
            const { price, id: skuId, property_names, properties, original_price } = selectedSku;
            const { sku_images } = product;
            const firstSelectedSkuPropValue = properties && properties[0].v;
            const selectedSkuImage = properties ? (sku_images[firstSelectedSkuPropValue] && sku_images[firstSelectedSkuPropValue].thumbnail) : null;

            item.sku_id = skuId;
            item.sku_property_names = property_names;

            if (original_price) {
                item.original_price = original_price;
            }

            if (price) {
                item.price = price;
            }

            if (selectedSkuImage) {
                item.image_url = selectedSkuImage;
            }
        }

        if (isGrouponBuy) {
            item.price = product.groupon_price;
        }
        else if (isMiaoshaBuy) {
            item.price = product.miaosha_price;
        }

        order.items = [item];
        order.totalPrice = item.price * quantity;
        order.savePrice = (item.original_price - item.price) * quantity;
        order.totalPostage = product.postage;

        console.log('createCurrentOrder order: ', order);
        return order;
    } catch (e) {
        console.log(e);
    }
};

// export const createCurrentOrder = ({ items, selectedSku }) => {
// 	const order = {
// 		items: [],
// 		totalPrice: 0,
// 		savePrice: 0,
// 	};

// 	console.log('selectedSku', selectedSku);

// 	if (selectedSku) {
// 		const item = items[0];
// 		const { price, id: skuId, property_names, properties, original_price, quantity } = selectedSku;
// 		const { sku_images } = item;
// 		const firstSelectedSkuPropValue = properties && properties[0].v;
// 		const selectedSkuImage = properties ? sku_images[firstSelectedSkuPropValue].thumbnail : null;
// 		item.post_id = item.id;
// 		item.quantity = quantity;
// 		item.sku_id = skuId;
// 		item.sku_property_names = property_names;
// 		item.price = price || items[0].price;
// 		item.original_price = original_price || items[0].original_price;
// 		item.image_url = selectedSkuImage || item.images[0];
// 	};

// 	order.items = items;
// 	console.log('items', items);

// 	items.forEach((item) => {
// 		const { price, original_price, quantity } = item;
// 		console.log(original_price, price);
// 		order.totalPrice = order.totalPrice + (price * quantity);
// 		order.savePrice = order.savePrice + ((original_price - price) * quantity);
// 	});

// 	return order;
// };

export const wxPay = async (options = {}, order_no) => {
    const { timeStamp, nonceStr, package: pkg, signType, paySign } = options;
    try {
        const res = await requestPayment({
            timeStamp,
            nonceStr,
            package: pkg,
            signType,
            paySign,
        });
        if (order_no) {
            api.hei.orderQuery({ order_no }).then((res) => { console.log('orderQuery：', res) });
        }
        await showToast({ title: '支付成功' });
        console.log('requestPayment res', res);
        return res;
    }
    catch (err) {
        console.log('requestPayment err', err);
        const { errMsg } = err;
        if (errMsg.indexOf('cancel') >= 0) {
            await showModal({
                title: '支付取消',
                content: '请尽快完成付款',
                showCancel: false,
            });
            return { isCancel: true };
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

