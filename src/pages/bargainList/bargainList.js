import api from 'utils/api';
import { BARGAIN_STATUS_TEXT } from 'constants/index';
import { go } from 'utils/util';
const app = getApp();

Page({
    data: {
        missions: [],
        next_cursor: 0,
        activeIndex: 0,
        isRefresh: true,
        navbarListData: BARGAIN_STATUS_TEXT,
        selectedStatus: null,
    },

    go,

    onLoad(params) {
        const { themeColor } = app.globalData;
        this.setData({
            selectedStatus: null,
            themeColor,
            globalData: app.globalData,
        });
    },

    onShow() {
        this.setData({
            missions: [],
            next_cursor: 0,
            activeIndex: 0,
            isRefresh: true,
            navbarListData: BARGAIN_STATUS_TEXT,
            selectedStatus: null,
        }, this.loadOrders);
    },

    async loadOrders() {
        const { next_cursor, isRefresh, missions, selectedStatus } = this.data;
        const queryOption = { cursor: next_cursor };
        if (selectedStatus) {
            queryOption.status = selectedStatus;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        const data = await api.hei.bargainList(queryOption);

        const newOrders = isRefresh ? data.missions : missions.concat(data.missions);
        newOrders.forEach(item => {
            item.isBargainPrice = (Number(item.price) - Number(item.current_price)).toFixed(2);
            item.needBargainPrice = (Number(item.current_price) - Number(item.target_price)).toFixed(2);
        });

        this.setData({
            missions: newOrders,
            isRefresh: false,
            next_cursor: data.next_cursor,
            share_image: data.share_image,
            share_title: data.share_title,
        });

        wx.hideLoading();
        console.log('this.data44', this.data);
    },

    changeNavbarList(ev) {
        const { index, value } = ev.detail;
        this.setData({
            selectedStatus: value,
            activeIndex: index,
            isRefresh: true,
            next_cursor: 0,
        });
        this.loadOrders();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadOrders();
    },
});
