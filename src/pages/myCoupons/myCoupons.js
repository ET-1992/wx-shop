import api from 'utils/api';

const app = getApp();

// 创建页面实例对象
Page({
    // 页面的初始数据
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
        });
    },


    async onLoad() {
        try {
            const { themeColor } = app.globalData;
            this.setData({ isLoading: true, themeColor });


            await this.loadCoupons();

            this.setData({ isLoading: false });
        }
        catch (err) {
            console.log(err);
        }

    },

    async onCouponClick(ev) {
        const { selectedStatus } = this.data;
        const { id, title } = ev.currentTarget.dataset;
        console.log(selectedStatus);
        if (selectedStatus !== 'available') { return }
        wx.navigateTo({
            url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`
        });
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
    }
});
