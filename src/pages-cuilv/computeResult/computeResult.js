import api from 'utils/api';

Page({
    data: {
        title: 'computeResult',
        isLoading: true,
        sum: '',  // 总数
        remainder: '',  // 余数
        base_code: '',  // 基数
        activity: {},
    },

    onLoad(params) {
        console.log(params);
        let { id } = params;
        this.setData({ id });
        const { themeColor } = getApp().globalData;
        this.setData({ themeColor });
        this.getRecordData();
    },

    async getRecordData() {
        let { id } = this.data;
        const data = await api.hei.fetchDrawProductCompute({
            id,
        });
        let { records, sum, activity, remainder, base_code } = data;
        this.setData({
            records,
            sum,
            remainder,
            base_code,
            activity,
            isLoading: false,
        });
    },
});
