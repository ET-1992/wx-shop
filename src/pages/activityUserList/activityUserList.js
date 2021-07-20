import api from 'utils/api';

Page({
    data: {
        current_cursor: 0,
        isAll: false,
        userList: []
    },

    onLoad(params) {
        const { activity_id } = params;
        this.setData({
            activity_id
        }, () => {
            this.initPage();
        });


    },
    initPage() {
        this.getActivityUserList();
    },
    // 获取参加活动的用户
    async getActivityUserList() {
        this.setData({ isLoading: true });

        let { current_cursor, userList, activity_id } = this.data;

        const { records, next_cursor } = await api.hei.activityUserList({ cursor: current_cursor, activity_id });

        if (records.length > 0) {
            userList = userList.concat(records);
        }
        this.setData({
            isLoading: false,
            userList,
            current_cursor: next_cursor
        });
    },
    onReachBottom() {
        const { current_cursor } = this.data;
        if (!current_cursor) {
            console.log('到底了');
            return;
        }
        this.getActivityUserList();
    }
});
