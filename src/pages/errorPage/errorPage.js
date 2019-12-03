
import { autoNavigate } from 'utils/util';
import { CONFIG } from 'constants/index';

Page({
    data: {
        title: '500',
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG);
        this.setData({ config });
    },

    navigateToHome() {
        autoNavigate('/pages/home/home');
    },
});
