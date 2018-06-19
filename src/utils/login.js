import { TOKEN_KEY, EXPIRED_KEY, UID_KEY, USER_KEY } from 'constants/index';
import { openSetting } from './wxp';
import api from 'utils/api';
import getToken from 'utils/getToken';

export default async (options = {}) => {
    const { encryptedData, iv, code, isForce } = options;
    const token = isForce ? null : await getToken();
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000,
        mask: false
    });
    try {
        if (token) {
            const user = wx.getStorageSync(USER_KEY);
            wx.hideToast();
            return { user };
        }

        const data = {
            code,
            iv,
            encrypted_data: encryptedData,
            platform: 'weixin_app',
        };
        const loginData = await api.hei.login(data);

        const { access_token, expired_in, user = {}} = loginData;
        const { openid } = user;
        const expiredTime = expired_in * 1000 + Date.now();
        wx.removeStorageSync(TOKEN_KEY);
        wx.removeStorageSync(EXPIRED_KEY);
        wx.removeStorageSync(UID_KEY);
        wx.removeStorageSync(USER_KEY);

        wx.setStorageSync(TOKEN_KEY, access_token);
        wx.setStorageSync(EXPIRED_KEY, expiredTime);
        wx.setStorageSync(UID_KEY, openid);
        wx.setStorageSync(USER_KEY, user);

        wx.hideToast();
        wx.showToast({
            title: '登录成功',
            icon: 'success'
        });
        return loginData;
    }
    catch (err) {
        console.log('login err:', err);
        wx.hideToast();
        const { errMsg } = err;
        if (errMsg.indexOf('deny')) {
            const { authSetting } = await openSetting();
            if (!authSetting['scope.userInfo']) {
                throw err;
            }
        }
        else {
            wx.showModal({
                title: '登录失败',
                content: err.errMsg,
                showCancel: false
            });
        }
    }
};
