import api from 'utils/api';
import { CROWD_STATUS_TEXT } from 'constants/index';
import { valueToText, formatTime, auth, getUserInfo } from 'utils/util';

const app = getApp();

Page({
    data: {
        status: 1,
        orders: [],
        next_cursor: 0,
        isLoading: true,
        isRefresh: true,
        statusList: [
            { name: '进行中', value: 1 },
            { name: '已完成', value: 2 }
        ]
    },

    onLoad() {
        wx.setNavigationBarTitle({
            title: '代付订单'
        });
        this.loadOrders();
    },
    onStautsItemClick(ev) {
        const { value } = ev.currentTarget.dataset;
        this.setData({
            status: value,
            isRefresh: true,
            next_cursor: 0,
            orders: []
        });
        this.loadOrders();
    },
    async loadOrders() {
        const { next_cursor, isRefresh, orders, status } = this.data;
        const queryOption = { cursor: next_cursor };
        if (status) {
            queryOption.status = status;
        }
        if (isRefresh) {
            wx.showLoading({
                title: '加载中',
            });
        }
        const data = await api.hei.crowdList(queryOption);
        const formatedOrders = data.orders.map((order) => {
            const statusCode = Number(order.status);
            order.statusCode = statusCode;
            order.statusText = valueToText(CROWD_STATUS_TEXT, Number(order.crowd.status));
            order.productCount = order.items.reduce((count, item) => {
                return count + Number(item.quantity);
            }, 0);
            order.progress = (Number(order.crowd.pay_amount) / Number(order.amount) * 100).toFixed(2);
            return order;
        });
        const newOrders = isRefresh ? formatedOrders : orders.concat(formatedOrders);
        this.setData({
            orders: newOrders,
            isRefresh: false,
            next_cursor: data.next_cursor,
            isLoading: false
        });
        wx.hideLoading();
        console.log(this.data);
    }
});
