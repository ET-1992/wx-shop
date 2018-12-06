import { parseScene } from 'utils/util';

const app = getApp();
Page({
    data: {

    },

    async onLoad(parmas) {
        let { src, scene } = parmas;
        if (scene) {
            scene = decodeURIComponent(scene);
            let query = parseScene(scene);
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
        } else {
            this.setData({ src });
        }
    },
});
