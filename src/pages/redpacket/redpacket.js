import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { autoNavigate } from 'utils/util';
const app = getApp();
Page({
    data: {
        redpacket: {},
        products: [],
        hasRecived: false,
        isFinished: false,
        isLoading: true
    },
    async onLoad() {
        const { isIphoneX } = app.systemInfo;
        const { themeColor } = app.globalData;
        const data = await api.hei.config();
        const { style_type: tplStyle = 'default' } = data.config;
        this.setData({
            tplStyle,
            isIphoneX,
            themeColor,
            globalData: app.globalData,
            ...data
        });
        await this.loadRepacket();
    },
    async loadRepacket() {
        const { id } = this.options;
        let goldNumer = 0;
        const { products = [], received_redpacket } = await api.hei.fetchRedpacket({ packet_no: id });
        if (received_redpacket) {
            received_redpacket.item.reduceValue = Number(received_redpacket.item.reduce_cost);
            goldNumer = parseInt(received_redpacket.item.amount * 100, 10);
        }
        this.setData({
            products,
            redpacket: received_redpacket,
            goldNumer,
            hasRecived: !!received_redpacket,
            isLoading: false
        });
        console.log(this.data);
    },

    /* 领取 */
    async onRecive() {
        const { id } = this.options;
        let goldNumer = 0;
        try {
            const res = await api.hei.receiveRedpacket({ packet_no: id });
            const { products = [], received_redpacket = {}} = res;
            if (received_redpacket) {
                received_redpacket.item.reduceValue = Number(received_redpacket.item.reduce_cost);
                goldNumer = parseInt(received_redpacket.item.amount * 100, 10);
            }
            await proxy.showToast({ icon: 'success', title: '领取成功' });
            this.setData({
                hasRecived: true,
                isFinished: false,
                products,
                redpacket: received_redpacket,
                goldNumer,
            });
        } catch (e) {
            if (e && e.errMsg) {
                await proxy.showToast({ title: e.errMsg, icon: 'none' });
                this.setData({
                    hasRecived: true,
                    isFinished: true
                });
            }
        }
    },

    /* 立即使用 */
    onUse() {
        autoNavigate('/pages/home/home');
    },

    onShareAppMessage() {
        const { current_user, config } = this.data;
        const { id } = this.options;
        return {
            title: `好友${current_user.nickname}给你发来了一个红包，快去领取吧`,
            path: `/pages/redpacket/redpacket?id=${id}`,
            imageUrl: `${config.cdn_host}/shop/redpacketShare.jpg`
        };
    },

});
