import api from 'utils/api';
Page({
    data: {
        next_cursor: 0,
        isLoading: true,
        shareList: [],
    },

    onLoad(parmas) {
        const { user_type } = parmas;
        this.setData({
            user_type,
            filterListData: [
                {
                    name: '时间',
                },
                {
                    name: '订单数'
                },
                {
                    name: user_type === '1' ? '我的收益' : '成交金额'
                }
            ]
        });
        if (user_type === '1') {
            wx.setNavigationBarTitle({
                title: '我的分享家'
            });
        } else {
            wx.setNavigationBarTitle({
                title: '我的客户'
            });
        }
    },
    async getCustomerList() {
        const { next_cursor } = this.data;
        const shareList = await api.hei.getShareCustomerList({
            cursor: next_cursor,
            user_type: this.data.user_type
        });

        const newData = this.data.shareList.concat(shareList.members);
        this.setData({
            shareList: newData,
            isLoading: false,
            next_cursor: shareList.next_cursor,
        });
        return shareList;
    },
    async onShow() {
        this.getCustomerList();
        console.log(this.data);
    },
    async onPullDownRefresh() {
        this.setData({
            next_cursor: 0,
            shareList: [],
            isLoading: true
        });
        this.getCustomerList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getCustomerList();
    }
});
