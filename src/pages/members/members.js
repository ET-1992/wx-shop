import { getAgainUserForInvalid, getUserInfo, go } from 'utils/util';
import { CONFIG } from 'constants/index';
import { wxPay } from 'utils/pageShare';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        title: 'members',
        globalData: app.globalData,
        signIn: false
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const user = wx.getStorageSync('user');
        this.setData({ themeColor, config, user });
    },

    async onShow() {
        app.log('页面onShow');
        const config = wx.getStorageSync(CONFIG);
        const user = getUserInfo();
        this.setData({ user, config });
    },

    go, // 跳转到规则详情页面

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

    // 开通会员
    async buyMember() {
        const { pay_sign } = await api.hei.joinMembership();
        if (pay_sign) {
            try {
                await wxPay(pay_sign);
            } catch (error) {
                console.log(error);
            }
        }
    }
});
