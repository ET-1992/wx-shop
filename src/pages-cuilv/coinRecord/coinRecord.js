import api from 'utils/api';
import { CONFIG } from 'constants/index';

Page({
    data: {
        title: 'coinRecord',
        recordList: [], // 记录列表数据
        isLoading: true,
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG);
        this.setData({ config });
        this.getRecord();
    },

    // 获取记录
    async getRecord() {
        const { logs } = await api.hei.getCoinCardLog({});
        console.log('logs', logs);
        this.setData({
            isLoading: false,
            recordList: logs,
        });
    }
});
