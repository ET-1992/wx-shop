import { parseScene } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';

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
        } else {
            this.setData({ src });
        }
    },

    onShareAppMessage: onDefaultShareAppMessage
});
