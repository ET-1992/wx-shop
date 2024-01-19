import api from 'utils/api';
import { autoTransformAddress, formatTime, valueToText } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';
import { POINTS_TYPE } from 'constants/index';

const app = getApp();

Page({
  data: {
    navbarListData: [],
    activeIndex: 0,
    themeColor: '',
    logs: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getPointsList(1000);
  },

  async changeNavbarList(e) {
    console.log(e.detail);
    let type = e.detail.value;
    await this.getPointsList(type);
  },
  async getPointsList(type = '') {
    try {
      wx.showLoading({
        title: '加载中',
      });
      let param = {
        type: type,
        wallet_type: 'membership_exp',
      };
      let response = await api.hei.pvmWalletLog(param);
      if (response.errcode == 0) {
        let { types, logs } = response;
        let navbarListData = [];
        for (let key in types) {
          let configType = {
            text: types[key],
            value: key,
          };
          navbarListData.push(configType);
        }
        wx.hideLoading();

        this.setData({
          navbarListData,
          logs: logs,
        });
      }
    } catch (e) {}
  },
});
