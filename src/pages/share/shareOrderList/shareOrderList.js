import api from 'utils/api';
import { getNodeInfo, formatTime, textToValue, valueToText  } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';

Page({
    data: {
        isLoading: true,
        next_cursor: 0,
        orders: []
    },

    onLoad(parmas) {
        console.log(parmas);
        wx.setNavigationBarTitle({
            title: '订单列表'
        });

        this.getOrderList();
    },

    async getOrderList() {
        const { next_cursor } = this.data;
        const data = await api.hei.getShareOrderList({
            cursor: next_cursor
        });
        data.orders.forEach((item) => {
            item.formatTime = formatTime(new Date(item.time * 1000));
            item.statusText = valueToText(ORDER_STATUS_TEXT, Number(item.order_status));
        });
        const newData = this.data.orders.concat(data.orders);
        this.setData({
            orders: newData,
            isLoading: false,
            next_cursor: data.next_cursor,
        });
        console.log(this.data.orders);
        return data;
    },

    async onPullDownRefresh() {
        this.setData({
            next_cursor: 0,
            orders: [],
            isLoading: true
        });
        this.getOrderList();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getOrderList();
    }
});
