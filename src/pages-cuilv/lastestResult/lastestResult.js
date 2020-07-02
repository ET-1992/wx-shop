import api from 'utils/api';
import { go } from 'utils/util';

Page({
    data: {
        title: 'lastestResult',
        isLoading: true,
        activitys: [],  // 记录列表
    },

    onLoad(params) {
        console.log(params);
        this.getResultData();
    },

    go,

    async getResultData() {
        const ALLTYPE = 0;
        const ENDSTATUS = 4;
        const data = await api.hei.fetchDrawOrderPersonList({
            type: ALLTYPE,
            activity_status: ENDSTATUS,
        });
        let { activitys } = data;
        this.setData({
            isLoading: false,
            activitys,
        });
    },
});
