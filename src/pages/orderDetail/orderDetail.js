import api from 'utils/api';
import { STATUS_TEXT, USER_KEY, ORDER_STATUS_TEXT, LOGISTICS_STATUS_TEXT, MAGUA_ORDER_STATUS_TEXT, CONFIG, PAY_STYLES, PLATFFORM_ENV } from 'constants/index';
import { formatTime, valueToText, getNodeInfo, splitUserStatus, getUserProfile, go } from 'utils/util';
import getRemainTime from 'utils/getRemainTime';
import templateTypeText from 'constants/templateType';
import { qrcode } from 'peanut-all';
import { createCurrentOrder, onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';

const app = getApp();

const o = {
    'magua': MAGUA_ORDER_STATUS_TEXT
};

const D_ORDER_STATUS_TEXT = o[app.globalData.defineTypeGlobal] || ORDER_STATUS_TEXT;

Page({
    data: {
        order: {},
        groupon: {},
        logistics: {},
        redpacket: {},
        isFromCreate: 0,

        isLoading: false,

        address: {},

        virtualProductBtn: true,

        templateTypeText,

        payMethod: {
            'WEIXIN': '微信支付',
            'STORE_CARD': '储值卡支付'
        },
        PLATFFORM_ENV,

        isShowShareModal: false,
        showPosterModal: false,
    },

    onLoad({ isFromCreate = 0 }) {
        console.log(typeof (isFromCreate), '--------------------------');
        console.log(Number(isFromCreate), '--------------------------');
        wx.hideShareMenu();
        const { globalData: { themeColor, defineTypeGlobal, vip }, systemInfo: { isIphoneX }} = app;
        const config = wx.getStorageSync(CONFIG);

        this.setData({
            themeColor,
            vip,
            defineTypeGlobal,
            isIphoneX,
            isFromCreate: Number(isFromCreate),
            config,
            globalData: app.globalData,
            isLoading: true
        });
    },

    async onShow() {
        const { id, grouponId } = this.options;
        const current_user = wx.getStorageSync(USER_KEY);
        this.setData({
            current_user,
            grouponId
        });


        if (grouponId) {
            await this.loadGroupon(grouponId);
        } else {
            await this.loadOrder(id);
        }

        // grouponId ? await this.loadOrder(id) : await this.loadGroupon(grouponId);

        console.log(this.data);
    },

    go,

    async loadOrder(id) {
        wx.setNavigationBarTitle({ title: '订单详情' });
        const { order, redpacket = {}, products, config, current_user = {}} = await api.hei.fetchOrder({ order_no: id });
        const data = { order, redpacket, current_user };
        let statusCode = Number(order.status);

        let address = {};
        address.userName = order.receiver_name;
        address.telNumber = order.receiver_phone;
        address.nationalCode = order.receiver_country;
        address.provinceName = order.receiver_state;
        address.cityName = order.receiver_city;
        address.countyName = order.receiver_district;
        address.detailInfo = order.receiver_address;
        address.postalCode = order.receiver_zipcode;
        address.room = order.room;

        order.statusText = valueToText(D_ORDER_STATUS_TEXT, statusCode);

        order.payMethodText = valueToText(PAY_STYLES, order.pay_method);
        order.statusCode = statusCode;
        order.buyer_message = order.buyer_message || '买家未留言';
        order.createDate = formatTime(new Date(order.time * 1000));
        order.payDate = formatTime(new Date(order.paytime * 1000));
        order.consignDate = formatTime(new Date(order.consign_time * 1000));
        order.refundDate = formatTime(new Date(order.refund_time * 1000));
        order.total_fee = (order.total_fee - 0).toFixed(2);
        order.discount_fee = (order.discount_fee - 0).toFixed(2);


        // -----------------处理价格显示
        let info = {};

        info.couponFeeDispaly = order.coupon_discount_fee; // 优惠券
        info.couponFee = Number(order.coupon_discount_fee);

        // 优惠码
        let discountCode = order.discount_code && order.discount_code.reduce_fee;
        info.discountCode = Number(discountCode);
        info.discountCodeDisplay = Number(discountCode).toFixed(2);

        info.coinForPayDispaly = order.coins_fee; // 金币
        info.coinForPay = Number(order.coins_fee);

        info.postageDispaly = Number(order.postage).toFixed(2); // 运费
        info.postage = order.postage;

        info.totalPrice = Number(order.item_amount);// 商品价格
        info.totalPriceDispaly = Number(info.totalPrice).toFixed(2);

        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);
        // -----------------End

        if (statusCode === 4 || statusCode === 6 || statusCode === 7 || statusCode === 8) {
            order.isDone = true;
        }

        // console.log(order.logistics_info);
        // if (statusCode > 2 && statusCode < 5) {
        //     data.logistics = order.logistics_info;

        // }

        // let logisticsForItem = []; // 已发货快递的item ID  后端不吐出未发货字段 自己筛选
        order.logistics && order.logistics.forEach((item) => {
            // item.logisticsItems = this.filterItemsForLogistics(order.items, item.item_ids);
            // console.log(item, 'item');
            // logisticsForItem = logisticsForItem.concat(item.item_ids);
            item.logisticsText = valueToText(LOGISTICS_STATUS_TEXT, item.status);
            item.defineTime = formatTime(new Date(item.consign_time * 1000));
        });

        // 订单留言 适配以前的键值对的格式
        let remarkForm = [];
        if (order.annotation && order.annotation.remarks) {
            let { remarks } = order.annotation;
            if (Array.isArray(remarks)) {
                remarkForm = remarks;
            } else {
                for (let name in remarks) {
                    if (!remarks.hasOwnProperty(name)) { continue }
                    let value = remarks[name],
                        type = 'text';
                    if (value && value.indexOf('http') >= 0) {
                        type = 'img';
                        value = [{ url: value }];
                    }
                    remarkForm.push({ name, value, type, });
                }
            }
        }


        // order.noLogisticsForItem = order.items && order.items.filter((item) => { // 未发货items
        //     return logisticsForItem.indexOf(item.id) === -1;
        // });

        if (statusCode === 3) {
            data.remainSecond = order.auto_confirm_in_seconds;
        }

        if (statusCode === 10) {
            wx.showShareMenu();
            wx.setNavigationBarTitle({ title: '拼团详情' });
            const { time_expired } = order.groupon;
            const now = Math.round(Date.now() / 1000);
            const remainSecond = time_expired - now;
            data.remainSecond = remainSecond;
            data.remainTime = getRemainTime(remainSecond).join(':');
            data.products = products;
        }

        // ------------拼团头像
        if (order.status === 10 && order.groupon_id && order.groupon) {
            let grouponDefaultImageArray = [];
            for (let i = 0; i < (order.groupon.member_limit - order.groupon.member_count); i++) {
                grouponDefaultImageArray.push('/icons/default_groupon_avatar.png');
            }
            this.setData({
                groupon: order.groupon,
                grouponDefaultImageArray
            });
        }

        this.setData({
            address,
            info,
            isLoading: false,
            config,
            remarkForm,
            ...data
        });
    },
    async loadGroupon(id) {
        wx.setNavigationBarTitle({ title: '拼团详情' });
        wx.showShareMenu();
        console.log('grouponId', id);
        const data = await api.hei.fetchGroupon({ id });
        const { time_expired } = data.groupon;
        const now = Math.round(Date.now() / 1000);
        const remainSecond = time_expired - now;
        data.remainSecond = remainSecond;
        data.remainTime = getRemainTime(remainSecond).join(':');
        data.otherPeopleGroupon = true;

        let grouponDefaultImageArray = [];
        for (let i = 0; i < (data.groupon.member_limit - data.groupon.member_count); i++) {
            grouponDefaultImageArray.push('/icons/default_groupon_avatar.png');
        }

        this.setData({
            grouponDefaultImageArray,
            isLoading: false,
            ...data
        });
    },

    async bindGetUserInfo(e) {
        const { isNewUserGroupon, isGrouponBuy = false, isCrowd = false } = e.currentTarget.dataset;
        await getUserProfile();
        this.onJoin({ isNewUserGroupon, isGrouponBuy, isCrowd });
    },

    onJoin(e) {
        const { isNewUserGroupon, isGrouponBuy, isCrowd } = e;
        const { groupon, product } = this.data;
        const current_user = wx.getStorageSync(USER_KEY);
        console.log('current_user:', current_user);
        let isUserHasPayOrder = current_user ? splitUserStatus(current_user.user_status).isUserHasPayOrder : false;

        if (isNewUserGroupon && isUserHasPayOrder) {
            wx.showModal({
                title: '温馨提示',
                content: '您不是新用户不能参与该拼团',
                showCancel: false
            });
            return;
        }
        if (current_user && groupon.user && (current_user.openid === groupon.user.openid)) {
            wx.showModal({
                title: '温馨提示',
                content: '不能参加自己的拼团',
                showCancel: false
            });
            return;
        }
        if (product.status === 'unpublished' || product.status === 'sold_out') {
            wx.showModal({
                title: '温馨提示',
                content: `商品已${product.status === 'unpublished' ? '下架' : '售罄'}`,
                showCancel: false
            });
            return;
        }
        product.definePrice = product.groupon_price;
        product.showOriginalPrice = product.groupon_price !== product.original_price;

        this.setData({
            current_user,
            isShowActionSheet: true,
            quantity: 1,
            product,
            isGrouponBuy,
            isCrowd
        });
    },

    // 参团页SKU购买回调
    async onSkuConfirm(e) {
        wx.showLoading({
            title: '请求中...',
            mask: true
        });
        const { actionType, queryData } = e.detail;

        const {
            selectedSku,
            quantity,
            currentSpecial,
            currentRelation,
        } = queryData;

        const { current_user, product, grouponId, isGrouponBuy, isCrowd, shipping_type } = this.data;

        if (selectedSku.stock === 0) {
            await proxy.showModal({
                title: '温馨提示',
                content: '无法购买库存为0的商品',
            });
            return;
        }

        // 非会员不能购买会员专属商品 立即购买
        if (current_user && current_user.membership && !current_user.membership.is_member && product.membership_dedicated_enable) {
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '该商品是会员专属商品，请开通会员后购买'
            });
            if (confirm) {
                wx.navigateTo({
                    url: '/pages/membership/members/members'
                });
            }
            return;
        }

        let url = `/pages/orderCreate/orderCreate?shipping_type=${shipping_type}`;
        let { product_type } = product;
        url += `&product_type=${product_type}`;
        if (isGrouponBuy && grouponId) {
            url = url + `&isGrouponBuy=true&grouponId=${grouponId}`;
        }
        if (isCrowd) {
            url = url + '&crowd=true';
        }

        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
            isGrouponBuy,
            currentSpecial,
            currentRelation,
        });

        app.globalData.currentOrder = currentOrder;

        this.setData({ isShowActionSheet: false });
        wx.navigateTo({ url });
        wx.hideLoading();
    },

    onRelaodOrder(ev) {
        const { orderNo } = ev.detail;
        wx.redirectTo({
            url: `/pages/orderDetail/orderDetail?id=${orderNo}`
        });
    },

    showShareModal() {
        const { isShowShareModal } = this.data;
        this.setData({
            isShowShareModal: !isShowShareModal
        });
    },

    /**
     * 默认隐藏页面分享按钮，待成团页面开启
     */
    onShareAppMessage({ target }) {
        console.log('target', target);

        const { current_user = {}, groupon = {}, redpacket = {}} = this.data;

        let data = {
            share_title: `${current_user.nickname || '好友'}邀请你一起拼团`,
            share_image: groupon.image_url
        };
        let path = `/pages/orderDetail/orderDetail?grouponId=${groupon.id}`;

        if (typeof (target) !== 'undefined') {

            // 点击分享红包
            const { isModal, isRedpocketShare } = target.dataset;
            if (isModal || isRedpocketShare) {
                data = {
                    isShared: true,
                    share_title: `${current_user.nickname || '好友'}给你发来了一个红包，快去领取吧`,
                    share_image: 'http://cdn2.wpweixin.com/shop/redpacketShare.jpg'
                };
                path = '/pages/redpacket/redpacket';
            }
        }

        this.setData(data);

        return onDefaultShareAppMessage.call(this, {
            id: redpacket.pakcet_no
        }, path);
    },

    filterItemsForLogistics(items = [], logistics = []) {
        const filterItems = items.filter((item) => {
            return logistics.indexOf(item.id) > -1;
        });
        return filterItems;
    },

    toLogisticsDetail(e) {
        const { index } = e.currentTarget.dataset;
        const { order } = this.data;
        // app.globalData.logisticsDetail = {
        //     logistics: order && order.logistics && order.logistics[index],
        //     items: order.items
        // };
        wx.navigateTo({
            url: `/pages/logistics/logistics?orderNo=${order.order_no}&logisticsIndex=${index}&logisticId=${order.logistics && order.logistics[index] && order.logistics[index].id}`
        });
    },

    toExchangeCardPage(e) {
        const { code, password } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/exchangeCard/exchangeCard?code=${code}&password=${password}`
        });
    },

    async setClipboardVp(e) {
        const { value } = e.currentTarget.dataset;
        console.log(e);
        await proxy.setClipboardData({ data: String(value) });
        wx.showToast({
            title: '复制成功',
            icon: 'success'
        });
    },

    setVirtualProductBtn() {
        this.setData({
            virtualProductBtn: false
        });
    },

    openLiftInfoModal() {
        const { order } = this.data;
        this.setData({
            liftInfoModal: true
        }, async () => {
            const nodeInfo = await getNodeInfo('liftInfoId');
            let { width, height } = nodeInfo;
            if (!width || !height) {
                width = 250;
                height = 250;
            }
            qrcode.api.draw('D-' + order.order_code, 'liftInfoCanvasId', width, height);
        });
    },

    closeLiftInfoModal() {
        this.setData({
            liftInfoModal: false
        });
    },

    // 物流选项组件回调
    getShippingType(e) {
        let { shipping_type } = e.detail;
        // console.log('shipping_type696', shipping_type);
        this.setData({ shipping_type });
    },

    onShowPoster() {
        const {
            order: { groupon }
        } = this.data;

        const now = Math.round(Date.now() / 1000);
        let remainSecond = groupon.time_expired - now;

        let posterData = {
            id: groupon.id,
            post_id: groupon.post_id,
            sku_id: groupon.sku_id,
            price: groupon.price,
            member_limit: groupon.member_limit,
            remainSecond
        };

        this.setData({
            showPosterModal: true,
            isShowShareModal: false,
            posterData
        });
    },

    onClosePoster() {
        this.setData({
            showPosterModal: false
        });
    },

    preventTouchMove() {
        console.log('阻止自提码弹窗触摸滑动');
    },
});
