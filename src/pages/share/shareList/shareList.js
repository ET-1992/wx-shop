import api from 'utils/api';
Page({
    data: {
        next_cursor: 0,
        isLoading: true,
        members: [],
        filterData: {
            filterIndex: 0,
            filterType: 'Up'
        },
        current_page: 1,
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

    changeFilterList(e) {
        this.setData({
            filterData: e.detail,
            current_page: 1,
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
            'Up': 'desc',
            'Down': 'asc'
        };
        this.setData({
            filterOrderby: sortText[filterData.filterIndex],
            filterOrder: sortStatus[filterData.filterType]
        }, this.getCustomerList);
    },
    async getCustomerList() {
        const { filterOrderby, filterOrder, current_page, next_cursor, members } = this.data;
        const data = await api.hei.getShareCustomerList({
            cursor: next_cursor,
            user_type: this.data.user_type,
            orderby: filterOrderby,
            order: filterOrder,
            current_page
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
        this.filterShareList();
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
        let { next_cursor, current_page, total_pages } = this.data;
        if (!next_cursor) { return }
        current_page++;
        if (current_page === total_pages) { return }
        console.log(current_page);
        this.setData({
            current_page
        }, this.getCustomerList);
    }
});
