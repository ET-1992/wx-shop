import api from 'utils/api';
import { formatTime } from 'utils/util';
Page({
    data:{
        next_cursor: 0,
        isRefresh: true,
    },
    onLoad: function (options) {
        this.getCoinList()
        wx.setNavigationBarTitle({
            title: '金币明细'
        });
    },
    async  getCoinList() {
		const { next_cursor, isRefresh} = this.data;
		const queryOption = { cursor: next_cursor };
		if (isRefresh) {
			wx.showLoading();
		}
        const data = await api.hei.wallet(queryOption);
        wx.hideLoading();
        
        for(let item in data.data) {
            data.data[item].formatTime = formatTime(new Date(data.data[item].time * 1000));
        }

        this.setData({
            coinList: data.data,
            isRefresh: false,
            next_cursor: data.next_cursor,
        });
        console.log(this.data.coinList);
    },
    
    
    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    async onPullDownRefresh() {
        this.setData({ isRefresh: true, next_cursor: 0 });
        await this.getCoinList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return; }
        this.getCoinList();
    },
    onShareAppMessage: function() {
        
    }
})