import api from 'utils/api';
import { autoTransformAddress, formatTime, valueToText } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';
import { POINTS_TYPE } from 'constants/index';

const app = getApp();

Page({
  data: {
    navbarListData: POINTS_TYPE,
    activeIndex: 1,
    themeColor: '',
    orderList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getOrderList();
  },

  changeNavbarList() {},
  async getOrderList() {
    try {
      let { errcode, errmsg, orders } = await api.hei.memberOrder();
      console.log('errcode', errcode);
      if (errcode === 0) {
        let orderList = orders;
        orderList.forEach(item => {
          item.statusText = valueToText(ORDER_STATUS_TEXT, item.order_status);
        });
        console.log('orderList', orderList);
        this.setData({
          orderList
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
