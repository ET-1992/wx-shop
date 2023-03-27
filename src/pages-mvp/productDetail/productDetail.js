// pages/shopDetail/index.js

import api from 'utils/api';
import { autoTransformAddress } from 'utils/util';
import wxProxy from 'utils/wxProxy';

const app = getApp();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    actions: [
      {
        type: 'onBuy',
        text: '立即支付¥399',
      },
    ],
    isShowSkuModal: false,
    isBargainBuy: false, // 购买数量加减隐藏
    time: 30 * 60 * 60 * 1000, // 倒计时
    timeData: {},
    showOverlay: true
  },

  countdownChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  onClickHide() {
    this.setData({ showOverlay: false });
  },
  handleClick() {
      this.setData({ isShowSkuModal: true });
  },
  async initPage() {
    const { id } = this.options || {};
    if (id) {
    const { config, share_title, share_image, page_title, product }  = await api.hei.fetchProduct({ id });
    this.config = config;
    wx.setNavigationBarTitle({
      title: page_title,
    });
    this.setData({ product, page_title, config, share_image, share_title });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage(options);
  },

  async onSkuConfirm(e) {
    console.log(e, 'onSkuConfirm');
    const { queryData, actionType } = e.detail;
    const { quantity, selectedSku: { id }, address, product } = queryData;
    const orderQuery = {
      posts: [{ post_id: product.id, sku_id: id, quantity }],
      pay_method: 'WEIXIN',
      receiver: autoTransformAddress(address)
    };
    console.log(orderQuery);
    const { order_no } = await api.hei.orderCreate(orderQuery);
    const { pay_interact_data } = await api.hei.orderPay({ order_nos: [order_no], 'pay_method': 'WEIXIN' });
    console.log(pay_interact_data, '--');
    const { pay_sign } = pay_interact_data;
    await wxProxy.requestPayment(pay_sign);
    wx.showToast({
      title: '支付成功',
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
