import api from 'utils/api';
import { getAgainUserForInvalid } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { CONFIG } from 'constants/index';

const app = getApp();

Page({
    data: {
        status: [
            { name: '未使用', value: 'available' },
            { name: '已使用', value: 'used' },
            { name: '已过期', value: 'expired' },
        ],
        selectedStatus: 'available',
        coupons: {
            'available': [],
            'used': [],
            'expired': [],
        },
        isLoading: true,
        current_user: {},
        receiveInfo: {},  // 全站领取信息
    },

    async loadCoupons() {
        const myCouponsData = await api.hei.fetchMyCouponList();
        const { available = [], unavailable = [], current_user, extends: receiveInfo } = myCouponsData;
        const { used, expired } = unavailable.reduce((coupons, coupon) => {
            const { used, expired } = coupons;
            if (Number(coupon.status) === 3) {
                expired.push(coupon);
            }
            else {
                used.push(coupon);
            }
            return coupons;
        }, { used: [], expired: [] });

        this.setData({
            'coupons.available': available,
            'coupons.used': used,
            'coupons.expired': expired,
            isLoading: false,
            current_user,
            receiveInfo,
        });
    },

    async onLoad() {
        wx.setNavigationBarTitle({
            title: '我的优惠券'
        });
    },

    async onShow() {
        try {
            const config = wx.getStorageSync(CONFIG);
            const { themeColor } = app.globalData;
            this.setData({
                isLoading: true,
                themeColor,
                config,
            });
            this.loadCoupons();
        }
        catch (err) {
            console.log(err);
        }
    },

    async onCouponClick(ev) {
        const user = await this.bindGetUserInfo(ev);
        if (user) {
            const { selectedStatus } = this.data;
            const { usercouponid, title } = ev.currentTarget.dataset;
            console.log(selectedStatus);
            if (selectedStatus !== 'available') { return }
            wx.navigateTo({
                url: `/pages/couponProducts/couponProducts?userCouponId=${usercouponid}&couponTitle=${title}`
            });
            console.log(usercouponid);
        }
    },

    onStautsItemClick(ev) {
        const { value } = ev.currentTarget.dataset;
        if (value === this.data.selectedStatus) { return }
        this.setData({
            selectedStatus: value,
            // activeIndex: this.getIndex(value),
            isRefresh: true,
        });
    },

    async reLoad() {
        await this.loadCoupons();
    },

    async onPullDownRefresh() {
        await this.loadCoupons();
        wx.stopPullDownRefresh();
    },

    // 页面分享设置
    onShareAppMessage(e) {
        let { current_user, config } = this.data;
        let id = e.target.dataset.id || 0;  // 优惠券id
        let nickname = current_user.nickname || '用户';

        this.setData({
            share_title: `好友${nickname}给你发来了一个红包，快去领取吧`,
            share_image: `${config.cdn_host}/shop/redpacketShare.jpg`,
        });
        let opts = { id };
        let path =  `pages/getCoupon/getCoupon`;
        return onDefaultShareAppMessage.call(this, opts, path);
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
    }
});
