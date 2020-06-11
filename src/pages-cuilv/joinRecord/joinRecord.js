import { go } from 'utils/util';
import api from 'utils/api';
import { showModal } from 'utils/wxp';

Page({
    data: {
        title: 'joinRecord',
        orderStatus: true,
        isLoading: true,
        statusName: 'end',  // 标签栏状态
        activitys: [],  // 记录列表
        themeColor: {},

    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = getApp().globalData;
        this.setData({ themeColor });
        this.getRecordData();
    },

    go,

    // 获取记录数据
    async getRecordData() {
        this.setData({ isLoading: true });
        let { statusName } = this.data;
        let statusObj = { 'go': 1, 'end': 4, 'bingo': 4 };
        const PERSON_LOG = 1;
        let status = statusObj[statusName];
        let requiredParams = {
            type: PERSON_LOG,
            activity_status: status,
        };
        // 添加一个中奖记录
        if (statusName === 'bingo') {
            const WIN_A_PRIZE = 2;
            requiredParams.status = WIN_A_PRIZE;
        }
        const data = await api.hei.fetchDrawOrderPersonList(requiredParams);
        let { activitys } = data;
        this.setData({
            isLoading: false,
            activitys,
        });
    },

    // 切换标签
    onTabsChange(e) {
        let { name } = e.detail;
        this.setData({ statusName: name });
        this.getRecordData();
    },

    // 监听下拉刷新
    onPullDownRefresh() {
        this.getRecordData();
        wx.stopPullDownRefresh();
    },

    // 继续参与
    async onContinueBuy(e) {
        let { postId, blogId } = e.currentTarget.dataset;
        let { cancel } = await showModal({
            title: '温馨提示',
            content: '即将加入购物车',
        });
        if (cancel) return;
        try {
            await api.hei.addCart({
                post_id: postId,
                source_blog_id: blogId,
            });
            wx.navigateTo({ url: `/pages-cuilv/cloudCart/cloudCart` });
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.errMsg,
                showCancel: false,
            });
        }
    },
});
