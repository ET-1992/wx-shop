import { parseScene } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
import api from 'utils/api';

const app = getApp();
Page({
    data: {

    },

    async onLoad(parmas) {
        let { src, scene } = parmas;
        if (scene) {
            scene = decodeURIComponent(scene);
            let query = parseScene(scene);
            console.log(query, 'query');
            if (query.id) {
                wx.redirectTo({
                    url: '/pages/productDetail/productDetail?id=' + query.id
                });
            }
            if (query.gid) {
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?grouponId=${query.gid}`
                });
            }
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
        } else {
            this.setData({ src });
        }
    },

    onShareAppMessage: onDefaultShareAppMessage
});
