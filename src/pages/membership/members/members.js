import { getAgainUserForInvalid, go } from 'utils/util';
import { CONFIG } from 'constants/index';
import { wxPay } from 'utils/pageShare';
import { showToast, showModal } from 'utils/wxp';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        isLoading: true,
        globalData: app.globalData,
        commonRechargeModal: false,  // 非会员充值弹窗
        rechargeModal: false,  // 会员充值弹窗
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

    // 初始页面配置
    async initPage() {
        const {
            themeColor
        } = app.globalData;
        // 获取全局店铺配置信息
        const config = wx.getStorageSync(CONFIG);
        // 获取开启储值卡后充值金额数组
        if (config.store_card_enable) {
            const recharge = await api.hei.rechargePrice();
            if (recharge.data && recharge.data[0]) {
                recharge.data[0].checked = true;
            }
            this.setData({
                rechargeArray: recharge.data
            });
        }
        // 获取会员信息
        const memberHome = await api.hei.membershipCard();
        this.setData({
            user: memberHome.current_user,
            word: (memberHome.data && memberHome.data.word) || '',
            memberCouponList: memberHome.data && memberHome.data.coupons,
            memberExclusiveBanner: memberHome.data && memberHome.data.dedicated_products_banner
        });
        // 设置全局配置
        this.setData({
            isLoading: false,
            themeColor,
            config,
        });
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

    // 打开非会员充值弹窗
    openCommonRechargeModal() {
        this.setData({
            commonRechargeModal: true
        });
    },

    // 打开会员充值弹窗
    openRechargeModal() {
        this.setData({
            rechargeModal: true
        });
    },

    // 未开启储值卡功能的开通会员
    async buyMember() {
        try {
            const {
                pay_sign
            } = await api.hei.joinMembership();
            console.log('付费会员pay_sign', pay_sign);
            if (pay_sign) {
                await wxPay(pay_sign);
            }
            this.onShow();
        } catch (error) {
            console.log(error);
        }
    },

    // 微信支付后弹窗回调
    setConsumptionList() {
        this.onShow();
    }
});