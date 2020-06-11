import api from 'utils/api';

const app = getApp();

Page({
    data: {
        title: 'withdrawList',
        isLoading: true,
        logsList: [],  // 记录列表
        globalData: app.globalData,
    },

    onLoad(params) {
        console.log(params);
        this.initPage(params);
    },

    // 初始化页面
    initPage(params) {
        let { type } = params;
        let title = '提现记录';
        wx.setNavigationBarTitle({
            title,
        });
        this.setData({ type });
        this.getLogs();
    },

    // 获取记录数据
    async getLogs() {
        let { type } = this.data;
        const data = await api.hei.getCashLogs({
            wallet_type: type
        });
        let { data: logsList } = data;
        this.setData({
            logsList,
            isLoading: false,
        });
    }
});
