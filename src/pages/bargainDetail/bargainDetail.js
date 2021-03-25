import api from 'utils/api';
import getRemainTime from 'utils/getRemainTime';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
import { getUserProfile, autoNavigate, subscribeMessage } from 'utils/util';
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
        next_cursor: 'begin',
        isBottom: false,
        actors: [],
        showMore: false,
        isShowShareModal: false,
        showPosterModal: false,
        code: ''
    },

    async onLoad({ sku_id, post_id, code, isOthers }) {
        console.log('code27', sku_id, post_id, code, isOthers);
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        const {
            globalData: { themeColor },
            systemInfo: { isIphoneX }
        } = app;
        let mission_code = post_id && !isOthers ? await this.createBargain(post_id, sku_id) : code;

        this.setData({
            isOthers,
            code: mission_code,
            themeColor,
            isIphoneX,
            globalData: app.globalData
        });

        await this.onLoadData();
        await this.loadActorsData();
        wx.hideLoading();
        console.log('code49', this.data.code);
    },

    async createBargain(post_id, sku_id) {
        const { mission } = await api.hei.createBargain({
            post_id: post_id,
            sku_id: sku_id || 0
        });
        return mission.code;
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

    async onLoadData() {
        const { code } = this.data;
        try {
            const { mission, product, products, share_image, share_title } = await api.hei.bargainDetail({ code });
            mission.needBargainPrice = (Number(mission.current_price) - Number(mission.target_price)).toFixed(2);
            mission.isBargainPrice = (Number(mission.price) - Number(mission.current_price)).toFixed(2);
            this.setData({
                mission: mission,
                product: product,
                products: products,
                share_image: share_image,
                share_title: share_title
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
        console.log('loadActorsDataE90', e);
        const { code, next_cursor, isBottom, actors } = this.data;
        console.log('actors90', actors);
        try {
            if (next_cursor !== 0) {
                const data = await api.hei.bargainActor({
                    code,
                    cursor: next_cursor
                });
                console.log('Actor96', data);
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

    async onShare() {
        const { isShowShareModal } = this.data;
        if (!isShowShareModal) {
            await subscribeMessage([{ key: 'bargain_success' }, { key: 'bargain_failed' }]);
        }
        this.setData({
            isShowShareModal: !isShowShareModal
        });
    },

    onShowPoster() {
        const { code, product: { thumbnail, image_url, title, bargain_price, price }} = this.data;
        let posterData = {
            code,
            banner: thumbnail || image_url,
            title: title,
            bargain_price: bargain_price,
            price: price
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
        let opts = { isOthers: true, code: this.data.code };
        return onDefaultShareAppMessage.call(this, opts);
    },

    // 获取用户信息 并 助力砍价
    async bindGetUserInfo() {
        await getUserProfile();
        try {
            const { code, actors } = this.data;
            const data = await api.hei.bargainHelp({ code });
            wx.showToast({
                title: '砍价成功',
                icon: 'success'
            });
            actors.unshift(data.actor);
            this.setData({
                actors
            }, this.onLoadData);
        } catch (err) {
            console.log('err105', err);
            wx.showModal({
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
        this.setData({ next_cursor: 'begin', actors: [] });
        this.onLoadData();
        this.loadActorsData();
        wx.stopPullDownRefresh();
    }
});
