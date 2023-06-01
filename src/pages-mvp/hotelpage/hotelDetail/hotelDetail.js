// pages/shopDetail/index.js

// import api from "utils/api";
// import { autoTransformAddress, formatTime, valueToText } from "utils/util";
// import { ORDER_STATUS_TEXT } from "constants/index";
// import wxProxy from "utils/wxProxy";

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
    calendarDate: ["6月6日", "6月7日"],
    num_of_days: 1,
    weekTime: ["周六", "周日"],
    showTitle: false,
    hotel: [
      { id: 1, name: "大床房", price: 333, desc: "16m 有床 大床 1.8m" },
      { id: 2, name: "双人床房", price: 333, desc: "16m 有床 大床 1.8m" },
      { id: 3, name: "大床大通铺房", price: 333, desc: "16m 有床 大床 1.8m" },
    ],
    showHotelMsg: null,
    equipmentService: [
      {
        title: "基础设施",
        msgArr: [
          "大厅上网",
          "复印机",
          "777",
          "大厅上网",
          "复印机",
          "777",
          "大厅上网",
          "复印机",
          "777",
        ],
      },
      { title: "基础设施", msgArr: ["大厅上网", "复印机", "777"] },
      { title: "基础设施", msgArr: ["大厅上网", "复印机", "777"] },
    ],
    rateData: 2.5,
    hotelData: [1, 2, 3],
    hotelComment: [
      { comment: "很好", time: "2023年6月1日", identity: "铂金会员" },
      { comment: "很好11", time: "2023年6月1日", identity: "星会员" },
      { comment: "很好666", time: "2023年6月1日", identity: "铂金会员" },
    ],
  },
  async initPage() {
    console.log();
  },

  onPageScroll: function (e) {
    if (e.scrollTop >= this.data.navButtonHeight + 5 + this.data.navTop) {
      this.setData({ showTitle: true });
    } else {
      this.setData({ showTitle: false });
    }
  },

  // 点击展开订房按钮
  onclick(e) {
    console.log(e, 666);
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
  onConfirm(event) {
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
    const time1 = "周" + "日一二三四五六".charAt(new Date(start).getDay());
    const time2 = "周" + "日一二三四五六".charAt(new Date(end).getDay());

    this.setData({
      showCalendar: false,
      calendarDate: [formatDate(start), formatDate(end)],
      num_of_days: diffDays,
      weekTime: [time1, time2],
    });
  },

  handleRate(event) {
    this.setData({
      rateData: event.detail,
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
    console.log(this.data, 666);
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
