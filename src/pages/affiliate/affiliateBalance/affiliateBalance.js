import api from 'utils/api';
import { formatTime } from 'utils/util';
Page({
    data: {
        current_cursor: 0,
        accountList: [],

    },
    onShow() {
        this.getBalanceDetail();
    },
    async getBalanceDetail() {
        this.setData({ isLoading: true });
        let { current_cursor, accountList } = this.data;
        const { logs, next_cursor } = await api.hei.featchAffiliateBalance({ cursor: current_cursor });

        for (let item in logs) {
            // 格式化时间和状态
            let account = logs[item];
            account.formatTime = formatTime(new Date(account.time * 1000));
        }
        accountList = accountList.concat(logs);
        this.setData({
            current_cursor: next_cursor,
            accountList,
            isLoading: false
        });
    },
    onReachBottom() {
        const { current_cursor } = this.data;
        if (!current_cursor) {
            wx.showToast({
                title: '到底了',
                icon: 'none'
            });
            return;
        }
        this.getBalanceDetail();
    }
});
