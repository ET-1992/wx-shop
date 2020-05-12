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
        try {
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
        } catch (e) {
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#3CC51F'
            });
        }
    },

    // 直播间跳转
    onClickBtn(e) {
        let { status, id } = e.currentTarget.dataset;
        console.log('status', status);
        let liveObj = { '101': '直播', '102': '直播预告', '103': '精彩回放' };
        let roomId = id;
        let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 }));
        let url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`;
        wx.hideToast();
        wx.navigateTo({
            url,
            fail(e) {
                console.log('e', e);
                wx.showToast({
                    title: `查看${liveObj[status]}失败`,
                    icon: 'none',
                });
            },
        });
    },
});