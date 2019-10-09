import api from 'utils/api';
import getRemainTime from 'utils/getRemainTime';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
import { getAgainUserForInvalid, autoNavigate } from 'utils/util';
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
        isLoading: true,
        next_cursor: 'begin',
        isBottom: false,
        actors: [],
        showMore: false
    },

    onLoad(params) {
        console.log('params', params);
        const { themeColor } = app.globalData;
        this.setData({
            ...params,
            themeColor,
            globalData: app.globalData
        });
        this.loadActorsData();
        // , () => {
        // 	this.onLoadData(params.code);
        // }
    },

    onShow() {
        const { code } = this.data;
        this.onLoadData(code);
    },

    countDown() {
        const { time_expired } = this.data.mission;
        if (time_expired) {
            const now = Math.round(Date.now() / 1000);
            let timeLimit = time_expired - now;
            // console.log('timeLimit', timeLimit, typeof timeLimit);
            if (timeLimit > 0) {
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
            }
        }
    },

    async onLoadData(code) {
        try {
            const data = await api.hei.bargainDetail({ code });
            data.mission.needBargainPrice = (Number(data.mission.current_price) - Number(data.mission.target_price)).toFixed(2);
            console.log('data60', data);
            this.setData({
                mission: data.mission,
                product: data.product,
                products: data.products,
                isLoading: false
            }, () => {
                // 砍价倒计时
                if (data.product.status === 'publish') {
                    this.countDown();
                    this.intervalId = setInterval(() => {
                        this.countDown();
                    }, 1000);
                }
            });
            console.log('mission58', this.data.mission);
        } catch (err) {
            console.log('err72', err);
            await proxy.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    // 砍价榜scroll滚动触底
    async loadActorsData(e) {
        console.log('e90', e);
        const { code, next_cursor, isBottom, actors } = this.data;
        console.log('actors90', actors);
        try {
            if (next_cursor !== 0) {
                const data = await api.hei.bargainActor({
                    code,
                    cursor: next_cursor
                });
                console.log('Actordata96', data);
                const newActors = isBottom ? actors.concat(data.actors) : data.actors;
                this.setData({
                    actors: newActors,
                    isBottom: true,
                    next_cursor: data.next_cursor
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    },

    listToggle() {
        const { showMore, next_cursor } = this.data;

        if (!showMore && next_cursor !== 0) {
            this.loadActorsData();
        } else {
            this.setData({
                showMore: !showMore
            });
        }
    },

    // 分享按钮
    onShareAppMessage() {
        let opts = { isOthers: true };
        return onDefaultShareAppMessage.call(this, opts);
    },

    // 获取用户信息 并 助力砍价
    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const { code, actors } = this.data;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        console.log('user88', user);
        // const { code } = e.currentTarget.dataset;
        // console.log('code64', code);
        try {
            const data = await api.hei.bargainHelp({ code });
            console.log('data67', data);
            await proxy.showToast({
                title: '砍价成功'
            });
            if (user) {
                this.setData({ user });
            }
            this.setData({
                actors: actors.unshift(data.actor)
            });
            // this.onLoadData(code);
            this.onShow();
        } catch (err) {
            console.log('err105', err);
            await proxy.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
        this.setData({ isHelp: true });
    },

    // 立即购买
    async onBuy() {
        const { product, mission } = this.data;
        if (product.status === 'unpublished' || product.status === 'sold_out') {
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '活动太火爆了，商品已抢光',
                confirmText: '看看其他',
                confirmColor: '#05397E',
                showCancel: false,
            });
            if (confirm) {
                autoNavigate('/pages/miaoshaList/miaoshaList?type=bargain');
            }
        } else {
            autoNavigate(`/pages/productDetail/productDetail?id=${mission.post_id}`);
        }
    },

    onUnload() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },

    onPullDownRefresh() {
        console.log('onPullDownRefresh');
        this.setData({ isLoading: true });
        this.onShow();
        wx.stopPullDownRefresh();
    }
});
