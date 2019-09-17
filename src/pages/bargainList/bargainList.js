import api from 'utils/api';
import { BARGAIN_STATUS_TEXT } from 'constants/index';
import { valueToText } from 'utils/util';

const app = getApp();
Page({
    data: {
        orders: [
            {
                thumbnail: 'https://hei.dev.97866.com/wp-content/uploads/sites/2/2019/07/006%E8%B6%85%E7%BA%A7%E5%96%B7%E7%81%AB%E9%BE%99%EF%BC%B9.png?imageView2/1/w/200/h/200/q/70#',
                title: '好易康漱口水清新口气除口臭异味去牙渍清洁男女士好易康漱口水...',
                low_price: '6.99',
                finish_price: '3.9',
                free_price: '7.80',
                status: 2
            },
            {
                thumbnail: 'https://hei.dev.97866.com/wp-content/uploads/sites/2/2019/07/006%E8%B6%85%E7%BA%A7%E5%96%B7%E7%81%AB%E9%BE%99%EF%BC%B9.png?imageView2/1/w/200/h/200/q/70#',
                title: '好易康漱口水清新口气除口臭异味去牙渍清洁男女士好易康漱口水...',
                low_price: '8.99',
                finish_price: '3.19',
                free_price: '7.00',
                status: 3
            },
            {
                thumbnail: 'https://hei.dev.97866.com/wp-content/uploads/sites/2/2019/07/006%E8%B6%85%E7%BA%A7%E5%96%B7%E7%81%AB%E9%BE%99%EF%BC%B9.png?imageView2/1/w/200/h/200/q/70#',
                title: '好易康漱口水清新口气除口臭异味去牙渍清洁男女士好易康漱口水...',
                low_price: '2.99',
                finish_price: '4.9',
                free_price: '9.80',
                status: 1
            },
            {
                thumbnail: 'https://hei.dev.97866.com/wp-content/uploads/sites/2/2019/07/006%E8%B6%85%E7%BA%A7%E5%96%B7%E7%81%AB%E9%BE%99%EF%BC%B9.png?imageView2/1/w/200/h/200/q/70#',
                title: '好易康漱口水清新口气除口臭异味去牙渍清洁男女士好易康漱口水...',
                low_price: '5.89',
                finish_price: '2.08',
                free_price: '1.80',
                status: 2
            }
        ],
        next_cursor: 0,
        activeIndex: 0,
        isRefresh: true,
        navbarListData: BARGAIN_STATUS_TEXT,
        selectedStatus: null
    },

    // async loadOrders() {
    //     const { next_cursor, isRefresh, orders, selectedStatus } = this.data;
    //     const queryOption = { cursor: next_cursor };
    //     if (selectedStatus) {
    //         queryOption.status = selectedStatus;
    //     }
    //     if (isRefresh) {
    //         wx.showLoading();
    //     }
    //     const data = await api.hei.fetchOrderList(queryOption);
    //     const formatedOrders = data.orders.map((order) => {
    //         const statusCode = Number(order.status);
    //         order.statusCode = statusCode;
    //         order.statusText = valueToText(BARGAIN_STATUS_TEXT, Number(order.status));
    //         order.productCount = order.items.reduce((count, item) => {
    //             return count + Number(item.quantity);
    //         }, 0);
    //         return order;
    //     });

    //     const newOrders = isRefresh ? formatedOrders : orders.concat(formatedOrders);
    //     this.setData({
    //         orders: newOrders,
    //         isRefresh: false,
    //         next_cursor: data.next_cursor,
    //     });

    //     wx.hideLoading();
    //     console.log(this.data);
    // },

    changeNavbarList(ev) {
        const { index, value } = ev.detail;
        this.setData({
            selectedStatus: value,
            activeIndex: index,
            isRefresh: true,
            next_cursor: 0
        });
        // this.loadOrders();
    },

    async onLoad({ status }) {
        // const state = Number(status) || null;
        const { themeColor } = app.globalData;
        // const { navbarListData } = this.data;
        // let index = navbarListData.findIndex((item) => {
        //     return item.value === state;
        // });

        this.setData({
            // selectedStatus: state,
            // activeIndex: index,
            themeColor,
            globalData: app.globalData,
        });
        // this.loadOrders();
    },

    // async onPullDownRefresh() {
    //     this.setData({ isRefresh: true, next_cursor: 0 });
    //     await this.loadOrders();
    //     wx.stopPullDownRefresh();
    // },

    // async onReachBottom() {
    //     const { next_cursor } = this.data;
    //     if (!next_cursor) { return }
    //     this.loadOrders();
    // },

    // onConfirmOrder(ev) {
    //     const { orderNo, orderIndex } = ev.detail;
    //     const updateData = {};
    //     updateData[`orders[${orderIndex}].statusCode`] = 4;
    //     updateData[`orders[${orderIndex}].status`] = 4;
    //     updateData[`orders[${orderIndex}].statusText`] = valueToText(BARGAIN_STATUS_TEXT, 4);
    //     this.setData(updateData);
    // },

    // onPayOrder(ev) {
    //     const { orderNo, orderIndex } = ev.detail;
    //     const updateData = {};
    //     updateData[`orders[${orderIndex}].statusCode`] = 2;
    //     updateData[`orders[${orderIndex}].status`] = 2;
    //     updateData[`orders[${orderIndex}].statusText`] = valueToText(BARGAIN_STATUS_TEXT, 2);
    //     this.setData(updateData);
    // },
    // onCloseOrder(ev) {
    //     const { orderNo, orderIndex } = ev.detail;
    //     console.log(orderIndex);
    //     const updateData = {};
    //     updateData[`orders[${orderIndex}].statusCode`] = 7;
    //     updateData[`orders[${orderIndex}].status`] = 7;
    //     updateData[`orders[${orderIndex}].statusText`] = valueToText(BARGAIN_STATUS_TEXT, 7);
    //     this.setData(updateData);
    // },
});
