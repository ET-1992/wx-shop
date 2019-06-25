import { go, formatTime } from 'utils/util';
import api from 'utils/api';
Page({
    data: {
        title: 'affiliateVisitor',
        visitorList: [],
        isLoading: false,
        next_cursor: 0
    },

    go,

    async onLoad(params) {
        this.setData({ isLoading: true });
        console.log(params);
        this.getVisitorList();
    },

    async getVisitorList() {
        const { next_cursor } = this.data;
        const data = await api.hei.getVisitorData({
            cursor: next_cursor,
        });

        for (let item in data.members) {
            data.members[item].formatTime = formatTime(new Date(data.members[item].record_time * 1000));
        }

        const newData = this.data.visitorList.concat(data.members);
        this.setData({
            visitorList: newData,
            isLoading: false,
            next_cursor: data.next_cursor,
        });
        console.log('visitorList', this.data.visitorList);
        return data;
    },

    async onPullDownRefresh() {
        this.setData({
            next_cursor: 0,
            visitorList: [],
            isLoading: true
        });
        this.getVisitorList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getVisitorList();
    }
});
