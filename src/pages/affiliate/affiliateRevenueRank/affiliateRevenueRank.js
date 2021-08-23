import api from 'utils/api';
const app = getApp();
import { CONFIG } from 'constants/index';
Page({
    data: {
        title: 'affiliateRevenueRank',
        globalData: app.globalData
    },

    onLoad() {
        this.initPage();
    },

    async initPage() {
        const config = wx.getStorageSync(CONFIG);
        const { accounts } = await api.hei.getRevenueRanking();
        this.setData({
            accounts,
            config
        });
    }
});
