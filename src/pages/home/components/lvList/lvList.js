const app = getApp();

Component({
    properties: {
        lvObj: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title, type, id } = newVal;
                this.setData({
                    content,
                    setting,
                    title,
                    type,
                    id
                });
            }
        }
    },

    data: {
        themeColor: {},
        lvStatusText: {
            101: '进行中',
            102: '未开始',
            103: '已结束'
        },
        lvBtnText: {
            101: '马上围观',
            102: '先去订阅',
            103: '去看回放'
        }
    },

    attached() {
        const { tabbarPages, themeColor } = app.globalData;
        this.setData({ tabbarPages, themeColor });
    },

    methods: {
        // 直播间跳转
        onClickBtn(e) {
            let { status, id } = e.currentTarget.dataset;
            console.log('status', status);
            let obj = { '101': '视频', '102': '精彩预告', '103': '精彩回放' };
            let roomId = id;
            let url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`;
            wx.navigateTo({
                url,
                fail(e) {
                    console.log(e);
                    wx.showToast({
                        title: `查看${obj[status]}失败`,
                        icon: 'none',
                    });
                },
            });
        }
    }
});