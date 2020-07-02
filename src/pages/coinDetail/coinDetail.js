import api from 'utils/api';
import { go, formatTime } from 'utils/util';
import { CONFIG, PLATFFORM_ENV } from 'constants/index';
Page({
    data: {
        next_cursor: 0,
        isLoading: true,
        coinList: [],
        headData: {},
        PLATFFORM_ENV,
    },
    go,
    async onLoad() {
        this.getCoinList();
        const { themeColor } = getApp().globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ themeColor, config });
        wx.setNavigationBarTitle({
            title: `${(config.coin_name || '花生米')}明细`
        });
    },
    async getCoinList() {
        const { next_cursor } = this.data;
        const data = await api.hei.wallet({
            cursor: next_cursor,
        });

        let { current_user } = data;
        let { avatarurl, nickname, wallet } = current_user;
        let { coins } = wallet;
        let headData = { avatarurl, nickname, coins };

        for (let item in data.data) {
            data.data[item].formatTime = formatTime(new Date(data.data[item].modified * 1000));
        }

        const newData = this.data.coinList.concat(data.data);
        this.setData({
            coinList: newData,
            headData,
            isLoading: false,
            next_cursor: data.next_cursor,
        });
        console.log(this.data.coinList);
        return data;
    },

    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    async onPullDownRefresh() {
        this.setData({
            next_cursor: 0,
            coinList: [],
            isLoading: true
        });
        await this.getCoinList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getCoinList();
    }
});