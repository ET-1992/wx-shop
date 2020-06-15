import { getAgainUserForInvalid, go } from 'utils/util';
import { wxPay } from 'utils/pageShare';
import { CONFIG } from 'constants/index';
import { showToast, showModal } from 'utils/wxp';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        isLoading: true,
        rechargeModal: false, // 会员充值弹窗
        showRenewsModal: false, // 会员续费弹窗
        consoleTime: 0,
        updateAgainUserForInvalid: false, // 是否已更新头像
        memberCouponList: {}, // 会员优惠券
        data: {},
        word: '',
        memberNo: 0,
        payment: 0,
        selectRenewal: {} // 所选择的续费项
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

    onShow() {
        this.getMemberHome();
    },

    // 获取会员信息
    async getMemberHome() {
        try {
            const { data, current_user, config = this.data.config } = await api.hei.membershipCard();
            if (config.store_card_enable) {
                const { data } = await api.hei.rechargePrice();
                this.setData({ rechargeArray: data });
            }
            if (config.renews) {
                this.setData({ renews: config.renews });
            }
            const amount = config && config.membership && config.membership.rules && config.membership.rules.payment;
            let memberNo = (current_user.membership && current_user.membership.member_no) || '';
            this.setData({
                user: current_user,
                data,
                amount,
                memberCouponList: data.coupons,
                memberNo,
                config,
                isLoading: false
            });
        } catch (e) {
            console.log(e);
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false
            });
        }
    },

    // 获取用户头像信息
    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            const user = await getAgainUserForInvalid({
                encryptedData,
                iv
            });
            return user;
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    async getUserInformation(e) {
        if (!this.updateAgainUserForInvalid) {
            const user = await this.bindGetUserInfo(e);
            this.setData({ user }, this.onShow);
            this.updateAgainUserForInvalid = true;
        }
    },

    // 点击优惠券
    async onCouponClick(ev) {
        const user = await this.bindGetUserInfo(ev);
        if (user) {
            const { id, index, status, title } = ev.currentTarget.dataset;
            if (Number(status) === 2) {
                // 立即领取
                await this.onReceiveCoupon(id, index);
            } else if (Number(status) === 4) {
                // 立即使用
                wx.navigateTo({ url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}` });
            } else { return }
        }
    },

    // 领取优惠券
    async onReceiveCoupon(id, index) {
        try {
            await api.hei.receiveCoupon({ coupon_id: id });
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

    // 打开会员充值弹窗
    openRechargeModal() {
        const { rechargeArray } = this.data;
        if (rechargeArray && rechargeArray.length) {
            this.setData({
                rechargeModal: true
            });
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '暂时无法开通会员',
                showCancel: false
            });
        }
    },

    // 打开续费弹窗
    openRenewsModal() {
        this.setData({
            showRenewsModal: true
        });
    },

    // 关闭会员充值弹窗
    closeRechargeModal() {
        this.setData({
            rechargeModal: false
        });
    },

    // 关闭续费弹窗
    closeRenewsModal() {
        this.setData({
            showRenewsModal: false
        });
    },

    // 会员充值确认支付
    onConfirmRecharge(e) {
        this.setData({
            amount: e.detail.amount,
            rechargeModal: false,
            type: 2
        });
        this.onPay();
    },

    // 会员续费确认支付
    onConfirmRenews(e) {
        this.setData({
            selectRenewal: e.detail.selectRenewal,
            showRenewsModal: false,
            type: 3
        });
        this.memberShipRenewal();
    },

    // 开通会员
    async buyMember() {
        const { amount, config } = this.data;
        let params = {}; // 未开启储值卡功能的开通会员 不传参数 后台设金额
        // 开启储值卡功能的开通会员或充值 需传金额参数
        if (config.store_card_enable) {
            params.amount = amount;
        }
        console.log('params160', params);
        try {
            const { pay_sign } = await api.hei.membershipPay(params);
            console.log('付费会员pay_sign197', pay_sign);
            if (pay_sign) { await wxPay(pay_sign) }
            this.onShow();
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.errMsg,
                showCancel: false
            });
        }
    },

    // 开通会员 去支付
    async onPay(ev) {
        let { amount, type } = this.data;
        type = ev ? ev.currentTarget.dataset.type : type;
        if (Number(amount) === 0) {
            try {
                await api.hei.membershipMultipay({
                    amount: 0,
                    pay_method: 'WEIXIN',
                    type
                });
                this.onShow();
            } catch (err) {
                wx.showModal({
                    title: '温馨提示',
                    content: err.errMsg,
                    showCancel: false
                });
            }
            return;
        }
        wx.navigateTo({
            url: `/pages/payCashier/payCashier?member_amount=${amount}&member_type=${type}&from_page=member`
        });
    },
    // 会员续费
    // async memberShipRenewal() {
    //     const { selectRenewal } = this.data;
    //     console.log('selectRenewal', selectRenewal);
    //     let params = {
    //         renew_id: selectRenewal.id,
    //         pay_method: 'WEIXIN'
    //     };
    //     try {
    //         const { pay_sign } = await api.hei.renewalPay(params);
    //         console.log('续费会员pay_sign218', pay_sign);
    //         if (pay_sign) {
    //             const { isSuccess } = await wxPay(pay_sign);
    //             if (isSuccess) {
    //                 wx.showToast({ title: '续费成功' });
    //                 this.onShow();
    //             }
    //         }
    //     } catch (error) {
    //         wx.showModal({
    //             title: '温馨提示',
    //             content: error.errMsg,
    //             showCancel: false
    //         });
    //     }
    // }
    // 会员续费
    async memberShipRenewal() {
        const { selectRenewal, type } = this.data;
        if (Number(selectRenewal.amount) === 0) {
            try {
                await api.hei.membershipMultipay({
                    renew_id: selectRenewal.id,
                    pay_method: 'WEIXIN',
                    type
                });
                wx.showToast({
                    title: '续费成功',
                    icon: 'success'
                });
                this.onShow();
            } catch (error) {
                wx.showModal({
                    title: '温馨提示',
                    content: error.errMsg,
                    showCancel: false
                });
            }
            return;
        }
        wx.navigateTo({
            url: `/pages/payCashier/payCashier?renewalId=${selectRenewal.id}&member_amount=${selectRenewal.amount}&member_type=${type}&from_page=member`
        });
    }
});