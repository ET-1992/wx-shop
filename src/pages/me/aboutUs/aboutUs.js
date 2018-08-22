const app = getApp();
Page({

    /**
   * 页面的初始数据
   */
    data: {
        showBtn: false,
        isLoading: true
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad(params) {
        const { image_url, phone } = params;
        const { themeColor } = app.globalData;
        this.setData({
            image_url,
            phone,
            themeColor
        });
        console.log(this.data);
    },

    /* 图片加载完毕回调 */
    isLoaded(e) {
        console.log(e.detail);
        this.setData({
            showBtn: true,
            isLoading: false
        });
    },

    call() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        });
    }

});