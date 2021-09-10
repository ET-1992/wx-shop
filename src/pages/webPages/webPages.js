import { parseScene } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
import api from 'utils/api';

const app = getApp();
Page({
    data: {

    },

    async onLoad(parmas) {
        let { src, scene, isExpired = false } = parmas;
        if (scene) {
            let { params: senceValue } = await api.hei.getSenceValue({ code: scene });
            senceValue = decodeURIComponent(senceValue);
            let query = parseScene(senceValue);

            // 分享商品海报
            if (query.id) {
                wx.redirectTo({
                    url: query.share_code && query.activity_id
                        ? `/pages/productDetail/productDetail?id=${query.id}share_code=${query.share_code}activity_id=${query.activity_id}`
                        : `/pages/productDetail/productDetail?id=${query.id}`
                });
            }
            // 扫描文章海报
            if (query.aid) {
                wx.redirectTo({
                    url: `/pages/articleDetail/articleDetail?id=${query.aid}`
                });
            }
            // 邀请砍价海报
            if (query.bid) {
                wx.redirectTo({
                    url: `/pages/bargainDetail/bargainDetail?code=${query.bid}&isOthers=true`
                });
            }
            // 邀请拼团海报
            if (query.gid) {
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?grouponId=${query.gid}`
                });
            }
            // 代付海报
            if (query.c) {
                wx.redirectTo({
                    url: `/pages/crowd/crowdProgress/crowdProgress?crowd_pay_no=${query.c}`
                });
            }
            if (query.o) {
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${query.o}`
                });
            }
            if (query.signup) {
                try {
                    const { code } = await api.hei.getWeappQrcode({
                        scene: query.signup
                    });
                    const { confirm } = await proxy.showModal({
                        title: '温馨提示',
                        content: `您的验证码是：${code}`,
                        showCancel: false
                    });
                    if (confirm) {
                        wx.switchTab({
                            url: '/pages/home/home'
                        });
                    }
                } catch (e) {
                    wx.showModal({
                        title: '温馨提示',
                        content: e.errMsg,
                        showCancel: false
                    });
                }
            }
        } else if (isExpired) {
            // 米白过期店铺
            this.setData({ isExpired: true });
        } else {
            this.setData({ src });
        }
    },

    onShareAppMessage: onDefaultShareAppMessage
});
