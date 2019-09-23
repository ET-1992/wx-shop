import api from 'utils/api';
import getRemainTime from 'utils/getRemainTime';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
import { getAgainUserForInvalid, getUserInfo } from 'utils/util';
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
        if (user) {
            const { code } = e.currentTarget.dataset;
            console.log('code64', code);
            try {
                const data = api.hei.bargainHelp({ code });
                console.log('data67', data);
                await proxy.showToast({
                    title: '砍价成功'
                });
                this.setData({ user }, () => { this.onLoadData(code) });
            } catch (err) {
                await proxy.showModal({
                    title: '温馨提示',
                    content: err.errMsg,
                    showCancel: false,
                });
            }
        } else {
            this.setData({ noHelp: true });
        }
    },

    async onShowSku(ev) {
        const { status } = this.data.product;
        // 若商品售罄或下架显示
        if (status === 'unpublished' || status === 'sold_out') {
            await proxy.showModal({
                title: '温馨提示',
                content: '活动太火爆了，商品已抢光',
                confirmText: '去看看其他活动商品',
                mask: true
            });
            if (confirm) {
                wx.navigateTo({
                    url: '/pages/miaoshaList/miaoshaList?type=bargain'
                });
                return;
            }
            return;
        }
        const updateData = { isShowActionSheet: true };
        if (ev) {
            const { actions } = ev.currentTarget.dataset;
            console.log('actions104', actions);
            updateData.actions = actions;
        }
        this.setData(updateData, () => {
            this.setData({
                isShowActionSheeted: true
            });
        });
    },

    async onSkuConfirm(e) {
        console.log(e);
        const { actionType, selectedSku, quantity, formId } = e.detail;
        this.setData({
            selectedSku,
            quantity,
            formId
        });
        this[actionType]();
        this.onSkuCancel();
    },

    onSkuCancel() {
        this.setData({
            isShowActionSheet: false,
            pendingGrouponId: ''
        });
    },

    // 从 SKUModel 组件获取配送方式 shipping_type
    getShippingType(e) {
        console.log('e161', e);
        this.setData({
            shipping_type: e.detail.shipping_type
        });
        console.log('shipping_type696', this.data.shipping_type);
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
