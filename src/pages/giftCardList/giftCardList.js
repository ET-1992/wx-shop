import api from 'utils/api';
import { go } from 'utils/util';

Page({
    data: {
        isLoading: true,
        gCard: [],  // 礼品卡
        next_cursor: 0,
    },

    onLoad(params) {
        console.log(params);
        this._loadingEnable = true;
        this.getWalletData();
    },

    go,

    // 获取钱包数据
    async getWalletData() {
        let { next_cursor: cursor } = this.data,
            isLoading = this._loadingEnable;
        this.setData({ isLoading });
        let requeset = { cursor };
        const data = await api.hei.fetchMyGiftCardList(requeset);
        let { gifts, next_cursor } = data;

        this.setData({
            gCard: gifts,
            next_cursor: next_cursor || 0,
            isLoading: false,
        });
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this._loadingEnable = false;
        await this.getWalletData();
        this._loadingEnable = true;
    },
});
