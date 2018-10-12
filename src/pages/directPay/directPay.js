const app = getApp();
Page({
    data: {
        isFocus: true,
        size: 15
    },

    onLoad(parmas) {
        console.log(parmas);
        const { themeColor } = app.globalData;
        this.setData({
            themeColor
        });
    },
    clickInput() {
        this.setData({
            isFocus: true
        });
    },
    getLen(e) {
        let len = e.detail.value.length * this.data.size;
        this.setData({
            len
        });
    }
});
