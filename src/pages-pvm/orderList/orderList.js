import api from 'utils/api';
import { ORDER_STATUS_TEXT, MAGUA_ORDER_STATUS_TEXT } from 'constants/index';
import { valueToText } from 'utils/util';

const app = getApp();

// const o = {
//     'magua': MAGUA_ORDER_STATUS_TEXT
// };

// const D_ORDER_STATUS_TEXT = o[app.globalData.defineTypeGlobal] || ORDER_STATUS_TEXT;

// const dataStatus = D_ORDER_STATUS_TEXT.filter((item) => {
//     const o = [1, 10, 2, 3, 5, 4, 1010, 1011];
//     return o.indexOf(item.value) > -1;
// });

// dataStatus.unshift({ text: '全部', value: null });

// console.log(dataStatus);


const dataStatus = [
  { text: '全部', value: null },
  { text: '待付款', value: 1000 },
  // { text: "审核中", value: 1010 }, // 转账支付审核中
  // { text: "待成团", value: 10 },
  { text: '待发货', value: 2000 },
  // { text: "待发货", value: 2002 }, // 已打单
  { text: '已发货', value: 3000 },
  // { text: '已部分发货', value: 3001 },
  // { text: "审核驳回", value: 1011 }, // 转账支付审核驳回
  { text: '退款中', value: 5000 },
  { text: '已完成', value: 4000 },
  // { text: '订单关闭', value: 7000 },
  // { text: '系统关闭', value: 8000 },
  { text: '退款成功', value: 6000 },
  // { text: "待赠送", value: 2001 }, // 礼品卡购买成功
  // { text: '订单已取消', value: 5 },
];

Page({
    data: {
        orders: [],
        next_cursor: 0,
        activeIndex: 0,
        isRefresh: true,
        navbarListData: dataStatus,
        selectedStatus: null
    },

    async loadOrders() {
        const { next_cursor, isRefresh, orders, selectedStatus } = this.data;
        const queryOption = { cursor: next_cursor };
        if (selectedStatus) {
            queryOption.status = selectedStatus;
        }
        if (isRefresh) {
            wx.showLoading();
        }
        const data = await api.hei.fetchOrderList(queryOption);
        const formatedOrders = data.orders.map((order) => {
            const statusCode = Number(order.status);
            order.statusCode = statusCode;
            order.statusText = valueToText(ORDER_STATUS_TEXT, Number(order.status));
            order.productCount = order.items.reduce((count, item) => {
                return count + Number(item.quantity);
            }, 0);
            return order;
        });

        const newOrders = isRefresh ? formatedOrders : orders.concat(formatedOrders);
        this.setData({
            orders: newOrders,
            isRefresh: false,
            next_cursor: data.next_cursor,
            config: data.config
        });

        wx.hideLoading();
        console.log(this.data);
    },

    changeNavbarList(ev) {
        const { index, value } = ev.detail;
        this.setData({
            selectedStatus: value,
            activeIndex: index,
            isRefresh: true,
            next_cursor: 0
        });
        this.loadOrders();
    },

    async onLoad({ status }) {
        const state = Number(status) || null;
        const { themeColor } = app.globalData;
        console.log('themeColorgege', themeColor);
        const { navbarListData } = this.data;
        let index = navbarListData.findIndex((item) => {
            return item.value === state;
        });

        this.setData({
            selectedStatus: state,
            activeIndex: index,
            themeColor,
            globalData: app.globalData,
        });
        this.loadOrders();
    },

    async onPullDownRefresh() {
        this.setData({ isRefresh: true, next_cursor: 0 });
        await this.loadOrders();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadOrders();
    },

    onConfirmOrder(ev) {
        const { orderNo, orderIndex } = ev.detail;
        const updateData = {};
        updateData[`orders[${orderIndex}].statusCode`] = 4;
        updateData[`orders[${orderIndex}].status`] = 4;
        updateData[`orders[${orderIndex}].statusText`] = valueToText(ORDER_STATUS_TEXT, 4000);
        this.setData(updateData);
    },

    onPayOrder(ev) {
        const { orderNo, orderIndex } = ev.detail;
        const updateData = {};
        updateData[`orders[${orderIndex}].statusCode`] = 2;
        updateData[`orders[${orderIndex}].status`] = 2;
        updateData[`orders[${orderIndex}].statusText`] = valueToText(ORDER_STATUS_TEXT, 2000);
        this.setData(updateData);
    },
    onCloseOrder(ev) {
        const { orderNo, orderIndex } = ev.detail;
        console.log(orderIndex);
        const updateData = {};
        updateData[`orders[${orderIndex}].statusCode`] = 7;
        updateData[`orders[${orderIndex}].status`] = 7;
        updateData[`orders[${orderIndex}].statusText`] = valueToText(ORDER_STATUS_TEXT, 7000);
        this.setData(updateData);
    }
});
