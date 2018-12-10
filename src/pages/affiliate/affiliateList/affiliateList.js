import api from 'utils/api';
const app = getApp();

Page({
    data: {
        next_cursor: 0,
        isLoading: true,
        members: [],
        filterData: {
            filterIndex: 0,
            filterType: 'Down'
        }
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
                    name: '我的收益'
                }
            ],
            globalData: app.globalData
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

    changeFilterList(e) {
        this.setData({
            filterData: e.detail,
            next_cursor: 0,
            isLoading: true,
            members: []
        }, this.filterShareList);
        console.log(this.data);
    },
    filterShareList() {
        const { filterData } = this.data;
        const sortText = {
            0: 'time',
            1: 'order_count',
            2: this.data.user_type === '1' ? 'commission' : 'order_amount'
        };
        const sortStatus = {
            'Up': 'asc',
            'Down': 'desc'
        };
        this.setData({
            filterOrderby: sortText[filterData.filterIndex],
            filterOrder: sortStatus[filterData.filterType]
        }, this.getCustomerList);
    },
    async getCustomerList() {
        const { filterOrderby, filterOrder, next_cursor, members } = this.data;
        const data = await api.hei.getShareCustomerList({
            cursor: next_cursor,
            user_type: this.data.user_type,
            orderby: filterOrderby,
            order: filterOrder
        });
        if (members.length > 0) {
            data.members = data.members.concat(members);
        }
        this.setData({
            ...data,
            isLoading: false,
            next_cursor: data.next_cursor,
        });
    },
    async onShow() {
        this.setData({
            next_cursor: 0,
            isLoading: true,
            members: []
        }, this.filterShareList);
        console.log(this.data);
    },
    async onPullDownRefresh() {
        this.setData({
            next_cursor: 0,
            members: [],
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