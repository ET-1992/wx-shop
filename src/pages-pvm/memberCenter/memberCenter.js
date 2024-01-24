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
    showRecharge: false,
    membership: {
      expire_day: 0,
    },
    memberData: {},
    amountData: {},
    current_user: {},
    rechargeAmount: 0,
  },
  goRecharge() {
    this.setData({
      showRecharge: true,
    });
  },
  async recharge() {
    let { rechargeAmount } = this.data;
    let params = {
      amount: rechargeAmount,
      wallet_type: 'cash',
    };
    try {
      let { errcode } = await api.hei.recharge(params);
      if (errcode === 0) {
        
      }
    } catch (e) {

    }

  },

  getCash() {},

  goDetail() {
    wx.navigateTo({
      url: `/pages-pvm/pointsDetails/pointsDetails`,
    });
  },

  async getCurrent() {
    try {
      wx.showLoading({
        title: '加载中',
      });
      const response = await api.hei.current();
      if (!response.errcode) {
        let membership = response.membership;
        let current_user = response.current_user;
        this.setData({
          membership,
          current_user,
        });
        wx.hideLoading();
      }
    } catch (e) {}
  },
  async getMemberList() {
    try {
      let { errcode, errmsg, member, stats } = await api.hei.memberList();
      console.log('errcode', errcode);
      if (errcode === 0) {
        let memberData = member;
        let amountData = stats;
        this.setData({
          memberData,
          amountData,
        });
      }
    } catch (e) {
      console.log('e', e);
      wx.showModal({
        title: '温馨提示',
        content: e.errMsg,
        showCancel: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrent();
    this.getMemberList();
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
