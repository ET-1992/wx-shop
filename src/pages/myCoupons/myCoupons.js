import api from 'utils/api';
import { getAgainUserForInvalid } from 'utils/util';
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
    },

    async loadCoupons() {
        const { available = [], unavailable = [] } = await api.hei.fetchMyCouponList();
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
            isLoading: false
        });
    },

    async onLoad() {
        wx.setNavigationBarTitle({
            title: '我的优惠券'
        });
    },

    async onShow() {
        try {
            const { themeColor } = app.globalData;
            this.setData({
                isLoading: true,
                themeColor
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
    onShareAppMessage() {
        return {
            title: 'share title',
            path: '/pages/myCoupons/myCoupons'
        };
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
