import api from 'utils/api';
import { go } from 'utils/util';

Page({
    data: {
        isLoading: true,
        eCard: [],  // 电子卡券
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
        // 加载图标是否在请求时出现
        this.setData({ isLoading });
        let requeset = { cursor };
        const data = await api.hei.fetchMyTicketList(requeset);
        let { next_cursor, tickets } = data;

        this.setData({
            eCard: tickets,
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
