// pages/shopDetail/index.js

// import api from "utils/api";
// import { autoTransformAddress, formatTime, valueToText } from "utils/util";
// import { ORDER_STATUS_TEXT } from "constants/index";
// import wxProxy from "utils/wxProxy";
import { createCurrentOrder, onDefaultShareAppMessage, onDefaultShareAppTimeline } from 'utils/pageShare';
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
    showPopup: false,
    hotelIndex: []
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
    this.setData({ showCalendar: false, showPopup: false });
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
      date_start: this.timestamp(new Date(start), 'YYYY'),
      date_end: this.timestamp(new Date(end), 'YYYY'),
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
    return m < 10 ? '0' + m : m;
  },
  // 日期转化
  timestamp(timestamp, type) {
      const time = new Date(timestamp);
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
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
    return { weekTime: [start_week, end_week], num_of_days: diffDays };
  },

  async initPage() {
    const { id } = this.options;
    // 今日
    const start_date = new Date();
    // 明天
    const end_date = new Date();
    end_date.setTime(end_date.getTime() + 24 * 60 * 60 * 1000);

    // 详情数据
    const { hotel, page_title, share_title, share_image } = await api.hei.getHotelList({
      id,
      hotel_range_start_date: this.timestamp(start_date, 'YYYY'),
      hotel_range_end_date: this.timestamp(end_date, 'YYYY')
    });
    wx.setNavigationBarTitle({
      title: page_title
  });
    this.setData({
      ...hotel,
      share_title,
      share_image,
      date_start: this.timestamp(start_date, 'YYYY'),
      date_end: this.timestamp(end_date, 'YYYY'),
      calendarDate: [this.timestamp(start_date, ''), this.timestamp(end_date, '')],
      ...this.weekstamp(start_date, end_date)
    });
  },

  onClickPopup(e) {
    const { item } = e.currentTarget.dataset;
    console.log(item, 'item');
    this.setData({ showPopup: !this.data.showPopup, popupData: item });
  },

  stop_scroll_chaining(e) {
    e.stopPropagation();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: (result) => {

      },
      fail: () => {},
      complete: () => {}
    });

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
    wx.hideLoading();
  },

  onClickSku(e) {
    console.log(e, '-+-');
    const { item, releated = {}} = e.currentTarget.dataset;
    const { id, calendarDate, weekTime, num_of_days, date_start, date_end } = this.data;
    app.order = {
      showDate: calendarDate,
      weekTime,
      num_of_days,
      property_names: item.property_names,
      posts: [{
        post_id: id,
        quantity: 1,
        sku_id: item.id,
        date_start,
        date_end,
        policy_key: releated.key,
      }],
        date_start,
        date_end,
        releated
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

  onClickDing(e) {
    const { item } = e.currentTarget.dataset;
    // console.log(item);
    let arr = this.data.hotelIndex || [];
    if (arr.includes(item.id)) {
      const index = arr.findIndex((val) => val === item.id)
      arr.splice(index, 1)
    } else {
      arr.push(item.id)
    }
    console.log(arr, '0000');
    this.setData({ hotelIndex:  arr})
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
  onShareAppMessage: onDefaultShareAppMessage
});
