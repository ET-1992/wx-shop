import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

const app = getApp();

Page({

    data: {
        isLoading: true
    },

    async onLoad({ key }) {
        const { image_url, title = '规则页' }  = await api.hei.getShopRule({ key });
        wx.setNavigationBarTitle({
            title,
        });
        this.setData({
            image_url,
            title,
            isLoading: false
        });
    },

    onShareAppMessage: onDefaultShareAppMessage,
});