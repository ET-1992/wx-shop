import {
    getAgainUserForInvalid,
    getUserInfo,
    go
} from 'utils/util';
import {
    CONFIG,
    USER_KEY
} from 'constants/index';
import {
    wxPay
} from 'utils/pageShare';
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
        ruleData: {} // 会员规则 word image_url
    },

    onLoad(params) {
        console.log(params);
    },

    go,

    onShow() {
        app.log('页面onShow');
        this.getMemberHome();
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

        this.setData({
            isLoading: false,
            themeColor,
            config,
        });
    },

    // 获取会员信息
    async getMemberHome() {
        const memberHome = await api.hei.membershipCard();
        this.setData({
            user: memberHome.current_user,
            ruleData: memberHome.data
        });
        console.log(memberHome);
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