import { getAgainUserForInvalid, getUserInfo, go } from 'utils/util';
import { CONFIG } from 'constants/index';
import { wxPay } from 'utils/pageShare';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        title: 'members',
        globalData: app.globalData,
        rechargeModal: false
    },

    async onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        console.log('config', config);
        const user = wx.getStorageSync('user');
        const { image_url }  = await api.hei.getShopRule({ key: 'membership' });
        const result = await api.hei.membershipCard();
        console.log('储值卡-会员中心result', result);
        const recharge = await api.hei.rechargePrice();
        recharge.data[0].checked = true;
        console.log('获取可充值金额数组recharge.data', recharge.data);
        this.setData({
            themeColor,
            config,
            user,
            image_url,
            membershipCard: result.data,
            rechargeArray: recharge.data
        });
    },

    async onShow() {
        app.log('页面onShow');
        const config = wx.getStorageSync(CONFIG);
        const user = getUserInfo();
        this.setData({ user, config });
    },

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

    // 没有储值卡功能的开通会员
    async buyMember() {
        const { config } = this.data;
        console.log('config', config);
        const membership = config.membership;
        console.log('没有储值卡功能的membership', membership);
        const payment = membership.rules.payment;
        console.log('没有储值卡功能的开通会员payment', payment);
        if (payment > 0) {
            const { pay_sign } = await api.hei.joinMembership({ payment });
            console.log('付费会员pay_sign', pay_sign);
            if (pay_sign) {
                try {
                    await wxPay(pay_sign);
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            const result = await api.hei.joinMembership({ payment });
            console.log('不需要付费成为会员', result);
        }
    }
});
