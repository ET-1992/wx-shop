import api from 'utils/api';
import { CONFIG } from 'constants/index';
const app = getApp();

Page({
    data: {
        isLoading: true,
        maxlength: 50,  // 输入框最大字数
        pageShareStatus: false,
        defaultWord: '就差一点点了，快来助我一臂之力吧',
        showPosterModal: false,
        isShowShareModal: false
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
        const { current_user, order } = await api.hei.fetchOrder({ order_no: id });

        // -----------------处理价格显示
        let info = {};
        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);
        // -----------------End

        this.setData({
            order,
            items: order.items,
            finalPayDispaly: info.finalPayDispaly,
            isLoading: false,
            crowd: order.crowd,
            current_user
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
    async showShareModal() {
        let { isShowShareModal, order_no, content, defaultWord } = this.data;
        await api.hei.crowdCreate({
            order_no,
            word: content ? content : defaultWord,
        });
        this.setData({
            isShowShareModal: !isShowShareModal
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

    async onShowPoster() {
        const {
            order: {
                amount
            },
            items: [
                {
                    thumbnail,
                    image_url,
                    title,
                    original_price,
                    price
                }
            ],
            crowd: {
                crowd_pay_no
            }
        } = this.data;
        let posterData = {
            banner: image_url || thumbnail,
            title,
            crowd_pay_no,
            price: amount,
            original_price
        };

        const { order_no, content, defaultWord } = this.data;
        await api.hei.crowdCreate({
            order_no,
            word: content ? content : defaultWord,
        });

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
    }
});
