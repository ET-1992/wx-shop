import { APPID } from 'constants/index';
import { API } from './core';

const host = 'https://api.wpweixin.com/';

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
        // path: `api/mag.auth.signon.json?appid=${APPID}`,
        path: 'api/mag.auth.signon.json',
        method: 'POST',
    },
    fetchHome: {
        path: 'api/mag.shop.home.json',
        isForceToken: true,
    },
    fetchProductList: {
        path: 'api/mag.product.list.json',
    },
    fetchProduct: {
        path: 'api/mag.product.get.json',
        method: 'GET',
        isForceToken: true,
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
    orderPrepare: {
        path: 'api/mag.order.prepare.json',
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
    fetchLogistic: {
        path: 'api/mag.order.logistic.json',
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
        path: 'api/mag.upload.media.json',
        isForceToken: true,
        method: 'POST',
        requestType: 'uploadFile',
    },

    // 文章详情
    articleDetail: {
        path: 'api/mag.article.get.json',
        method: 'GET',
    },

    // 文章列表
    articleList: {
        path: 'api/mag.article.list.json',
        method: 'GET',
    },

    // 收藏
    fav: {
        path: 'api/mag.article.fav.json',
        method: 'POST',
        isForceToken: true,
    },

    // 取消收藏
    unfav: {
        path: 'api/mag.article.unfav.json',
        method: 'POST',
        isForceToken: true,
    },

    // 收藏列表
    queryFavList: {
        path: 'api/mag.article.fav.list.json',
        method: 'GET',
        isForceToken: true,
    },

    // 评论
    createReply: {
        path: 'api/mag.article.reply.json',
        method: 'POST',
        isForceToken: true,
    },
    // 商品评论
    productComment: {
        path: 'api/mag.product.reply.json',
        method: 'POST',
        isForceToken: true,
    },
    deleteReply: {
        path: '',
        method: 'POST',
        isForceToken: true,
    },
    submitFormId: {
        path: 'api/mag.form_id.json',
        method: 'POST',
    },
    receiveCouponAll: {
        path: 'api/mag.coupon.batch.receive.json',
        method: 'POST',
        isForceToken: true,
    },
    fetchRedpacket: {
        path: 'api/mag.redpacket.shared.get.json',
    },
    receiveRedpacket: {
        path: 'api/mag.redpacket.receive.json',
        method: 'POST',
        isForceToken: true,
    },
    silentLogin: {
        path: 'api/mag.user.login.json',
        method: 'POST',
    },
    getUserInfo: {
        path: 'api/mag.user.info.json',
        method: 'POST',
        isForceToken: true,
    },
    wallet: {
        path: 'api/mag.wallet.logs.json',
        method: 'GET',
        isForceToken: true,
    },
    myFare: {
        path: 'api/mag.shop.my.json',
        method: 'GET',
        isForceToken: true,
    },
    shareUserInfo: {
        path: 'api/mag.affiliate.member.get.json',
        method: 'GET',
        isForceToken: true
    },
    joinShareUser: {
        path: 'api/mag.affiliate.join.json',
        method: 'POST',
        isForceToken: true
    },
    getWelcomeShare: {
        path: 'api/mag.affiliate.welcome.json',
        method: 'GET',
        isForceToken: true
    },
    getShareMoney: {
        path: 'api/mag.affiliate.withdraw.json',
        method: 'POST',
        isForceToken: true
    },
    showMoneyLog: {
        path: 'api/mag.affiliate.member.logs.json',
        method: 'GET',
        isForceToken: true
    },
    getMoneyLog: {
        path: 'api/mag.wallet.withdrawals.json',
        method: 'GET',
        isForceToken: true
    },
    getShareOrderList: {
        path: 'api/mag.affiliate.order.list.json',
        method: 'GET',
        isForceToken: true
    },
    getShareCustomerList: {
        path: 'api/mag.affiliate.member.list.json',
        method: 'GET',
        isForceToken: true
    },
    getShareQrcode: {
        path: 'api/mag.affiliate.qrcode.json',
        method: 'POST',
        isForceToken: true
    },
    getShareProductList: {
        path: 'api/mag.affiliate.product.list.json',
        method: 'GET',
        isForceToken: true
    },
    bindShare: {
        path: 'api/mag.affiliate.bind.json',
        method: 'POST',
        isForceToken: true
    },
    liftList: {
        path: 'api/mag.order.liftingaddress.json',
        method: 'GET',
        isForceToken: true
    }
};

export default new API({ apis, host });
