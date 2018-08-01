import { getNodeInfo, formatTime } from 'utils/util';
import api from 'utils/api';
import { SHARE_STATUS_TEXT } from 'constants/index';

const app = getApp();

Page({
    data: {
        title: 'shareMoney',
        isActive: 1,
        modal: {},
        getMoneyLogCursor: 0,
        showMoneyLogCursor: 0,
        showMoneyLogItems: [],
        getMoneyLogItems: [],
        isLoading: true
    },

    onLoad(parmas) {
        console.log(parmas);
        const { themeColor } = app.globalData;
        this.setData({
            isIphoneX: app.systemInfo.isIphoneX,
            themeColor
        });
    },

    async onShow() {
        this.loadData();
    },

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

    async loadData() {
        let { isActive, showMoneyLogCursor = 0, getMoneyLogCursor = 0, showMoneyLogItems = [], getMoneyLogItems = [] } = this.data;
        if (isActive === 1) {
            const showMoneyLogData = await api.hei.showMoneyLog({ cursor: showMoneyLogCursor });
            console.log(showMoneyLogData);
            showMoneyLogItems = showMoneyLogItems.concat(showMoneyLogData.data);
            showMoneyLogCursor = showMoneyLogData.next_cursor;

            showMoneyLogItems.forEach((item) => {
                item.formatTime = formatTime(new Date(item.time * 1000));
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
                item.formatTime = formatTime(new Date(item.time * 1000));
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
});
