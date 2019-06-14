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
        const user = wx.getStorageSync('user');
        const { image_url }  = await api.hei.getShopRule({ key: 'membership' });
        const result = await api.hei.membershipCard();
        console.log(result);
        const recharge = await api.hei.rechargePrice();
        // console.log(recharge);
        recharge.data[0].checked = true;
        console.log(recharge.data);
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
    }
});
