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
    promotion_detail: {},
    isLoading: true,
    productsList: {
      setting: {
          style: 'per_2',
          margin: 0,
          title_display: false,
          more: false
      },
      title: '',
      id: 0,
      type: 'product'
  },
  },

  async initPage() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
   const { ...others } = options;
   try {
        wx.showLoading({
          title: '加载中',
          mask: true
        });
      const { promotion_detail } = await api.hei.getPromotionList(others);
      console.log(promotion_detail);
      this.setData({
        promotion_detail,
        isLoading: false,
        'productsList.content': promotion_detail.page_products
      });
        wx.hideLoading();
   } catch (e) {
    wx.hideLoading();
   }

  },

  goBack() {
    wx.navigateBack({
      delta: 1
    });

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
