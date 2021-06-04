import api from 'utils/api';
Page({
    data: {
        title: 'affiliateRevenueRank',
    },

    async onLoad(params) {
        const data = await api.hei.getRevenueRanking();
    },
});
