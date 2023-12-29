const app = getApp();
Page({

    /**
   * 页面的初始数据
   */
    data: {
        isLoading: true
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad(params) {
        // const { image_url, phone } = params;
        const image_url = wx.getStorageSync('help');
        const { themeColor } = app.globalData;
        this.setData({
            image_url,
            themeColor
        });
        console.log(this.data);
    },

    /* 图片加载完毕回调 */
    isLoaded(e) {
        this.setData({
            isLoading: false
        });
    },

    call() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        });
    }

});