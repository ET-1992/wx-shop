import api from 'utils/api';
import { CONFIG } from 'constants/index';
const app = getApp();

Page({
    data: {
        isLoading: true,
        maxlength: 50,  // 输入框最大字数
        pageShareStatus: false,
        defaultWord: '就差一点点了，快来助我一臂之力吧'
    },

    async onLoad(options) {
        const config = wx.getStorageSync(CONFIG);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        wx.setNavigationBarTitle({
            title: '请朋友代付'
        });
        this.setData({
            themeColor,
            isIphoneX,
            config,
            order_no: options.id,
            globalData: app.globalData
        });
        await this.loadOrder(options.id);
    },
    async loadOrder(id) {
        const { order } = await api.hei.fetchOrder({ order_no: id });

        // -----------------处理价格显示
        let info = {};
        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);
        // -----------------End

        let { crowd_pay_no } = order.crowd;
        this.setData({
            order,
            items: order.items,
            finalPayDispaly: info.finalPayDispaly,
            isLoading: false,
            crowd: order.crowd,
            routeQuery: { crowd_pay_no }
        });
    },
    bindTextAreaBlur(e) {
        let content = e.detail.value;
        let len = parseInt(content.length, 0);
        this.setData({
            content,
            len
        });
    },

    async onShow() {
        const { pageShareStatus, order_no, content, defaultWord } = this.data;
        if (pageShareStatus) {
            await api.hei.crowdCreate({
                order_no,
                word: content ? content : defaultWord,
            });
            this.setData({ pageShareStatus: false });
        }
    },

    // 分享弹窗
    showShareModal() {
        let { shareModal } = this.data;
        shareModal ? shareModal = false : shareModal = true;
        this.setData({ shareModal });
    },

    async onShowProductDetailShareModal() {
        this.setData({
            isShowProductDetailShareModal: true,
            shareModal: false
        });
        const { order_no, content, defaultWord } = this.data;
        await api.hei.crowdCreate({
            order_no,
            word: content ? content : defaultWord,
        });
    },
    onCloseProductDetailShareModal() {
        this.setData({
            isShowProductDetailShareModal: false
        });
    },

    onShareAppMessage() {
        let { content, defaultWord, crowd } = this.data;
        let shareMsg = {
            title: content ? content : defaultWord,
            path: `/pages/crowd/crowdProgress/crowdProgress?crowd_pay_no=${crowd.crowd_pay_no}`,
            imageUrl: crowd.image || ''
        };
        this.setData({ pageShareStatus: true });
        return shareMsg;
    },
});
