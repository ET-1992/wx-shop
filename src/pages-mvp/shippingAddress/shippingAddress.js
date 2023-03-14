Page({
    /**
     * 页面的初始数据
     */
    data: {
    shippingAdress: [{
        id: '1',
        username: '水獭先生',
        phoneNumber: '15555555555',
        adress: '广西壮族自治区桂林市萨地区七星区斜阳大道',
        defaultCheck: true
      },
        {
        id: '2',
        username: '水獭先生',
        phoneNumber: '15555555555',
        adress: '广西壮族自治区桂林市萨地区七星区斜阳大道',
        defaultCheck: false
      }],
      checked: '1',
    },
    onChange(event) {
      console.log(event.detail, [this.data.shippingAdress]);
      const data = this.data.shippingAdress.map((item, index) => {
        if ((index + 1) === Number(event.detail)) {
          item.defaultCheck = true;
        } else {
          item.defaultCheck = false;
        }
        return item;
      });
      console.log(data);
      this.setData({
        checked: event.detail,
        shippingAdress: [...data]
      });
    },

    async initPage() {
      // console.log('000');
      // const { id } = this.options;
      // console.log(id, 'ii1');
      // const data = await api.hei.fetchProduct({ id });
      // console.log(data, 'data');
      // const { config, share_title, share_image } = data;
      // this.config = config;
      // wx.setNavigationBarTitle({
      //   title: data.page_title,
      // });
      // this.setData({ product, isShowSkuModal: true });
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log('===');
      console.log('091');
      this.initPage();
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
  });