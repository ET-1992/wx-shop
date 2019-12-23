import { getAgainUserForInvalid, go } from 'utils/util';
import { CONFIG } from 'constants/index';
import { wxPay } from 'utils/pageShare';
import { showToast, showModal } from 'utils/wxp';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        isLoading: true,
        showRechargeModal: false, // 会员充值弹窗
        consoleTime: 0,
        updateAgainUserForInvalid: false, // 是否已更新头像
        memberCouponList: {}, // 会员优惠券
        memberExclusiveBanner: '',
        word: ''
    },

    onLoad(params) {
        console.log(params);
    },

    go,

    onShow() {
        app.log('页面onShow');
        this.initPage();
    },

    // 获取会员信息
    async initPage() {
        try {
            // 获取全局店铺配置信息
            const config = wx.getStorageSync(CONFIG);
            // 获取开启储值卡后充值金额数组
            const { current_user, data } = await api.hei.membershipCard();
            if (config.store_card_enable) {
                const { data } = await api.hei.rechargePrice();
                this.setData({
                    rechargeArray: data
                });
            }
            let count = config.membership && config.membership.rules && config.membership.rules.payment;
            // 获取会员信息
            this.setData({
                user: current_user,
                word: data.word || '',
                memberCouponList: data.coupons,
                memberExclusiveBanner: data.dedicated_products_banner,
                isLoading: false,
                payment: count,
                config,
                globalData: app.globalData
            });
        } catch (error) {
            console.log(error);
            wx.showModal({
                title: '温馨提示',
                content: error.errMsg,
                showCancel: false
            });
        }
    },

    // 获取用户头像信息
    async bindGetUserInfo(e) {
        const {
            encryptedData,
            iv
        } = e.detail;
        if (!this.updateAgainUserForInvalid) {
            const user = await getAgainUserForInvalid({
                encryptedData,
                iv
            });
            this.setData({
                user
            }, this.onShow);
            this.updateAgainUserForInvalid = true;
        }
    },

    // 发送模板消息
    async submitFormId(e) {
        const data = await api.hei.submitFormId({
            form_id: e.detail.formId,
        });
        console.log(data);
    },

    // 点击优惠券
    async onCouponClick(ev) {
        const { id, index, status, title } = ev.currentTarget.dataset;
        if (Number(status) === 2) {
            // 立即领取
            await this.onReceiveCoupon(id, index);
        } else if (Number(status) === 4) {
            // 立即使用
            wx.navigateTo({
                url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
            });
        } else { return }
    },

    // 领取优惠券
    async onReceiveCoupon(id, index) {
        try {
            const data = await api.hei.receiveCoupon({
                coupon_id: id,
            });
            console.log(data);
            const { errcode } = data;

            if (!errcode) {
                showToast({ title: '领取成功' });
                const updateData = {};
                const key = `memberCouponList[${index}].status`;
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

    // 打开会员充值弹窗
    openRechargeModal() {
        this.setData({
            showRechargeModal: true
        });
    },

    // 确认支付
    onConfirmRecharge(e) {
        this.setData({
            amount: e.detail.amount,
            showRechargeModal: false
        });
        this.buyMember();
    },

    // 关闭会员充值弹窗
    closeRechargeModal() {
        this.setData({ showRechargeModal: false });
    },

    // 开通会员
    async buyMember() {
        const { amount, config } = this.data;
        let params = {}; // 未开启储值卡功能的开通会员 不传参数 后台设金额
        try {
            if (config.store_card_enable) { // 开启储值卡功能的开通会员或充值 需传金额参数
                params.amount = amount;
            }
            console.log('params160', params);
            const { pay_sign } = await api.hei.joinMembership(params);
            console.log('付费会员pay_sign', pay_sign);
            if (pay_sign) { await wxPay(pay_sign) }
            this.onShow();
        } catch (error) {
            console.log(error);
        }
    }
});