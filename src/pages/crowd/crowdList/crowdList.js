import api from 'utils/api';
import { ORDER_STATUS_TEXT, CROWD_STATUS_TEXT } from 'constants/index';
import { valueToText } from 'utils/util';
import { Decimal } from 'decimal.js';

const app = getApp();

Page({
    data: {
        orders: [],
        next_cursor: 0,
        isRefresh: true,
        navbarListData: [
            { text: '我的代付', value: 1 },
            { text: '我的订单', value: 2 }
        ],
        activeIndex: 0
    },

    onLoad() {
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        wx.setNavigationBarTitle({ title: '代付订单' });
        const { activeIndex, navbarListData } = this.data;
        this.setData({
            themeColor,
            isIphoneX,
            status: navbarListData[activeIndex].value,
            globalData: app.globalData
        });
        this.loadOrders();
    },
    async loadOrders() {
        // new Decimal(null).div(1).mul(100).toNumber().toFixed(2);
        const { next_cursor, isRefresh, orders, status } = this.data;
        const queryOption = {
            cursor: next_cursor,
            status
        };
        if (isRefresh) { wx.showLoading({ title: '加载中', }) }

        const data = await api.hei.crowdList(queryOption);
        const formatedOrders = data.orders.map((order) => {
            const statusCode = Number(order.status);
            order.statusCode = statusCode;
            order.statusText = valueToText(CROWD_STATUS_TEXT, Number(order.crowd.status));
            order.normalStatusText = valueToText(ORDER_STATUS_TEXT, Number(order.status));
            order.productCount = order.items.reduce((count, item) => {
                return count + Number(item.quantity);
            }, 0);
            order.progress = new Decimal(order.crowd.pay_amount).div(order.amount).mul(100).toNumber().toFixed(2);
            return order;
        });
        const newOrders = isRefresh ? formatedOrders : orders.concat(formatedOrders);
        this.setData({
            orders: newOrders,
            isRefresh: false,
            next_cursor: data.next_cursor
        });
        wx.hideLoading();
        console.log(this.data);
    },

    changeNavbarList(ev) {
        const { index, value } = ev.detail;
        this.setData({
            status: value,
            activeIndex: index,
            isRefresh: true,
            next_cursor: 0,
            orders: []
        });
        this.loadOrders();
    },

    touchstart(e) {
        this.data.clineX = e.touches[0].clientX;
        this.data.clineY = e.touches[0].clientY;
    },
    touchend(e) {
        let X = e.changedTouches[0].clientX - this.data.clineX;
        let Y = e.changedTouches[0].clientY - this.data.clineY;
        let { activeIndex } = this.data;
        if (Math.abs(X) > Math.abs(Y) && X < 0) {
            this.moveIndex(activeIndex + 1);
        }
        if (Math.abs(X) > Math.abs(Y) && X > 0) {
            this.moveIndex(activeIndex - 1);
        }
    },
    moveIndex(index) {
        let activeIndex = index;
        const { navbarListData } = this.data;
        const { length, last = length - 1 } = navbarListData;
        if (activeIndex < 0) {
            return;
        }
        if (index > last) {
            activeIndex = 0;
        }
        this.setData({
            status: navbarListData[activeIndex].value,
            activeIndex,
            isRefresh: true,
            next_cursor: 0,
            orders: []
        });
        this.loadOrders();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadOrders();
    }
});
