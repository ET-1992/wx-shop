import api from 'utils/api';
import { formatTime } from 'utils/util';
Page({
    data:{
        next_cursor: 0,
        isLoading: true,
    },
    async onLoad() {
        wx.setNavigationBarTitle({
            title: '金币明细'
        });
        await this.getCoinList();
		this.setData({ isLoading: false });
    },
    async getCoinList() {
		const { next_cursor} = this.data;
		const queryOption = { cursor: next_cursor };
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
        this.setData({ next_cursor: 0 });
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