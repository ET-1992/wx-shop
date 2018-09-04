import api from 'utils/api';
import { STATUS_TEXT, USER_KEY, ORDER_STATUS_TEXT, LOGISTICS_STATUS_TEXT } from 'constants/index';
import { formatTime, valueToText } from 'utils/util';
import getRemainTime from 'utils/getRemainTime';
import { setClipboardData, showToast } from 'utils/wxp';

const app = getApp();

const formatConfirmTime = (seconds) => {
    let remainSeconds = seconds;
    const day = Math.floor(remainSeconds / (24 * 60 * 60));
    remainSeconds = remainSeconds % (24 * 60 * 60);
    const hour = Math.floor(remainSeconds / (60 * 60));
    remainSeconds = remainSeconds % (60 * 60);
    const minute = Math.floor(remainSeconds / 60);
    const second = remainSeconds % 60;
    const unit = ['天', '时', '分', '秒'];
    const dateStr = [day, hour, minute, second].reduce((str, value, index) => {
        let dateStr = str;
        if (value) {
            dateStr = dateStr + value + unit[index];
        }
        return dateStr;
    }, '');
    return { remainTime: dateStr, remainSecond: seconds };
};

Page({
    data: {
        order: {},
        groupon: {},
        logistics: {},
        redpacket: {},
        isFromCreate: false,

        isLoading: false,

        address: {},

        virtualProductBtn: true
    },

    async loadOrder(id) {
        const { order, redpacket = {}} = await api.hei.fetchOrder({ order_no: id });
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

        order.statusText = valueToText(ORDER_STATUS_TEXT, statusCode);
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

        info.totalPrice = Number(order.amount) - info.postage + info.couponFee + info.coinForPay;// 商品价格
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
        console.log(order);

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
            const { remainTime, remainSecond } = formatConfirmTime(order.auto_confirm_in_seconds);
            data.remainTime = remainTime;
            data.remainSecond = remainSecond;
        }

        if (statusCode === 10) {
            const { time_expired } = order.groupon;
            const now = Math.round(Date.now() / 1000);
            const remainSecond = time_expired - now;
            data.remainSecond = remainSecond;
            data.remainTime = getRemainTime(remainSecond).join(':');
            console.log(data);
        }
        else {
            wx.hideShareMenu();
        }
        console.log(data, 'data');
        this.setData(data);
        this.setData({ address, info });
    },
    async loadGroupon(id) {
        console.log('grouponId', id);
        const data = await api.hei.fetchGroupon({ id });
        console.log(data, 'grouponData');
        const { time_expired } = data.groupon;
        const now = Math.round(Date.now() / 1000);
        const remainSecond = time_expired - now;
        data.remainSecond = remainSecond;
        data.remainTime = getRemainTime(remainSecond).join(':');
        data.otherPeopleGroupon = true;
        this.setData(data);
    },

    // async loadRedpacket(id) {
    // 	const { redpacket } = await api.hei.fetchRedpacket({ order_no: id });
    // 	this.setData({ redpacket });
    // },

    countDown() {
        const { remainSecond } = this.data;
        if (remainSecond) {
            this.intervalId = setInterval(() => {
                const { remainSecond } = this.data;
                this.setData({
                    remainSecond: remainSecond - 1,
                    // remainTime: getRemainTime(remainSecond - 1).join(':')
                    ...formatConfirmTime(remainSecond - 1)
                });
            }, 1000);
        }
    },

    onLoad({ isFromCreate = false }) {
        const { globalData: { themeColor }, systemInfo } = app;
        this.setData({
            themeColor,
            systemInfo,
            isFromCreate,
            isLoading: true
        });
    },

    async onShow() {
        const { id, grouponId } = this.options;
        const user = wx.getStorageSync(USER_KEY);
        this.setData({ user });

        if (id) {
            await this.loadOrder(id);
        }
        else {
            await this.loadGroupon(grouponId);
        }

        this.setData({ isLoading: false });
        this.countDown();

        console.log(this.data);
    },

    onUnload() {
        clearInterval(this.intervalId);
    },

    onHide() {
        clearInterval(this.intervalId);
    },

    onShare() {
        wx.showShareMenu();
    },

    onJoin() {
        const { groupon, order } = this.data;
        const id = groupon.post_id || order.items[0].post_id;
        const grouponId = groupon.id || order.groupon.id;
        wx.navigateTo({
            url: `/pages/productDetail/productDetail?id=${id}&grouponId=${grouponId}`
        });
    },

    onRelaodOrder(ev) {
        const { orderNo } = ev.detail;
        wx.redirectTo({
            url: `/pages/orderDetail/orderDetail?id=${orderNo}`
        });
    },


    onShareAppMessage({ target }) {
        const { isModal, isRedpocketShare, isShareGroupon } = target.dataset;
        const { nickname } = this.data.user;
        const { groupon = {}, order = {}, redpacket = {}} = this.data;

        console.log('target', target);

        if (isShareGroupon) {
            const grouponId = groupon.id || order.groupon_id;
            let shareMsg = {
                title: '小嘿店',
                path: '/pages/home/home',
                imageUrl: groupon.image_url || (order.items && order.items[0].image_url)
            };
            if (order.id || groupon.status === 2) {
                shareMsg = {
                    title: `${nickname}邀请你一起拼团`,
                    path: `/pages/orderDetail/orderDetail?grouponId=${grouponId}`,
                    imageUrl: groupon.image_url || order.groupon.image_url
                };
            }
            console.log(shareMsg);
            return shareMsg;
        }
        else if (isModal || isRedpocketShare) {
            this.setData({ isShared: true });
            return {
                title: `好友${nickname}给你发来了一个红包，快去领取吧`,
                path: `/pages/redpacket/redpacket?id=${redpacket.pakcet_no}`,
                imageUrl: 'http://cdn2.wpweixin.com/shop/redpacketShare.jpg'
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
    }
});
