import api from 'utils/api';

const app = getApp();
Page({
    data: {
        tabActive: 0,
        isLoading: true,
        indexToStatus: {
            '0': '',
            '1': '102',
            '2': '103',
        },  // 标签对应请求
        banner: '',
        roomList: [],
        themeColor: {},
    },

    onLoad() {
        this.getInit();
        this.getListData();
    },

    // 获取配置内容
    getInit() {
        let themeColor = app.globalData.themeColor;
        this.setData({
            themeColor,
        });
    },

    // 标签切换
    onTabChange(event) {
        let tabActive = event.detail.name;
        this.setData({ tabActive });
        this.getListData();
    },

    // 获取直播列表
    async getListData() {
        this.setData({ isLoading: true });
        let {
            tabActive,
            indexToStatus,
        } = this.data;
        let status = indexToStatus[tabActive];
        let data = await api.hei.getLiveRooms({
            status,
        });
        let { banner, live_rooms } = data;
        this.setData({
            isLoading: false,
            banner,
            roomList: live_rooms,
        });
    },

    // 点击跳转按钮
    onClickBtn(e) {
        let { status, id } = e.currentTarget.dataset;
        console.log('status', status);
        console.log('id', id);
    },
});