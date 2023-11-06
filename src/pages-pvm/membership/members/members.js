import { getUserProfile, go, subscribeMessage } from 'utils/util';
import { wxPay } from 'utils/pageShare';
import { CONFIG } from 'constants/index';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        isLoading: true,
        showRenewsModal: false, // 会员续费弹窗
        consoleTime: 0,
        updateAgainUserForInvalid: false, // 是否已更新头像
        memberCouponList: {}, // 会员优惠券
        data: {},
        word: '',
        memberNo: 0,
        payment: 0,
        selectRenewal: {}, // 所选择的续费项
    },

    onLoad() {
        const config = wx.getStorageSync(CONFIG);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        this.setData({
            themeColor,
            isIphoneX,
            config,
            globalData: app.globalData
        });
    },

    go,

    // 获取会员信息
    async onShow() {
        try {
            const { data, current_user, config } = await api.hei.membershipCard();
            const { store_card_enable = false, membership_enable = false, renew_enable = false, membership = {}, renews = [] } = config;
            let amount = (membership_enable && membership.rules && membership.rules.payment) || 0;
            let memberNo = (current_user.membership && current_user.membership.member_no) || '';
            this.setData({
                data,
                config,
                memberNo,
                amount: Number(amount),
                user: current_user || {},
                renews: renew_enable ? renews : [],
                memberCouponList: data.coupons || [],
                isLoading: false
            });
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    // 获取用户头像信息
    async bindGetUserInfo() {
        const user = await getUserProfile();
        return user;

    },

    async getUserInformation(e) {
        if (!this.updateAgainUserForInvalid) {
            const user = await this.bindGetUserInfo();
            this.setData({ user }, this.onShow);
            this.updateAgainUserForInvalid = true;
        }
    },

    // 点击优惠券
    async onCouponClick(ev) {
        const user = await this.bindGetUserInfo();
        if (user) {
            const { id, index, status, title } = ev.currentTarget.dataset;
            if (Number(status) === 2) {
                // 立即领取
                await this.onReceiveCoupon(id, index);
            } else if (Number(status) === 4) {
                // 立即使用
                wx.navigateTo({ url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}` });
            }
        }
    },

    // 领取优惠券
    async onReceiveCoupon(id, index) {
        try {
            await api.hei.receiveCoupon({ coupon_id: id });
            let subKeys = [{ key: 'coupon_expiring' }];
            await subscribeMessage(subKeys);
            wx.showToast({ title: '领取成功' });
            let updateData = {};
            const key = `memberCouponList[${index}].status`;
            updateData[key] = 4;
            this.setData(updateData);
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    // 开通会员
    buyMember() {
        let type = 1;
        this.onPay(type);
    },

    async onPay(type) {
        let { amount, config } = this.data;
        // const { cashier_enable } = config;
        try {
            const { pay_sign } =  await api.hei.membershipMultipay({
                amount,
                pay_method: 'WEIXIN',
                type
            });
            if (amount > 0 && pay_sign) {
                await wxPay(pay_sign);
            }
            this.onShow();
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }

    },

    // 打开续费弹窗
    openRenewsModal() {
        const { showRenewsModal } = this.data;
        this.setData({
            showRenewsModal: !showRenewsModal
        });
    },

    // 会员续费确认支付
    onConfirmRenews(ev) {
        let { selectRenewal } = ev.detail;
        this.setData({
            selectRenewal,
            showRenewsModal: false
        }, this.memberShipRenewal);
    },

    // 会员续费
    async memberShipRenewal() {
        const { selectRenewal, config } = this.data;
        const { cashier_enable } = config;
        const type = 3;
        if (cashier_enable && selectRenewal.amount > 0) {
            wx.navigateTo({ url: `/pages/payCashier/payCashier?renewalId=${selectRenewal.id}&member_amount=${selectRenewal.amount}&member_type=${type}&from_page=member` });
            return;
        }
        try {
            const { pay_sign } = await api.hei.membershipMultipay({
                renew_id: selectRenewal.id,
                pay_method: 'WEIXIN',
                type
            });
            if (pay_sign && selectRenewal.amount > 0) {
                await wxPay(pay_sign);
            }
            wx.showToast({ title: '续费成功', icon: 'success' });
            this.onShow();
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },
    // 展示企业微信联系方式
    onCustomService() {
        const { config } = this.data;
        if (config.contact && config.contact.type === 'work_weixin') {
            let customServiceModal = true;
            this.setData({
                customServiceModal,
            });
        } else {
            const { corp_id: corpId, url } = config.contact;
            wx.openCustomerServiceChat({
                extInfo: { url },
                corpId
            });
        }
    },
});