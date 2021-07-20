import api from 'utils/api';
const app = getApp();
Page({
    data: {
        title: 'affiliateRevenueRank',
        globalData: app.globalData
    },

    onLoad() {
        this.initPage();
    },

    async initPage() {
        const { accounts } = await api.hei.getRevenueRanking();
        this.setData({
            accounts
        });
    }
});
