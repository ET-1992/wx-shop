import api from 'utils/api';
import { STATUS_TEXT, USER_KEY, ORDER_STATUS_TEXT, LOGISTICS_STATUS_TEXT, MAGUA_ORDER_STATUS_TEXT, CONFIG } from 'constants/index';
import { formatTime, valueToText, getNodeInfo, splitUserStatus } from 'utils/util';
import getRemainTime from 'utils/getRemainTime';
import { setClipboardData, showToast } from 'utils/wxp';
import templateTypeText from 'constants/templateType';
import { qrcode  } from 'peanut-all';

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
        isFromCreate: false,

        isLoading: false,

        address: {},

        virtualProductBtn: true,

        templateTypeText,

        payMethod: {
            'WEIXIN': '微信支付',
            'STORE_CARD': '储值卡支付'
        },

        isShowShareModal: false
    },

    onLoad({ isFromCreate = false }) {
        wx.hideShareMenu();
        const { globalData: { themeColor, defineTypeGlobal, vip }, systemInfo: { isIphoneX }} = app;
        const config = wx.getStorageSync(CONFIG);

        this.setData({
            themeColor,
            vip,
            defineTypeGlobal,
            isIphoneX,
            isFromCreate,
            config,
            routePath: this.route
        });
    },

    async onShow() {
        const { id, grouponId } = this.options;
        const user = wx.getStorageSync(USER_KEY);
        this.setData({
            user,
            grouponId,
            isLoading: true
        });

        id ? await this.loadOrder(id) : await this.loadGroupon(grouponId);

        console.log(this.data);
    },

    async loadOrder(id) {
        wx.setNavigationBarTitle({ title: '订单详情' });
        const { order, redpacket = {}, products, config, current_user = {}} = await api.hei.fetchOrder({ order_no: id });
        const data = { order, redpacket };
        const statusCode = Number(order.status);
        let address = {};
        address.userName = order.receiver_name;
        address.telNumber = order.receiver_phone;
        address.nationalCode = order.receiver_country;
        address.provinceName = order.receiver_state;
        address.cityName = order.receiver_city;
        address.countyName = order.receiver_district;
        address.detailInfo = order.receiver_address;
        address.postalCode = order.receiver_zipcode;

        order.statusText = valueToText(D_ORDER_STATUS_TEXT, statusCode);
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

        let logisticsForItem = []; // 已发货快递的item ID  后端不吐出未发货字段 自己筛选
        order.logistics && order.logistics.forEach((item) => {
            item.logisticsItems = this.filterItemsForLogistics(order.items, item.item_ids);
            console.log(item, 'item');
            logisticsForItem = logisticsForItem.concat(item.item_ids);
            item.logisticsText = valueToText(LOGISTICS_STATUS_TEXT, item.status);
            item.defineTime = formatTime(new Date(item.consign_time * 1000));
        });


        order.noLogisticsForItem = order.items && order.items.filter((item) => { // 未发货items
            return logisticsForItem.indexOf(item.id) === -1;
        });

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
            let routeQuery = {
                grouponId: order.groupon && order.groupon.id,
                afcode: current_user && current_user.afcode || ''
            };
            this.setData({
                groupon: order.groupon,
                grouponDefaultImageArray,
                routeQuery
            });
        }

        this.setData({
            address,
            info,
            isLoading: false,
            config,
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

    // async loadRedpacket(id) {
    // 	const { redpacket } = await api.hei.fetchRedpacket({ order_no: id });
    // 	this.setData({ redpacket });
    // },

    /* onShare() {
        wx.showShareMenu();
    }, */

    onJoin(e) {
        const { isNewUserGroupon } = e.currentTarget.dataset;
        const { current_user, groupon } = this.data;
        let isUserHasPayOrder = current_user ? splitUserStatus(current_user.user_status).isUserHasPayOrder : false;

        if (isNewUserGroupon && isUserHasPayOrder) {
            wx.showModal({
                title: '温馨提示',
                content: '您不是新用户不能参与该拼团',
                showCancel: false
            });
        } else if (current_user && groupon.user && (current_user.openid === groupon.user.openid)) {
            wx.showModal({
                title: '温馨提示',
                content: '不能参加自己的拼团',
                showCancel: false
            });
        } else {
            const { groupon, order } = this.data;
            const id = groupon.post_id || order.items[0].post_id;
            const grouponId = groupon.id || order.groupon.id;
            wx.navigateTo({
                url: `/pages/productDetail/productDetail?id=${id}&grouponId=${grouponId}`
            });
        }
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

    async isShowProductDetailShareModal() {
        const { order } = this.data;
        const { time_expired } = order.groupon;
        const now = Math.round(Date.now() / 1000);
        let remainSecond = time_expired - now;
        let remainTime = getRemainTime(remainSecond).join(':');

        this.setData({
            isShowProductDetailShareModal: true,
            isShowShareModal: false,
            remainTime,
            remainSecond
        });
    },

    onCloseProductDetailShareModal() {
        this.setData({
            isShowProductDetailShareModal: false
        });
    },

    onShareAppMessage({ target }) {
        const { user, groupon = {}, redpacket = {}, config } = this.data;

        console.log('target', target);
        if (typeof (target) !== 'undefined') {  // 点击按钮进来
            const { isModal, isRedpocketShare, isShareGroupon } = target.dataset;
            if (isModal || isRedpocketShare) {
                this.setData({ isShared: true });
                return {
                    title: `${user.nickname ? user.nickname : '好友'}给你发来了一个红包，快去领取吧`,
                    path: `/pages/redpacket/redpacket?id=${redpacket.pakcet_no}`,
                    imageUrl: `${config.cdn_host}/shop/redpacketShare.jpg`
                };
            }
            if (isShareGroupon && groupon.status === 2) {
                this.showShareModal();
                return {
                    title: `${user.nickname ? user.nickname : '好友'}邀请你一起拼团`,
                    path: `/pages/orderDetail/orderDetail?grouponId=${groupon.id}`,
                    imageUrl: groupon.image_url
                };
            }
        } else {    // 右上角转发按钮
            return {
                title: `${user.nickname ? user.nickname : '好友'}邀请你一起拼团`,
                path: `/pages/orderDetail/orderDetail?grouponId=${groupon.id}`,
                imageUrl: groupon.image_url
            };

        }
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

    async setClipboardVp(e) {
        const { value } = e.currentTarget.dataset;
        console.log(e);
        await setClipboardData({ data: String(value) });
        showToast({
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
            const { width, height } = nodeInfo;
            qrcode.api.draw('D-' + order.order_code, 'liftInfoCanvasId', width, height);
        });
    },

    closeLiftInfoModal() {
        this.setData({
            liftInfoModal: false
        });
    }
});
