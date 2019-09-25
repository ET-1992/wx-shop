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
    },

    // onShow() {
    //     const { code } = this.data;
    //     this.onLoadData(code);
    // },

    countDown() {
        const { time_expired } = this.data.mission;
        if (time_expired) {
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
        }
    },

    async onLoadData(code) {
        try {
            const data = await api.hei.bargainDetail({ code });
            data.mission.needBargainPrice = (Number(data.mission.current_price) - Number(data.mission.target_price)).toFixed(2);
            console.log('data60', data);
            this.setData({ ...data, isLoading: false }, () => {
                this.countDown();
                // 砍价倒计时
                if (data.product.status === 'publish') {
                    this.intervalId = setInterval(() => {
                        this.countDown();
                    }, 1000);
                }
            });
            console.log('mission58', this.data.mission);
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

    // 获取用户信息 并 助力砍价
    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        console.log('user88', user);
        const { code } = e.currentTarget.dataset;
        console.log('code64', code);
        try {
            const data = api.hei.bargainHelp({ code });
            console.log('data67', data);
            await proxy.showToast({
                title: '砍价成功'
            });
            if (user) {
                this.setData({ user });
            }
            this.setData({ isHelp: true });
            this.onLoadData(code);
        } catch (err) {
            await proxy.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    // 立即购买
    async onBuy() {
        const { product, mission } = this.data;
        if (product.status === 'unpublished' || product.status === 'sold_out') {
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '活动太火爆了，商品已抢光',
                confirmText: '去看看其他活动商品',
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
    }

    // 助力砍价
    // async bargainHelp(e) {
    //     const { code } = e.currentTarget.dataset;
    //     console.log('code64', code);
    //     try {
    //         const data = api.hei.bargainHelp({ code });
    //         console.log('data67', data);
    //         await proxy.showToast({
    //             title: '砍价成功'
    //         });
    //         this.onLoadData(code);
    //     } catch (err) {
    //         await proxy.showModal({
    //             title: '温馨提示',
    //             content: err.errMsg,
    //             showCancel: false,
    //         });
    //     }
    // },
});
