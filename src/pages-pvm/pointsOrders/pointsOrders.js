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
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getOrderList();
  },

  async changeNavbarList(e) {
    console.log(e.detail);
    let type = e.detail.value;
    await this.getOrderList(type);
  },
  async getOrderList(type) {
    try {
      let { errcode, errmsg, orders, status } = await api.hei.memberOrder(type);
      console.log('errcode', errcode);
      if (errcode === 0) {
        let orderList = orders;
        orderList.forEach((item) => {
          item.statusText = valueToText(ORDER_STATUS_TEXT, item.order_status);
        });
        let navbarListData = [];
        for (let key in status) {
          let configType = {
            text: status[key],
            value: key,
          };
          navbarListData.push(configType);
        }
        console.log('orderList', orderList);
        this.setData({
          orderList,
          navbarListData,
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
});
