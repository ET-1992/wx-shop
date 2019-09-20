import api from 'utils/api';
import getRemainTime from 'utils/getRemainTime';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
const app = getApp();

Page({
    data: {
        title: 'bargainDetail',
        remainTime: {
            hour: '00',
            minute: '00',
            second: '00',
        },
        isOthers: false,
        isLoading: true
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        this.setData({
            ...params,
            themeColor,
            globalData: app.globalData,
        }, () => {
            this.onLoadData(params.code);
        });
        // 砍价倒计时
        this.intervalId = setInterval(() => {
            this.countDown();
        }, 1000);
    },

    // onShow() {
    //     const { code } = this.data;
    //     this.onLoadData(code);
    // },

    countDown() {
        const { time_expired } = this.data.mission;
        const now = Math.round(Date.now() / 1000);
        let timeLimit = time_expired - now;
        const [hour, minute, second] = getRemainTime(timeLimit);
        let day = parseInt(hour / 24, 10);
        this.setData({
            timeLimit,
            remainTime: {
                day: day,
                hour: hour - day * 24,
                minute,
                second
            }
        });
    },

    async onLoadData(code) {
        const data = await api.hei.bargainDetail({ code });
        this.setData({ ...data, isLoading: false }, () => { this.countDown() });
        console.log('mission58', this.data.mission);
    },

    // 助力砍价
    async bargainHelp(e) {
        const { code } = e.currentTarget.dataset;
        console.log('code64', code);
        try {
            const data = api.hei.bargainHelp({ code });
            console.log('data67', data);
            await proxy.showToast({
                title: '砍价成功'
            });
            this.onLoadData(code);
        } catch (err) {
            await proxy.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    // 分享按钮
    onShareAppMessage() {
        let opts = { isOthers: true };
        return onDefaultShareAppMessage.call(this, opts);
    },

    onUnload() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
});
