
// const host = 'https://shenghuogou.wpweixin.com/';
// const host = 'https://dpm.wpweixin.com/';

/**
 * path: 接口路径
 * method: 请求方法，默认GET
 * isForceToken: 是否需要带token，默认false
 * requestType: 默认request, [request, uploadFile]
 **/
// export const host = 'https://api.wpweixin.com/';
export const host = 'https://hei.dev.97866.com/';
export const apis = {
    login: {
        // path: `api/mag.auth.signon.json?appid=${APPID}`,
        path: 'api/mag.auth.signon.json',
        method: 'POST',
    },
    fetchHome: {
        path: 'api/mag.shop.home.json?v2'
    },
    fetchShopExtra: {
        path: 'api/mag.shop.extra.json',
        isForceToken: true
    },
    fetchProductList: {
        path: 'api/mag.product.list.json',
    },
    fetchProduct: {
        path: 'api/mag.product.get.json?v2'
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
        method: 'GET',
        isForceToken: true,
    },
    fetchMyCouponList: {
        path: 'api/mag.coupon.my.json?v2',
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
    // 商品评论列表
    productCommentList: {
        path: 'api/mag.product.reply.list.json',
        method: 'GET',
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
        isForceToken: true,
    },
    myFare: {
        path: 'api/mag.shop.my.json',
        isForceToken: true,
    },
    // 推广中心
    shareUserInfo: {
        path: 'api/mag.affiliate.member.get.json',
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
    },
    payDirect: {
        path: 'api/mag.order.pay.direct.json',
        method: 'POST',
        isForceToken: true
    },
    crowdList: {
        path: 'api/mag.order.crowd.list.json',
        isForceToken: true
    },
    crowdCreate: {
        path: 'api/mag.order.crowd.pay.create.json',
        method: 'POST',
        isForceToken: true
    },
    crowdRefund: {
        path: 'api/mag.order.crowd.refund.json',
        method: 'POST',
        isForceToken: true
    },
    crowdPay: {
        path: 'api/mag.order.crowd.pay.json',
        method: 'POST',
        isForceToken: true
    },
    config: {
        path: 'api/mag.shop.config.json',
        method: 'GET',
        isForceToken: true
    },
    getRule: {
        path: 'api/mag.component.article.get.json',
        method: 'GET',
        isForceToken: true
    },
    orderQuery: {
        path: 'api/mag.order.query.json',
        method: 'POST',
        isForceToken: true
    },
    // 上传身份信息
    uploadIdentity: {
        path: 'api/mag.shop.user.profile.update.json',
        method: 'POST',
        isForceToken: true
    },
    // 获取身份信息
    getIdentityInfo: {
        path: 'api/mag.shop.user.profile.get.json',
        isForceToken: true
    },
    favProduct: {
        path: 'api/mag.product.fav.json',
        method: 'POST',
        isForceToken: true
    },
    unFavProduct: {
        path: 'api/mag.product.unfav.json',
        method: 'POST',
        isForceToken: true
    },
    getFavProductList: {
        path: 'api/mag.product.fav.list.json',
        isForceToken: true
    },
    // 开通会员,充值金额
    joinMembership: {
        path: 'api/mag.membership.pay.json',
        isForceToken: true,
        method: 'POST'
    },
    // 签到
    signIn: {
        path: 'api/mag.membership.checkin.json',
        isForceToken: true
    },
    // 规则
    getShopRule: {
        path: 'api/mag.shop.rule.json',
        isForceToken: true
    },
    // 会员中心-储值卡
    membershipCard: {
        path: 'api/mag.membership.home.json',
        isForceToken: true
    },
    // 可充值金额
    rechargePrice: {
        path: 'api/mag.membership.recharge.json',
        isForceToken: true
    },
    // 消费记录
    consumptionLog: {
        path: 'api/mag.membership.store.card.log.json',
        isForceToken: true
    },
    // 删除会员
    test: {
        path: 'api/mag.membership.test.json',
        isForceToken: true
    },
    // 会员中心积分列表
    getIntegralList: {
        path: 'api/mag/membership.log.json',
        isForceToken: true
    },
    // 推广中心更新用户名
    updateUserInfo: {
        path: 'api/mag.affiliate.update.userinfo.json',
        method: 'POST',
        isForceToken: true
    },
    // 推广中心浏览用户
    getVisitorData: {
        path: 'api/mag.affiliate.browse.user.list.json',
        isForceToken: true
    },
    recordAffiliateBrowse: {
        path: 'api/mag.affiliate.browse.record.json',
        isForceToken: true,
        method: 'POST'
    },
    // 会员分享
    membershipShare: {
        path: 'api/mag/membership.share.json',
        method: 'POST',
        isForceToken: true
    }
};
