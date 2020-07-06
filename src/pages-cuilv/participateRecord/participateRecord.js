import api from 'utils/api';

const app = getApp();

Page({
    data: {
        title: 'participateRecord',
        isLoading: true,
        post_id: '',
        activity_id: '',
        activeNames: '',
        activity: {},  // 活动进度
        records: [],  // 记录
        themeColor: {},

    },

    onLoad(params) {
        let { post_id, activity_id } = params;
        const { themeColor } = app.globalData;
        this.setData({
            post_id,
            activity_id,
            themeColor,
        });
        this.getListData();
        console.log(params);
    },

    async getListData() {
        let { post_id, activity_id } = this.data;
        const data = await api.hei.fetchDrawOrderList({
            post_id,
            activity_id,
        });
        let { records, activity } = data;
        this.setData({
            records,
            activity,
            isLoading: false,
        });
    },

    onCollapseChange(event) {
        this.setData({
            activeNames: event.detail
        });
    }
});
