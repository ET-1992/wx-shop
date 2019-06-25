import api from 'utils/api';
import { formatTime } from 'utils/util';
import { CONFIG } from 'constants/index';
Page({
    data: {
        next_cursor: 0,
        isLoading: false,
        integralList: []
    },
    async onLoad() {
        this.setData({ isLoading: true });
        this.getIntegralList();
        const config = wx.getStorageSync(CONFIG);
        this.setData({ config });
    },
    async getIntegralList() {
        const { next_cursor } = this.data;
        const data = await api.hei.getIntegralList({
            cursor: next_cursor,
        });

        for (let item in data.data) {
            data.data[item].formatTime = formatTime(new Date(data.data[item].time * 1000));
        }

        const newData = this.data.integralList.concat(data.data);
        this.setData({
            integralList: newData,
            isLoading: false,
            next_cursor: data.next_cursor,
        });
        console.log('this.data.integralList', this.data.integralList);
        return data;
    },


    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    async onPullDownRefresh() {
        this.setData({
            next_cursor: 0,
            integralList: [],
            isLoading: true
        });
        await this.getIntegralList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getIntegralList();
    }
});