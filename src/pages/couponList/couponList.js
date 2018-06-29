// pages/couponList/couponList.js
import api from 'utils/api';
import getToken from 'utils/getToken';
import { showToast, showModal } from 'utils/wxp';
// import { onDefaultShareAppMessage } from 'utils/pageShare';
// import login from 'utils/login';
// import { USER_KEY } from 'constants/index';

const app = getApp();
Page({
    data: {
        coupons: [],
    },

    async onLoad(options) {
        wx.setNavigationBarTitle({
            title: '优惠券'
        });
        this.loadCoupon();
    },

    async loadCoupon() {
        const { vendor } = app.globalData;
        const data = await api.hei.fetchCouponList({ vendor });
        this.setData(data);
    },

    async onReceiveCoupon(id, index) {
        const { coupons } = this.data;
        try {
            const data = await api.hei.receiveCoupon({
                coupon_id: id,
            });
            console.log(data);
            const { errcode } = data;

            if (!errcode) {
                showToast({ title: '领取成功' });
                const updateData = {};
                const key = `coupons[${index}].status`;
                updateData[key] = 4;
                console.log(updateData);
                this.setData(updateData);
            }
        }
        catch (err) {
            await showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    async onCouponClick(ev) {
        console.log(ev);
        const { id, index, status, title } = ev.currentTarget.dataset;
        // const token = getToken();

        // if (!token) {
        // 	const { confirm } = await showModal({
        // 		title: '未登录',
        // 		content: '请先登录，再领取优惠券',
        // 		confirmText: '前往登录',
        // 	});
        // 	if (confirm) {
        // 		wx.navigateTo({ url: '/pages/login/login' });
        // 	}
        // 	return;
        // }

        if (Number(status) === 2) {
            await this.onReceiveCoupon(id, index);
        }
        else {
            wx.navigateTo({
                url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
            });
        }
    },

    reLoad() {
        this.loadCoupon();
    },

});
