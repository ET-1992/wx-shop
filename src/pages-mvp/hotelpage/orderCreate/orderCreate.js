// pages/shopDetail/index.js

import api from 'utils/api';
// import { autoTransformAddress, formatTime, valueToText } from "utils/util";
// import { ORDER_STATUS_TEXT } from "constants/index";
// import wxProxy from "utils/wxProxy";

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showSwiper: false,
    showRoom: false,
    roomColumns: ['1间', '2间'],
    roomValue: { value: '1间', index: 0 },
    showTime: false,
    timeColumns: ['12:00前', '13:00前', '14:00前', '15:00前'],
    timeValue: { value: '12:00前', index: 0 },
    tips: {
      phone: '',
      username: ''
    }
  },

  handlePopup() {
    this.setData({ showSwiper: !this.data.showSwiper });
  },

  handleRoom() {
    this.setData({ showRoom: !this.data.showRoom });
  },
  onSelectRoom(event) {
    const { value, index } = event.detail;
    console.log(value, index);
    this.setData({ roomValue: { value, index }, showRoom: false });

  },
  handleTime() {
    this.setData({ showTime: !this.data.showTime });
  },
  onSelectTime(event) {
    const { value, index } = event.detail;
    console.log(value, index);
    this.setData({ timeValue: { value, index }, showTime: false });
  },

  onClose() {
    this.setData({ showSwiper: false, showRoom: false, showTime: false });
  },

  stop_scroll_chaining(e) {
    e.stopPropagation();
  },

  bindsubmit(event) {
    const { username, phone } = event.detail.value;
    console.log(event.detail.value);
    this.setData({ tips: { username: username ? '' : '请输入真实姓名', phone: phone && /^1[3-9]\d{9}$/.test(phone) ? '' : '请输入正确电话号码' }});

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    try {
      console.log(app.order, '++00');

      const { posts, date_start, date_end, showDate, weekTime} = app.order;

      const orderData = await api.hei.orderPrepareHotel({
        posts
      });

    console.log(orderData, '---');

      this.setData({
        weekTime,
        showDate,
        order: orderData,
        date_start,
        date_end
      });

    } catch (e) {
      wx.showModal({
        title: '购买异常',
        content: e.errMsg,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            wx.navigateBack({
              delta: 1
            });

          }
        },
        fail: () => {},
        complete: () => {}
      });

    }
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
  onUnload: function () {
    app.order = {};
  },

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
