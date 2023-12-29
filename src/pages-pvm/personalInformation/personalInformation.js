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
    avatar: '../../icons/pvm/default.png',
    url: '',
    nikeName: '',
    name: '',
  },

  async initPage() {},

  bindconfirm(value) {
    // console.log(value?.detail.value, 98788);
  },

  bindinput(e) {
    const { value } = e.detail;
    this.setData({
      name: e.detail.value
    });
  },

  async onConfirm() {
    const { url, name } = this.data;
    const data = await api.hei.pvmUpdate({
      nickname: name,
      avatarurl: url,
    });
    wx.navigateBack();
  },

  async onChooseAvatar(e) {
    console.log(e, 'eee');
    const { avatarUrl } = e.detail;

    const data = await api.hei.pvmUpload({
      filePath: avatarUrl,
    });
    const urlData = JSON.parse(data);
    console.log(urlData.url);
    this.setData({
      avatar: avatarUrl,
      url: urlData.url,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage(options);
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
