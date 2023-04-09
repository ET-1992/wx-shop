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
    user: {}
  },

  async initPage() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   const userInfo = wx.getStorageSync(USER_KEY);
   console.log(userInfo, 'user');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},


  chooseAddress() {
    wx.chooseAddress({
      success(res) {
      }
    });
  },

  goPersonal() {
    // wx.navigateTo({
    //   url: '/pages-mvp/personalInformation/personalInformation',
    //   success: (result) => {

    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });

  },

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
