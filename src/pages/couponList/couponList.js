// pages/couponList/couponList.js
import api from 'utils/api';
import { showToast, showModal } from 'utils/wxp';
// import { onDefaultShareAppMessage } from 'utils/pageShare';
// import login from 'utils/login';
import { autoNavigate } from 'utils/util';
import { CONFIG } from 'constants/index';

const app = getApp();
Page({
    data: {
        coupons: [],
        isLoading: true
    },

    async onLoad(params) {
        console.log('params', params); // {tplStyle: "vip"}
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        if (params.tplStyle === 'vip') { // 会员模板
            wx.setNavigationBarTitle({
                title: '会员优惠券'
            });
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#333',
            });
            this.setData({
                themeColor,
                tplStyle: 'vip_tpl',
                config
            });
            this.loadCoupon('vip');
        } else {
            const { style_type: tplStyle = 'default' } = config;
            this.setData({
                tplStyle,
                themeColor,
                config
            });
            this.loadCoupon();
        }
        console.log('this.data', this.data);
    },

    async loadCoupon(params) {
        if (params) {
            const data = await api.hei.fetchCouponList({ membership: 1 });
            this.setData({
                ...data,
                isLoading: false
            });
        } else {
            const { vendor } = app.globalData;
            const data = await api.hei.fetchCouponList({ vendor });
            this.setData({
                ...data,
                isLoading: false
            });
        }
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
        } else if (Number(status) === 4) {
            wx.navigateTo({
                url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
            });
        } else { return }
    },

    navigateToHome() {
        autoNavigate('/pages/home/home');
    },

    reLoad() {
        const { tplStyle } = this.data;
        if (tplStyle === 'vip_tpl') {
            this.loadCoupon('vip');
        } else {
            this.loadCoupon();
        }
    },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
    onPullDownRefresh: function() {
        const { tplStyle } = this.data;
        this.setData({
            isLoading: true
        });
        if (tplStyle === 'vip_tpl') {
            this.loadCoupon('vip');
        } else {
            this.loadCoupon();
        }
        wx.stopPullDownRefresh();
    }

});
