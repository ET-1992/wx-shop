import { getAgainUserForInvalid, getUserInfo, go } from 'utils/util';
import { CONFIG } from 'constants/index';
import { wxPay } from 'utils/pageShare';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        isLoading: false,
        title: 'members',
        globalData: app.globalData,
        rechargeModal: false
    },

    onLoad(params) {
        console.log(params);
    },

    go,

    async onShow() {
        app.log('页面onShow');
        this.setData({ isLoading: true });
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const user = wx.getStorageSync('user');
        const data  = await api.hei.getShopRule({ key: 'membership' });
        console.log('data', data);
        const result = await api.hei.membershipCard();
        const recharge = await api.hei.rechargePrice();
        recharge.data[0].checked = true;
        // console.log('config', config);
        // console.log('储值卡-会员中心result', result);
        // console.log('获取可充值金额数组recharge.data', recharge.data);
        this.setData({
            isLoading: false,
            themeColor,
            config,
            user,
            ...data,
            membershipCard: result.data,
            rechargeArray: recharge.data
        });
    },

    // async onShow() {
    //     app.log('页面onShow');
    //     const config = wx.getStorageSync(CONFIG);
    //     const user = getUserInfo();
    //     const result = await api.hei.membershipCard();
    //     console.log('储值卡-会员中心result', result);
    //     this.setData({ user, config, membershipCard: result.data });
    // },

    // 获取用户信息
    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        this.setData({ user });
    },

    // 用户签到
    async tapSignIn() {
        const result = await api.hei.signIn(); // 签到
        this.setData({
            user: result.current_user
        });
        wx.showToast({
            title: '签到成功',
            icon: 'success'
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
        const { pay_sign } = await api.hei.joinMembership();
        console.log('付费会员pay_sign', pay_sign);
        if (pay_sign) {
            try {
                await wxPay(pay_sign);
                this.onShow();
            } catch (error) {
                console.log(error);
            }
        }
    }
});
