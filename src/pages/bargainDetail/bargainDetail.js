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
        showMore: false,
        isShowShareModal: false,
        showPosterModal: false
    },

    onLoad(params) {
        console.log('params', params);
        const {
            globalData: { themeColor },
            systemInfo: { isIphoneX }
        } = app;

        this.setData({
            ...params,
            themeColor,
            isIphoneX,
            globalData: app.globalData
        });
        // this.loadActorsData();
    },

    onShow() {
        const { code } = this.data;
        this.onLoadData(code);
        this.loadActorsData();
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
            const { mission, product, products } = await api.hei.bargainDetail({ code });
            mission.needBargainPrice = (Number(mission.current_price) - Number(mission.target_price)).toFixed(2);
            mission.isBargainPrice = (Number(mission.price) - Number(mission.current_price)).toFixed(2);
            this.setData({
                mission: mission,
                product: product,
                products: products,
                share_image: (mission && mission.share_image) || (product && product.image_url),
                share_title: mission && mission.share_title,
                isLoading: false
            }, () => {
                // 砍价倒计时
                if (product.status === 'publish') {
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

    onShare() {
        const { isShowShareModal } = this.data;
        this.setData({
            isShowShareModal: !isShowShareModal
        });
    },

    onShowPoster() {
        const { code, product } = this.data;
        let posterData = {
            code,
            banner: product.thumbnail || product.image_url,
            title: product.title,
            bargain_price: product.bargain_price,
            price: product.price
        };
        this.setData({
            showPosterModal: true,
            isShowShareModal: false,
            posterData
        });
    },

    onClosePoster() {
        this.setData({
            showPosterModal: false
        });
    },

    // 分享按钮
    onShareAppMessage() {
        let opts = { isOthers: true };
        return onDefaultShareAppMessage.call(this, opts);
    },

    // 获取用户信息 并 助力砍价
    async bindGetUserInfo(e) {
        const { code, actors } = this.data;
        console.log('code147', code);
        try {
            const data = await api.hei.bargainHelp({ code });
            console.log('data150', data);
            await proxy.showToast({
                title: '砍价成功'
            });
            console.log('actors157', actors);
            actors.unshift(data.actor);
            this.setData({ actors }, () => { console.log('actors158', this.data) });
            this.onLoadData(code);
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

    onHide() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },

    onUnload() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },

    onPullDownRefresh() {
        console.log('onPullDownRefresh');
        this.setData({ isLoading: true, next_cursor: 'begin', actors: [] });
        this.onShow();
        wx.stopPullDownRefresh();
    }
});
