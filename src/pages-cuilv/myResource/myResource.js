import { getUserProfile, go } from 'utils/util';
import { USER_KEY, CONFIG } from 'constants/index';
import api from 'utils/api';
const app = getApp();


Page({
    data: {
        config: {},
        user: {},
        wallet: {},  // 钱包
        coupons: {},  // 优惠券
        isLoading: true,
    },

    onLoad() {
        this.getLocalData();
        this.getWebData();
    },

    go,

    // 点击头像登录
    async bindGetUserInfo() {
        const user = await getUserProfile();
        this.setData({ user });
    },

    // 获取本地数据
    getLocalData() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const user = wx.getStorageSync(USER_KEY);
        this.setData({
            user,
            config,
            themeColor,
        });
    },

    // 获取接口数据
    async getWebData() {
        const data = await api.hei.myFare();
        let { wallet, coupons } = data;
        this.setData({
            wallet,
            coupons,
            isLoading: false,
        });
    }
});
