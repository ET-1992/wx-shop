import { USER_KEY, CONFIG } from 'constants/index';
import api from 'utils/api';
import { showToast } from 'utils/wxp';
import { autoNavigate } from 'utils/util';
const app = getApp();
Page({
    data: {
        title: 'redpacket',
        redpacket: {},
        products: [],
        hasRecived: false,
        isFinished: false
    },

    async loadRepacket() {
        const { isIphoneX } = app.systemInfo;
        const { id } = this.options;
        let goldNumer = 0;
        const { products = [], received_redpacket, shared_redpacket } = await api.hei.fetchRedpacket({ packet_no: id });
        // const { stock_qty } = shared_redpacket;
        if (received_redpacket) {
            received_redpacket.item.reduceValue = Number(received_redpacket.item.reduce_cost);
            goldNumer = parseInt(received_redpacket.item.amount * 100, 10);
        }
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;

        this.setData({
            products,
            redpacket: received_redpacket,
            goldNumer: goldNumer,
            hasRecived: !!received_redpacket,
            themeColor,
            tplStyle,
            isIphoneX,
            config,
            globalData: app.globalData
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
        autoNavigate('/pages/home/home');
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
            imageUrl: `${this.data.config.cdn_host}/shop/redpacketShare.jpg`
        };
    },

});
