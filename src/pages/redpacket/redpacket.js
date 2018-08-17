import { PRODUCT_LIST_STYLE, USER_KEY } from 'constants/index';
import api from 'utils/api';
import { showToast } from 'utils/wxp';
const app = getApp();
Page({
    data: {
        title: 'redpacket',
        productListStyle: PRODUCT_LIST_STYLE[1],
        redpacket: {},
        products: [],
        hasRecived: false,
        isFinished: false
    },

    async loadRepacket() {
        const { isIphone5 } = app.systemInfo;
        const { id } = this.options;
        let goldNumer = 0;
        const { products = [], received_redpacket, shared_redpacket } = await api.hei.fetchRedpacket({ packet_no: id });
        // const { stock_qty } = shared_redpacket;
        if (received_redpacket) {
            received_redpacket.item.reduceValue = Number(received_redpacket.item.reduce_cost);
            goldNumer = parseInt(received_redpacket.item.amount * 100, 10);
        }
        const { themeColor, tplStyle } = app.globalData;
        this.setData({
            products,
            redpacket: received_redpacket,
            isIphone5,
            goldNumer: goldNumer,
            hasRecived: !!received_redpacket,
            themeColor,
            tplStyle
        });
        console.log(this.data);
    },

    async onRecive() {
        // wx.showLoading();
        const { id } = this.options;
        let goldNumer = 0;
        try {
            const res = await api.hei.receiveRedpacket({ packet_no: id });
            const { products = [], received_redpacket = {}} = res;
            if (received_redpacket) {
                received_redpacket.item.reduceValue = Number(received_redpacket.item.reduce_cost);
                goldNumer = parseInt(received_redpacket.item.amount * 100, 10);
            }
            await showToast({ icon: 'success', title: '领取成功' });
            this.setData({
                hasRecived: true,
                isFinished: false,
                products,
                redpacket: received_redpacket,
                goldNumer: goldNumer
            });

        } catch (e) {
            if (e && e.errMsg) {
                await showToast({ title: e.errMsg, icon: 'none' });
                this.setData({
                    hasRecived: true,
                    isFinished: true
                });
            }
        }
    },

    async onShow() {
        await this.loadRepacket();
    },

    onUse() {
        wx.switchTab({ url: '/pages/home/home' });
    },

    // async reLoad() {
    // 	await this.loadRepacket();
    // },

    onShareAppMessage({ target }) {
        const { user = {}} = this.data.redpacket;
        const currentUser = wx.getStorageSync(USER_KEY);
        const { id } = this.options;
        const name = target === 'button' ? currentUser.nickname : user.nickname;

        return {
            title: `好友${name}给你发来了一个红包，快去领取吧`,
            path: `/pages/redpacket/redpacket?id=${id}`,
            imageUrl: '/icons/redpacketShare.jpg'
        };
    },

});
