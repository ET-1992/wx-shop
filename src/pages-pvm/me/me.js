// pages/shopDetail/index.js

import api from 'utils/api';
import { autoTransformAddress } from 'utils/util';
import wxProxy from 'utils/wxProxy';
import { USER_KEY, CONFIG } from 'constants/index';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    couponNum: 0,
    medalNum: 0,
    is_check: false,
    neighborhoodNum: 0,
  },

  // async initPage() { },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const userInfo = wx.getStorageSync(USER_KEY);
    // console.log(userInfo, 'user');
    // this.setData({
    //   user: userInfo
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  chooseAddress() {
    wx.chooseAddress({
      // success(res) {
      // }
    });
  },

  async goSign() {
    const { is_check } = this.data;
    if (!is_check) {
      try {
        const response = await api.hei.pvmSign({});
      } catch (e) {
        console.log('eee', e);
      }
    }
    wx.navigateTo({
      url: '/pages-pvm/signDetail/signDetail',
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    });
    // wx.navigateTo({
    //   url: '/pages-pvm/signDetail/signDetail',
    //   success: (result) => {

    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });
  },
  goPersonal() {
    wx.navigateTo({
      url: '/pages-pvm/personalInformation/personalInformation',
      success: (result) => {
      },
      fail: () => {},
      complete: () => {}
    });
  },
  async getCurrent() {
    try {
      const response = await api.hei.current();
      if (!response.errcode) {
        let couponNum = response.coupon.counter.available;
        let medalNum = response.medal.counter.total;
        let user = response.current_user;
        let is_check = response.checkin.is_check;
        let neighborhoodNum = 0;
        if (response.affiliate.member) {
          neighborhoodNum = response.affiliate.member.customer_count;
        }
        this.setData({
          couponNum,
          medalNum,
          user,
          is_check,
          neighborhoodNum
        });
      }

    } catch (e) {

    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCurrent();
  },

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
