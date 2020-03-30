import api from 'utils/api';
const app = getApp();

Page({
    data: {
        current_page: 0,
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
                title: '我的购买客户'
            });
        }
    },

    changeFilterList(e) {
        this.setData({
            filterData: e.detail,
            current_page: 0,
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
        let { filterOrderby, filterOrder, current_page, members, total_pages } = this.data;
        current_page++;
        const data = await api.hei.getShareCustomerList({
            paged: current_page,
            user_type: this.data.user_type,
            orderby: filterOrderby,
            order: filterOrder
        });
        if (members.length > 0) {
            data.members = members.concat(data.members);
        }
        this.setData({
            ...data,
            isLoading: false,
            current_page: data.current_page,
        });
    },
    async onShow() {
        this.setData({
            current_page: 0,
            isLoading: true,
            members: []
        }, this.filterShareList);
        console.log(this.data);
    },
    async onPullDownRefresh() {
        this.setData({
            current_page: 0,
            members: [],
            isLoading: true
        });
        this.getCustomerList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { current_page, total_pages } = this.data;
        if (current_page >= total_pages) { return }
        this.getCustomerList();
    }
});