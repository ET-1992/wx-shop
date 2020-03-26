const app = getApp();
import { CONFIG } from 'constants/index';

// 创建页面实例对象
Page({
    // 页面的初始数据
    data: {
        status: [
            { name: '可使用优惠券', value: 'available' },
            { name: '不可用优惠券', value: 'unavailable' },
        ],
        selectedStatus: 'available',
        coupons: {
            available: [],
            unavailable: [],
            recommend: {},
            selected: {}
        },
    },

    // 生命周期函数--监听页面加载
    async onLoad() {
        const { themeColor } = app.globalData;
        const coupons = wx.getStorageSync('orderCoupon');
        const { available, unavailable } = coupons;
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        this.setData({
            coupons,
            isIphoneX,
            themeColor
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

    onCouponClick(ev) {
        const { index } = ev.currentTarget.dataset;
        const { coupons } = this.data;
        if (coupons.recommend === coupons.available[index]) {
            coupons.recommend = {};
        } else {
            coupons.recommend = coupons.available[index];
        }
        this.setData({
            coupons
        });
    },

    onComfirm() {
        const { coupons } = this.data;
        // app.globalData.currentOrder.coupons = coupons;
        app.event.emit('getCouponIdEvent', coupons.recommend);
        console.log(app.globalData.currentOrder);
        wx.navigateBack({
            delta: 1
        });
    },
});
