import api from 'utils/api';
import { showToast, showModal } from 'utils/wxp';

Page({
    data: {
        title: 'shareApply',
        image_url: '',
        is_affiliate_member: false,
        affiliate_enable: false
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    async onShow() {
        const data = await api.hei.getWelcomeShare();
        console.log(data);
        this.setData({
            ...data
        }, this.redirectToHome);
    },

    async joinShareUser() {
        try {
            const data = await api.hei.joinShareUser();
            await showToast({ title: '申请成功', icon: 'success' });
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/share/shareCenter/shareCenter'
                });
            }, 1000);
        } catch (e) {
            await showToast({
                title: '申请失败',
                icon: 'none'
            });
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/share/shareCenter/shareCenter'
                });
            }, 1000);
        }
    },

    async redirectToHome() {
        const { affiliate_enable, is_affiliate_member } = this.data;
        if (!affiliate_enable) {
            const { confirm }  = await showModal({
                title: '温馨提示',
                content: '商家暂时关闭了分销功能',
                showCancel: false
            });
            if (confirm) {
                wx.redirectTo({ url: '/pages/home/home' });
            }
        } else if (is_affiliate_member) {
            const { confirm }  = await showModal({
                title: '温馨提示',
                content: '您已经是分销员,请前往分销中心',
                showCancel: false
            });
            if (confirm) {
                wx.redirectTo({ url: '/pages/share/shareCenter/shareCenter' });
            }
        }
    }
});
