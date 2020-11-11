import api from 'utils/api';
import { go } from 'utils/util';

const app = getApp();
Page({
    data: {
        isLoading: true,
        gCard: [],  // 礼品卡
        themeColor: {},
        currentTab: 0,
    },

    onLoad(params) {
        console.log(params);
        let { themeColor } = app.globalData;
        this.setData({
            themeColor,
        });
        this.getWalletData();
    },

    go,

    // 获取钱包数据
    async getWalletData() {
        let { _nextCursor = 0, _loadingEnable = true } = this,
            { currentTab } = this.data;
        this.setData({ isLoading: _loadingEnable });
        let requeset = {
            cursor: _nextCursor,
            type: ['buyer', 'receiver'][currentTab],
        };
        const data = await api.hei.fetchMyGiftCardList(requeset);
        let { gifts, next_cursor = 0 } = data;
        this._nextCursor = next_cursor;
        this.setData({
            gCard: gifts,
            isLoading: false,
        });
    },

    // 切换标签
    onTabChange(e) {
        let { index } = e.detail;
        Object.assign(this, {
            _nextCursor: 0,
        });
        this.setData({
            currentTab: index,
        });
        this.getWalletData();
    },

    async onReachBottom() {
        let { _nextCursor } = this;
        if (!_nextCursor) { return }
        this._loadingEnable = false;
        await this.getWalletData();
        this._loadingEnable = true;
    },
});
