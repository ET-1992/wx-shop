// pages/shopDetail/index.js

import api from 'utils/api';
import { autoTransformAddress, formatTime, valueToText } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: 30 * 60 * 60 * 1000, // 倒计时
    timeData: {},
  },

  countdownChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  async initPage() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { id } = this.options;
    const { order, ...others } = await api.hei.fetchOrder({ order_no: id });
        order.statusCode = Number(order.status);
        order.statusText = valueToText(ORDER_STATUS_TEXT, Number(order.status));
        order.buyer_message = order.buyer_message || '——';
        order.createDate = formatTime(new Date(order.time * 1000));
        order.payDate = order.paytime && formatTime(new Date(order.paytime * 1000));
        order.consignDate = formatTime(new Date(order.consign_time * 1000));
        order.refundDate = formatTime(new Date(order.refund_time * 1000));
        order.total_fee = (order.total_fee - 0).toFixed(2);
        order.discount_fee = (order.discount_fee - 0).toFixed(2);

        if (order.statusCode === 4000 || order.statusCode === 6000 || order.statusCode === 7000 || order.statusCode === 8000) {
            order.isDone = true;
        }

        wx.setNavigationBarTitle({
          title: order.statusText
        });


    this.setData({
      order,
      ...others
    });
  },

    toLogisticsDetail(e) {
        // const { index, id } = e.currentTarget.dataset;
        const { order, weapp_waybill_tokens = {}} = this.data;
        // const { config: { weixin_logistics_enable }} = this.data;
        // app.globalData.logisticsDetail = {
        //     logistics: order && order.logistics && order.logistics[index],
        //     items: order.items
        // };
         wx.navigateTo({
                url: `/pages/logistics/logistics?orderNo=${order.order_no}`
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
