import { autoNavigate } from 'utils/util';
const app = getApp();
Page({
    data: {

    },

    onLoad(parmas) {
        console.log(parmas);
        const { order_no } = parmas;
        const { themeColor } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        this.setData({
            themeColor,
            isIphoneX,
            order_no
        });
    },

    navigateToHome() {
        autoNavigate('/pages/home/home');
    }
});
