import api from 'utils/api';

Page({
    data: {
        current_paged: 1,
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

        let { current_paged, userList, activity_id } = this.data;

        const { records, total_paged } = await api.hei.activityUserList({ paged: current_paged, activity_id });

        if (records.length > 0) {
            userList = userList.concat(records);
            ++current_paged;
        }
        this.setData({
            isLoading: false,
            current_paged,
            userList,
            total_paged
        });
    },
    onReachBottom() {
        const { current_paged, total_paged } = this.data;
        if (current_paged >= total_paged) {
            console.log('到底了');
            return;
        }
        this.getActivityUserList();
    }
});
