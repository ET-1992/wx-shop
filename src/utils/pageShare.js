// 用于Page中
// 若需要使用this，不能使用箭头函数，不然this为undefinde

import api from 'utils/api';
import { SHARE_TITLE, CONFIG, USER_KEY } from 'constants/index';
import { showModal, showToast, requestPayment } from 'utils/wxp';
import { auth, subscribeMessage, joinUrl } from 'utils/util';
import wxProxy from 'utils/wxProxy';

// 获取应用实例
const app = getApp(); // eslint-disable-line no-undef

// 聚合聊天分享和朋友圈

function makeShareParams() {
    const params = arguments[0] || {};
    const path_ = arguments[1] || '';
    const redirectObj = arguments[2] || '';
    const type = arguments[3] || 'app';

    console.log(params, path_, redirectObj, type, '---');

    const { share_title, share_image } = this.data;
    const user = wx.getStorageSync(USER_KEY);
    const config = wx.getStorageSync(CONFIG);

    let { currentStore } = app.globalData;
    let { options = {}, route } = this;
    options = { ...options, ...params }; // 页面参数
    console.log(options, '页面参数');

    let path = path_ || route;

    path = joinUrl(path, options);

    if (redirectObj) {
        path = redirectObj.key + '?goPath=/' + encodeURIComponent(path);
    }

    const appParams = { afcode: user.afcode }; // 全局参数

    if (config.offline_store_enable) {
        // 多门店的ID数据
        appParams.storeId = currentStore.id;
    }

    path = joinUrl(path, appParams);

    const shareMsg = {
        title: share_title,
        path,
    };

    if (share_image) {
        shareMsg.imageUrl = share_image;
    }

    if (type === 'timeline') {
        shareMsg.query = (path.split('?') && path.split('?')[1]) || null;
    }

    console.log(shareMsg, 'shareMsg');

    shopShare(path);

    return shareMsg;
}


// 分享朋友圈

export const onDefaultShareAppTimeline = function () {
    arguments[3] = 'timeline';
    const shareMsg = makeShareParams.call(this, arguments[0], arguments[1], arguments[2], arguments[3]);
    return shareMsg;
};



// 全页面分享
export const onDefaultShareAppMessage = function () {
    arguments[3] = 'app';
    const shareMsg = makeShareParams.call(this, arguments[0], arguments[1], arguments[2], arguments[3]);
    return shareMsg;
};

function shopShare(path) {
    const config = wx.getStorageSync(CONFIG);
    if (config.share_enable) {
        if (path.indexOf('webPages/webPages') === -1) {
            console.log('分享获得积分');
            setTimeout(() => {
                api.hei.shopShare({ share_url: path });
            }, 1000);
        }
    }
}

export const createCurrentOrder = ({ product, selectedSku = {}, quantity = 1, isGrouponBuy = false, isMiaoshaBuy = false, isBargainBuy = false }) => {

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
        } else if (isMiaoshaBuy) {
            item.price = product.miaosha_price;
        } else if (isBargainBuy) {
            item.price = product.bargain_price;
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


export const wxPay = async (options = {}, order_no, subKeys = []) => {
    try {
        await wxProxy.requestPayment({
            ...options
        });

        if (subKeys && subKeys.length) {
            console.log(subKeys, 'subKeys');
            // 注意一定要紧跟在requestPayment后面
            await subscribeMessage(subKeys);
        }

        await showToast({ title: '支付成功' });

        if (order_no) {
            api.hei.orderQuery({ order_no }).then((res) => { console.log('orderQuery：', res) });
        }

        return { isSuccess: true };
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

// 云购订单创建
export const createCloudOrder = (arr = []) => {
    let orderList = [];
    arr.forEach(item => {
        let { product, productNum } = item;
        let { title, activity, thumbnail, post_id, id } = product;
        let { current_quantity, quantity, unit_price, round } = activity;
        let order = {
            post_id: post_id || id,  // 商品post-id
            realQuantity: quantity,  // 商品数量
            title,
            round,  // 当前期数
            unit_price,  // 商品单价（金币）
            current_quantity,  // 已售数量
            quantity: productNum,  // 预购买数量
            thumbnail,
        };
        orderList.push(order);
    });
    return orderList;
};