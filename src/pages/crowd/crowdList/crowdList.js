import api from 'utils/api';
import { ORDER_STATUS_TEXT, CROWD_STATUS_TEXT } from 'constants/index';
import { valueToText } from 'utils/util';
import { Decimal } from 'decimal.js';

const app = getApp();

Page({
    data: {
        status: 2,
        orders: [],
        next_cursor: 0,
        // isLoading: true,
        isRefresh: true,
        statusList: [
            { name: '我的订单', value: 2 },
            { name: '我的代付', value: 1 }
        ]
    },

    onLoad() {
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        wx.setNavigationBarTitle({
            title: '代付订单'
        });
        this.setData({
            themeColor,
            isIphoneX
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
            next_cursor: data.next_cursor,
            // isLoading: false
        });
        wx.hideLoading();
        console.log(this.data);
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

    touchstart(e) {
        this.data.clineX = e.touches[0].clientX;
        this.data.clineY = e.touches[0].clientY;
    },
    touchend(e) {
        console.log(e);
        let ev;
        let { status, statusList } = this.data;
        // next
        if (e.changedTouches[0].clientX - this.data.clineX < -70) {

            if (status === statusList[1].value) {
                ev = {
                    currentTarget: {
                        dataset: {
                            value: 2,
                        },
                    },
                };
            } else {
                ev = {
                    currentTarget: {
                        dataset: {
                            value: 1,
                        },
                    },
                };
            }
            this.onStautsItemClick(ev);
        }
        // pre
        if (e.changedTouches[0].clientX - this.data.clineX > 70) {
            if (status === 2) {
                return;
            } else {
                ev = {
                    currentTarget: {
                        dataset: {
                            value: 2,
                        },
                    },
                };
                this.onStautsItemClick(ev);
            }
        }
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadOrders();
    }
});
