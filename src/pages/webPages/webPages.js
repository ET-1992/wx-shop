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
            if (query.crowd_pay_no) {
                wx.redirectTo({
                    url: `/pages/crowd/crowdProgress/crowdProgress?id=${query.id}&crowd_pay_no=${query.crowd_pay_no}`
                });
            }
        } else {
            this.setData({ src });
        }
    },
});
