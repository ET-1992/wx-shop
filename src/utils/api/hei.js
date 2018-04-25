import { APPID } from 'constants/index';
import { API } from './core';

const host = 'https://api.wpweixin.com/';

// const host = 'https://shenghuogou.wpweixin.com/';
// const host = 'https://dpm.wpweixin.com/';

/**
 * path: ½Ó¿ÚÂ·¾¶
 * method: ÇëÇó·½·¨£¬Ä¬ÈÏGET
 * isForceToken: ÊÇ·ñÐèÒª´øtoken£¬Ä¬ÈÏfalse
 * requestType: Ä¬ÈÏrequest, [request, uploadFile]
 **/
const apis = {
	login: {

		// path: `api2/auth.signon.json?appid=${APPID}`,
		path: 'api2/auth.signon.json',
		method: 'POST',
	},
	fetchHome: {
		path: 'api/mag.shop.home.json',
	},
	fetchProductList: {
		path: 'api/mag.product.list.json',
	},
	fetchProduct: {
		path: 'api/mag.product.get.json',
	},
	fetchCartList: {
		path: 'api/mag.cart.get.json',
		isForceToken: true,
	},
	addCart: {
		path: 'api/mag.cart.add.json',
		method: 'POST',
		isForceToken: true,
	},
	updateCart: {
		path: 'api/mag.cart.update.json',
		method: 'POST',
		isForceToken: true,
	},
	removeCart: {
		path: 'api/mag.cart.remove.json',
		method: 'POST',
		isForceToken: true,
	},
	clearCart: {
		path: 'api/mag.cart.clear.json',
		method: 'POST',
		isForceToken: true,
	},
	fetchOrderList: {
		path: 'api/mag.order.list.json',
		isForceToken: true,
	},
	fetchOrder: {
		path: 'api/mag.order.get.json',
		isForceToken: true,
	},
	fetchOrderCount: {
		path: 'api/mag.order.counts.json',
		isForceToken: true,
	},
	createOrderAndPay: {
		path: 'api/mag.order.create.json?pay&v2',
		method: 'POST',
		isForceToken: true,
	},
	createOrder: {
		path: 'api/mag.order.create.json',
		method: 'POST',
		isForceToken: true,
	},
	payOrder: {
		path: 'api/mag.order.pay.json?pay&v2',
		method: 'POST',
		isForceToken: true,
	},
	peanutPayOrder: {
		path: 'api/mag.order.pay.peanut.json',
		method: 'POST',
		isForceToken: true,
	},
	closeOrdery: {
		path: 'api/mag.order.close.json',
		method: 'POST',
		isForceToken: true,
	},
	confirmOrder: {
		path: 'api/mag.order.confirm.json',
		method: 'POST',
		isForceToken: true,
	},
	refund: {
		path: 'api/mag.order.refund.json',
		method: 'POST',
		isForceToken: true,
	},
	fetchLogistics: {
		path: 'api/mag.order.logistics.json',
		isForceToken: true,
	},
	fetchCategory: {
		path: 'api/mag.product.category.list.json',
	},
	createGroupon: {
		path: 'api/mag.groupon.create.json?pay&v2',
		method: 'POST',
		isForceToken: true,
	},
	joinGroupon: {
		path: 'api/mag.groupon.join.json?pay&v2',
		method: 'POST',
		isForceToken: true,
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

	// ÎÄÕÂÏêÇé
	articleDetail: {
		path: 'api/mag.article.get.json',
		method: 'GET',
	},

	// ÎÄÕÂÁÐ±í
	articleList: {
		path: 'api/mag.article.list.json',
		method: 'GET',
	},

	// ÊÕ²Ø
	fav: {
		path: 'api/mag.article.fav.json',
		method: 'POST',
		isForceToken: true,
	},
	// È¡ÏûÊÕ²Ø
	unfav: {
		path: 'api/mag.article.unfav.json',
		method: 'POST',
		isForceToken: true,
	},

	// ÊÕ²ØÁÐ±í
	queryFavList: {
		path: 'api/mag.article.fav.list.json',
		method: 'GET',
		isForceToken: true,
	},

	// ÆÀÂÛ
	createReply: {
		path: 'api/mag.article.reply.json',
		method: 'POST',
		isForceToken: true,
	},
	deleteReply: {
		path: 'api/mag.article.reply.delete.json',
		method: 'POST',
		isForceToken: true,
	},
	bindSubmit: {
		path: 'api2/form_id.json',
		method: 'POST',
	},
	submitFormId: {
		path: 'api2/form_id.json',
		method: 'POST',
	},
};

export default new API({ apis, host });
