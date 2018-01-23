import { APPID } from 'constants/index';
import { API } from './core';

const host = 'https://hei.wpweixin.com/';
// const host = 'https://shenghuogou.wpweixin.com/';
// const host = 'https://dpm.wpweixin.com/';

/**
 * path: 接口路径
 * method: 请求方法，默认GET
 * isForceToken: 是否需要带token，默认false
 * requestType: 默认request, [request, uploadFile]
 **/
const apis = {
	login: {
		path: `api2/auth.signon.json?appid=${APPID}`,
		method: 'POST',
	},
	fetchHome: {
		path: `api/mag.shop.home.json`,
	},
	fetchProductList: {
		path: `api/mag.product.list.json`,
	},
	fetchProduct: {
		path: `api/mag.product.get.json`,
	},
	fetchCartList: {
		path: `api/mag.cart.get.json`,
		isForceToken: true,
	},
	addCart: {
		path: `api/mag.cart.add.json`,
		method: 'POST',
		isForceToken: true
	},
	updateCart: {
		path: `api/mag.cart.update.json`,
		method: 'POST',
		isForceToken: true
	},
	removeCart: {
		path: `api/mag.cart.remove.json`,
		method: 'POST',
		isForceToken: true
	},
	clearCart: {
		path: `api/mag.cart.clear.json`,
		method: 'POST',
		isForceToken: true
	},
	fetchOrderList: {
		path: `api/mag.order.list.json`,
		isForceToken: true
	},
	fetchOrder: {
		path: `api/mag.order.get.json`,
		isForceToken: true
	},
	fetchOrderCount: {
		path: `api/mag.order.counts.json`,
		isForceToken: true
	},
	createOrderAndPay: {
		path: `api/mag.order.create.json?pay`,
		method: 'POST',
		isForceToken: true
	},
	createOrder: {
		path: `api/mag.order.create.json`,
		method: 'POST',
		isForceToken: true
	},
	payOrder: {
		path: 'api/mag.order.pay.json',
		method: 'POST',
		isForceToken: true
	},
	closeOrdery: {
		path: 'api/mag.order.close.json',
		method: 'POST',
		isForceToken: true
	},
	confirmOrder: {
		path: 'api/mag.order.confirm.json',
		method: 'POST',
		isForceToken: true
	},
	refund: {
		path: 'api/mag.order.refund.json',
		method: 'POST',
		isForceToken: true
	},
	fetchLogistics: {
		path: 'api/mag.order.logistics.json',
		isForceToken: true
	},
	fetchCategory: {
		path: 'api/mag.product.category.list.json',
	},
	createGroupon: {
		path: 'api/mag.groupon.create.json?pay',
		method: 'POST',
		isForceToken: true
	},
	joinGroupon: {
		path: 'api/mag.groupon.join.json?pay',
		method: 'POST',
		isForceToken: true
	},
	fetchGroupon: {
		path: 'api/mag.groupon.get.json',
		isForceToken: true,
	},
	fetchCouponList: {
		path: 'api/mag.coupon.list.json',
	},
	fetchMyCouponList: {
		path: 'api/mag.coupon.my.json',
		method: 'POST',
		isForceToken: true,
	},
	receiveCoupon: {
		path: 'api/mag.coupon.receive.json',
		method: 'POST',
		isForceToken: true,
	},
	upload: {
		path: 'api2/upload.media.json',
		isForceToken: true,
		method: 'POST',
		requestType: 'uploadFile',
	},
};

export default new API({ apis, host });
