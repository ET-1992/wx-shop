const app = getApp();
Page({
    data: {

    },

    onLoad(parmas) {
        console.log(parmas);
        const { themeColor } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        this.setData({
            themeColor,
            isIphoneX
        });
    }
});
