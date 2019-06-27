import { getNodeInfo, formatTime } from 'utils/util';
import api from 'utils/api';
import { SHARE_STATUS_TEXT } from 'constants/index';

const app = getApp();

Page({
    data: {
        title: 'affiliateMoney',
        isActive: 1,
        modal: {},
        getMoneyLogCursor: 0,
        showMoneyLogCursor: 0,
        showMoneyLogItems: [],
        getMoneyLogItems: [],
        isLoading: true,
        startDate: '2019-06-01',
        endDate: '2019-06-30'
    },

    onLoad(options) {
        console.log(options, 'options');
        const { themeColor } = app.globalData;
        this.setData({
            isIphoneX: app.systemInfo.isIphoneX,
            themeColor,
            globalData: app.globalData,
            isActive: Number(options.isActive)
        });
        if (Number(options.isActive) === 2) {
            wx.setNavigationBarTitle({
                title: '提现记录'
            });
            this.loadData(2);
        } else {
            wx.setNavigationBarTitle({
                title: '收益详情'
            });
            this.loadData(1);
        }
    },

    // async onShow() {
    //     this.loadData();
    // },

    checkActive(e) {
        console.log(e);
        const { index } = e.currentTarget.dataset;
        console.log(index);
        this.setData({
            isActive: index,
            getMoneyLogCursor: 0,
            showMoneyLogCursor: 0,
            showMoneyLogItems: [],
            getMoneyLogItems: [],
            isLoading: true
        }, () => {
            this.loadData();
        });
    },

    applyGetMoney() {
        this.setData({
            modal: {
                title: '提现',
                body: '提现前请先到分享中心完善个人资料',
                isShowModal: true
            }
        });
    },

    async loadData(isActive) {
        let { showMoneyLogCursor = 0, getMoneyLogCursor = 0, showMoneyLogItems = [], getMoneyLogItems = [] } = this.data;
        if (isActive === 1) {
            const showMoneyLogData = await api.hei.showMoneyLog({ cursor: showMoneyLogCursor });
            console.log(showMoneyLogData);
            showMoneyLogItems = showMoneyLogItems.concat(showMoneyLogData.data);
            console.log('showMoneyLogItems', showMoneyLogItems);
            showMoneyLogCursor = showMoneyLogData.next_cursor;

            showMoneyLogItems.forEach((item) => {
                console.log(item.time, 'time');
                item.formatTime = item.time;
            });

            this.setData({
                showMoneyLogItems,
                showMoneyLogCursor,
                isLoading: false
            });
        } else if (isActive === 2) {
            const getMoneyLogData = await api.hei.getMoneyLog({ cursor: getMoneyLogCursor });
            console.log(getMoneyLogData);

            getMoneyLogItems = getMoneyLogItems.concat(getMoneyLogData.data);
            getMoneyLogCursor = getMoneyLogData.next_cursor;

            getMoneyLogItems.forEach((item) => {
                item.formatTime = item.time;
                item.formatStatus = SHARE_STATUS_TEXT[item.status];
            });

            this.setData({
                getMoneyLogItems,
                getMoneyLogCursor,
                SHARE_STATUS_TEXT,
                isLoading: false
            });
        }
    },

    async onReachBottom() {
        const { showMoneyLogCursor, getMoneyLogCursor, isActive } = this.data;
        if ((!showMoneyLogCursor && isActive === 1) || (!getMoneyLogCursor && isActive === 2)) { return }
        this.loadData();
    },

    bindStartDateChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            startDate: e.detail.value
        });
    },

    bindEndDateChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            endDate: e.detail.value
        });
    },

    tapSearch() {
        console.log('2');
    }
});
