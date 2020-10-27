import api from 'utils/api';
import { CONFIG } from 'constants/index';

let walletTabs = [
    { name: '优惠券', amount: '0' },
    { name: '礼品卡', amount: '0' },
    { name: '电子卡券', amount: '0' },
];
Page({
    data: {
        title: 'wallet',
        isLoading: true,
        coupons: [], // 优惠券
        eCard: [],  // 电子卡券
        currentUser: {},
        config: {},
        walletTabs: walletTabs,
        currentTab: 0, // 当前标签类型
        couponTab: 0,  // 优惠券标签类型
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG);
        this.setData({ config });
        this.getWalletData();
    },

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
        let { currentTab } = this.data,
            method = ['fetchMyCouponList', 'a', 'fetchMyTicketList'][currentTab];
        const data = await api.hei[method]();
        let {
            available = [],
            unavailable = [],
            tickets = [],
            next_cursor,
            current_user,
        } = data;
        // 优惠券
        const coupons = unavailable.reduce(
            (acc, cur) => {
                let [_, used, expired] = acc,
                    { status } = cur;
                Number(status) === 3 ? expired.push(cur) : used.push(cur);
                return acc;
            },
            [available, [], []]
        );
        this.setData({
            coupons,
            eCard: tickets,
            next_cursor,
            currentUser: current_user,
            isLoading: false,
        });
    },
});
