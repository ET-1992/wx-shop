// pages/shopDetail/index.js

// import api from "utils/api";
// import { autoTransformAddress, formatTime, valueToText } from "utils/util";
// import { ORDER_STATUS_TEXT } from "constants/index";
// import wxProxy from "utils/wxProxy";
import api from 'utils/api';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navHeight: 0, // 导航栏高度
    navTop: 0, // 胶囊距顶部的高度
    navButtonHeight: 0, // 胶囊的高度
    navWidth: 0,
    showCalendar: false,
    title: ' ', // 酒店名称
    hotel_address: '', // 酒店地址
    hotel_phone: '', // 酒店电话
    facility: [], // 酒店设施
    skus: [], // 房间类型
    calendarDate: [],
    num_of_days: 1,
    weekTime: [],
    showTitle: false,
    showHotelMsg: null,
    rateData: 2.5,
    hotelData: [1, 2, 3],
    hiddenComments: false,
  },

  onPageScroll: function (e) {
    if (e.scrollTop >= this.data.navButtonHeight + 5 + this.data.navTop) {
      this.setData({ showTitle: true });
    } else {
      this.setData({ showTitle: false });
    }
  },

  // 弹出日期选择
  handleCalendar() {
    this.setData({ showCalendar: !this.data.showCalendar });
  },
  // 关闭
  onClose() {
    this.setData({ showCalendar: false });
  },

  // 时间确定
  async onConfirm(event) {
    const [start, end] = event.detail;
    function formatDate(date) {
      const calendarDate = new Date(date);
      return `${calendarDate.getMonth() + 1}月${calendarDate.getDate()}日`;
    }
    // 计算相差天数
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // 计算今天是周几
    const time1 = '周' + '日一二三四五六'.charAt(new Date(start).getDay());
    const time2 = '周' + '日一二三四五六'.charAt(new Date(end).getDay());

    const hotel_range_start_date =
      start.getFullYear() +
      '-' +
      (start.getMonth() + 1) +
      '-' +
      start.getDate();
    const hotel_range_end_date =
      end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
    console.log(hotel_range_end_date, hotel_range_start_date);
    const { hotel } = await api.hei.getHotelList({
      id: 3,
      hotel_range_start_date,
      hotel_range_end_date,
    });
    this.setData({
      showCalendar: false,
      calendarDate: [formatDate(start), formatDate(end)],
      num_of_days: diffDays,
      weekTime: [time1, time2],
      ...hotel,
    });
  },

  // 评分
  handleRate(event) {
    this.setData({
      rateData: event.detail,
    });
  },

  openMap() {
    let { latitude, longtitude, hotel_address } = this.data;
    latitude = Number(latitude);
    longtitude = Number(longtitude);

    wx.openLocation({
      latitude,
      longitude: longtitude,
      name: `${hotel_address}`,
      scale: 18,
    });
  },

  handleCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.hotel_phone,
      success: function () {
        console.log('sucs');
      },
      fail: function () {
        console.log(111);
      },
    });
  },

  handleHidden() {
    const hiddenComments = !this.data.hiddenComments;
    this.setData({ hiddenComments });
  },

  async initPage() {
    // 今日
    const date = new Date();
    const start_date = date.getMonth() + 1 + '月' + date.getDate() + '日';
    // 明天
    const date1 = new Date();
    date1.setTime(date1.getTime() + 24 * 60 * 60 * 1000);
    const end_date = date1.getMonth() + 1 + '月' + date1.getDate() + '日';
    console.log(start_date, end_date);
    // 计算今天是周几
    const time1 = '周' + '日一二三四五六'.charAt(new Date(date).getDay());
    const time2 = '周' + '日一二三四五六'.charAt(new Date(date1).getDay());
    console.log(time1, time2, 8888);

    // 计算相差天数
    const now = new Date(date);
    const date2 = new Date(date1);
    const diffTime = Math.abs(date2 - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 详情数据
    const { hotel } = await api.hei.getHotelList({
      id: 3,
      hotel_range_start_date:
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      hotel_range_end_date:
        date1.getFullYear() +
        '-' +
        (date1.getMonth() + 1) +
        '-' +
        date1.getDate(),
    });
    this.setData({
      ...hotel,
      calendarDate: [start_date, end_date],
      weekTime: [time1, time2],
      num_of_days: diffDays,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { height, top, width } = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        // //手机状态栏高度
        const statusBarHeight = res.statusBarHeight; // 导航高度
        const navHeight =
          statusBarHeight + height + (top - statusBarHeight) * 2;
        const navTop = top;
        const navButtonHeight = height;
        this.setData({ navHeight, navTop, navButtonHeight, navWidth: width });
      },
      fail(err) {
        console.log(err);
      },
    });
    this.initPage();
    console.log(this.data, 666);
  },

  onClickSku(e) {
    console.log(e, '---');
    const { item } = e.currentTarget.dataset;
    const { id, calendarDate, weekTime } = this.data;
    app.order = {
      showDate: calendarDate,
      weekTime,
      posts: [{
        post_id: id,
        quantity: 1,
        sku_id: item.id,
        date_start: item.hotel_range_data[0].date,
        date_end: item.hotel_range_data[1].date
      }],
        date_start: item.hotel_range_data[0].date,
        date_end: item.hotel_range_data[1].date
    };
    console.log(app.order, '---');
    wx.navigateTo({
      url: '/pages-mvp/hotelpage/orderCreate/orderCreate',
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });

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
