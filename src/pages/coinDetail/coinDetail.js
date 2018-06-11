Page({
    data:{
        coinList: [
            {
                title: "分享红包",
                time: "2018-05-22 12:00:23",
                increaseNum: 89
            },
            {
                title: "分享红包",
                time: "2018-05-22 12:00:23",
                increaseNum: 89
            },
            {
                title: "订单抵扣",
                time: "2018-05-22 12:00:23",
                decreaseNum: 289
            },
        ]
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '金币明细'
        });
    },
    onReady:function(){
        // 生命周期函数--监听页面初次渲染完成
        
    },
    onShow:function(){
        // 生命周期函数--监听页面显示
        
    },
    onHide:function(){
        // 生命周期函数--监听页面隐藏
        
    },
    onUnload:function(){
        // 生命周期函数--监听页面卸载
       
    },
    onPullDownRefresh: function() {
        // 页面相关事件处理函数--监听用户下拉动作
        
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
        
    },
    onShareAppMessage: function() {
        
    }
})