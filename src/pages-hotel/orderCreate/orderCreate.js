// pages/shopDetail/index.js

import api from 'utils/api';
import wxProxy from 'utils/wxProxy';
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
    showOrder: false,
    roomColumns: ['1间', '2间'],
    roomValue: { value: '1间', index: 0 },
    showTime: false,
    tips: {
      phone: '',
      username: ''
    },
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
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

  onClose() {
    this.setData({ showSwiper: false, showRoom: false, showTime: false, showOrder: false });
  },

  stop_scroll_chaining(e) {
    e.stopPropagation();
  },

  handleOrder() {
    this.setData({ showOrder: !this.data.showOrder });
  },

  add0(m) {
    return m < 10 ? '0' + m : m
  },
  timestamp(timestamp) {
      const time = new Date(timestamp);
      const year = time.getFullYear();
      const month = time.getMonth()+1;
      const date = time.getDate();
      const hours = time.getHours();
      const minutes = time.getMinutes();
    return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes);
  },

  onInput(event) {
    console.log(event.detail);
    this.setData({
      predict_receive_time: this.timestamp(event.detail),
      currentDate: event.detail,
      showTime: false
    });
  },

  async bindsubmit(event) {
    const { username, phone, remark, time } = event.detail.value;
    console.log(event.detail.value);
    this.setData({ tips: { username: username ? '' : '请输入真实姓名', phone: phone && /^1[3-9]\d{9}$/.test(phone) ? '' : '请输入正确电话号码' }});

    const { tips } = this.data;

    const { date_start, date_end, posts } = app.order;

    if (tips.username || tips.phone) {
      return;
    }

    const { order, order_no } = await api.hei.orderCreateHotel({
      posts: posts,
      'receiver': {
        'receiver_name': username,
        'receiver_phone': phone,
        predict_receive_time: time
    },
    'buyer_message': remark
    });

    const { pay_interact_data } = await api.hei.orderPay({
      order_nos: [order_no],
      pay_method: 'WEIXIN',
    });
    console.log(pay_interact_data, '--');
    const { pay_sign } = pay_interact_data;

    await wxProxy.requestPayment(pay_sign);
    wx.showToast({
      title: '支付成功',
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    try {
      console.log(app.order, '++00');

      const { posts, date_start, date_end, showDate, weekTime, num_of_days, property_names } = app.order;

      const orderData = await api.hei.orderPrepareHotel({
        posts
      });

      console.log(orderData, '---', this.timestamp(new Date()), 6666);

      this.setData({
        weekTime,
        showDate,
        num_of_days,
        property_names,
        order: orderData,
        date_start,
        date_end,
        predict_receive_time: this.timestamp(new Date())
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
