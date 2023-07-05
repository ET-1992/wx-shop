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

    const { hotel } = await api.hei.getHotelList({
      id: 3,
      hotel_range_start_date: this.timestamp(new Date(start), 'YYYY'),
      hotel_range_end_date: this.timestamp(new Date(end), 'YYYY'),
    });
    this.setData({
      showCalendar: false,
      calendarDate: [this.timestamp(new Date(start), ''), this.timestamp(new Date(end), '')],
      ...this.weekstamp(new Date(start), new Date(end)),
      ...hotel,
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

  add0(m) {
    return m < 10 ? '0' + m : m
  },
  // 日期转化
  timestamp(timestamp, type) {
      const time = new Date(timestamp);
      const year = time.getFullYear();
      const month = time.getMonth()+1;
      const date = time.getDate();
    return type === 'YYYY' ? year + '-' + this.add0(month) + '-' + this.add0(date) : this.add0(month) + '月' + this.add0(date) + '日';
  },

  // 周几或天数
  weekstamp(start_date, end_date) {
    // 计算今天是周几
    const start_week = '周' + '日一二三四五六'.charAt(new Date(start_date).getDay());
    const end_week = '周' + '日一二三四五六'.charAt(new Date(end_date).getDay());

      // 计算相差天数
    const now = new Date(start_date);
    const date2 = new Date(end_date);
    const diffTime = Math.abs(date2 - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { weekTime: [start_week, end_week], num_of_days: diffDays }
  },

  async initPage() {
    // 今日
    const start_date = new Date();
    // 明天
    const end_date = new Date();
    end_date.setTime(end_date.getTime() + 24 * 60 * 60 * 1000);

    // 详情数据
    const { hotel } = await api.hei.getHotelList({
      id: 3,
      hotel_range_start_date: this.timestamp(start_date, 'YYYY'),
      hotel_range_end_date: this.timestamp(end_date, 'YYYY')
    });
    this.setData({
      ...hotel,
      calendarDate: [this.timestamp(start_date, ''), this.timestamp(end_date, '')],
      ...this.weekstamp(start_date, end_date)
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
    const { id, calendarDate, weekTime, num_of_days } = this.data;
    app.order = {
      showDate: calendarDate,
      weekTime,
      num_of_days,
      property_names: item.property_names,
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
      url: '/pages-hotel/orderCreate/orderCreate',
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
