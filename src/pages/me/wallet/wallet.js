import api from 'utils/api';
import { getAgainUserForInvalid, go } from 'utils/util';
import { CONFIG } from 'constants/index';

const app = getApp();
let walletTabs = [
    { key: 'electronic_ticket', name: '优惠券', amount: '0' },
    { key: 'gift_card', name: '礼品卡', amount: '0' },
    { key: 'electronic_ticket', name: '电子卡券', amount: '0' },
];
Page({
    data: {
        title: 'wallet',
        isLoading: true,
        coupons: [], // 优惠券
        gCard: [],  // 礼品卡
        eCard: [],  // 电子卡券
        currentUser: {},
        config: {},
        themeColor: {},
        walletTabs: walletTabs,
        currentTab: 0, // 当前标签类型
        couponTab: 0,  // 优惠券标签类型
        next_cursor: 0,
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG);
        const { themeColor } = app.globalData;
        this.setData({ config, themeColor });
        this.getWalletData();
    },

    go,

    // 选择对应标签
    onWalletTab(e) {
        // console.log('e', e);
        let { index } = e.currentTarget.dataset;
        this.setData({ currentTab: index });
        this.getWalletData();
    },

    // 选择优惠券类型
    onCouponTab(e) {
        // console.log('e', e);
        let { index } = e.detail;
        this.setData({ couponTab: index });
    },

    // 获取钱包数据
    async getWalletData() {
        let { currentTab, next_cursor: cursor } = this.data,
            method = ['fetchMyCouponList', 'fetchMyGiftCardList', 'fetchMyTicketList'][currentTab];
        this.setData({ isLoading: true });
        let requeset = { cursor };
        const data = await api.hei[method](requeset);

        this.updateWalletData(data);
        let { next_cursor, current_user } = data;
        this.setData({
            next_cursor: next_cursor || 0,
            currentUser: current_user,
            isLoading: false,
        });
    },

    // 更新钱包其它数据
    updateWalletData(data) {
        let { available = [], unavailable = [], tickets = [], current_user, cards } = data,
            { walletTabs } = this.data;

        // 页面标签 获取数量
        let tabs = walletTabs.map(item => {
            let { key } = item;
            // gift_card, electronic_ticket
            if (key in current_user) {
                // console.log('key', key);
                item.name = current_user[key].title;
                item.amount = current_user[key].count;
            }
            return item;
        });
        // 优惠券 拆分不可用优惠券
        const coupons = unavailable.reduce((acc, cur) => {
            let [_, used, expired] = acc,
                { status } = cur;
            Number(status) === 3 ? expired.push(cur) : used.push(cur);
            return acc;
        }, [available, [], []]);
        this.setData({
            coupons,
            gCard: cards,
            eCard: tickets,
            walletTabs: tabs,
        });
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({ user });
            return user;
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    // 使用优惠券
    async onCouponClick(ev) {
        const user = await this.bindGetUserInfo(ev);
        if (user) {
            const { coupons, couponTab } = this.data;
            const { index } = ev.currentTarget.dataset;
            let { user_coupon_id, title } = coupons[couponTab][index];
            console.log(user_coupon_id);
            if (couponTab !== 0) { return }
            let url = `/pages/couponProducts/couponProducts?userCouponId=${user_coupon_id}&couponTitle=${title}`;
            wx.navigateTo({ url });
        }
    },

    onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getWalletData();
    }
});
