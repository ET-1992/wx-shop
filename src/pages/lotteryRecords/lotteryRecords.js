import api from 'utils/api';
const app = getApp();
Page({
    data: {
        next_cursor: 0,
        recordType: 0,
        globalData: app.globalData,
        themeColor: app.globalData.themeColor,
        drawRecords: []
    },

    onLoad() {
        this.getRecords();
    },
    async getRecords() {
        let { next_cursor: cursor, recordType: draw_type, drawRecords } = this.data;
        const { next_cursor, records } = await api.hei.fetchLuckydrawRecords({
            cursor,
            draw_type
        });
        if (records.length > 0) {
            drawRecords = drawRecords.concat(records);
        }
        this.setData({
            next_cursor,
            drawRecords
        });
    },
    // 改变导航标签
    changeNavbarList(e) {
        const { name: recordType } = e.detail;
        this.setData({
            recordType,
            next_cursor: 0,
            drawRecords: []
        });
        this.getRecords();
    },
    onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) {
            return;
        }
        this.getRecords();
    }
});
