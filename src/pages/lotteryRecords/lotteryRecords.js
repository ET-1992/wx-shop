import api from 'utils/api';
const app = getApp();
Page({
    data: {
        current_paged: 1,
        recordType: 1,
        globalData: app.globalData,
        themeColor: app.globalData.themeColor,
        drawRecords: []
    },

    onLoad() {
        this.getRecords();
    },
    async getRecords() {
        let { current_paged, recordType: draw_type, drawRecords } = this.data;
        const { total_paged, records } = await api.hei.fetchLuckydrawRecords({
            paged: current_paged,
            draw_type
        });
        if (records.length > 0) {
            drawRecords = drawRecords.concat(records);
        }
        this.setData({
            current_paged: ++current_paged,
            drawRecords,
            total_paged
        });
    },
    // 改变导航标签
    changeNavbarList(e) {
        const { name: recordType } = e.detail;
        this.setData({
            recordType,
            current_paged: 1,
            drawRecords: []
        });
        this.getRecords();
    },
    onReachBottom() {
        const { current_paged, total_paged } = this.data;
        if (current_paged > total_paged) {
            return;
        }
        this.getRecords();
    }
});
