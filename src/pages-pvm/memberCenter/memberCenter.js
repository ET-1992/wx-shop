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
    showCash: false,
    membership: {
      expire_day: 0,
    },
    memberData: {},
    amountData: {},
    current_user: {},
    rechargeAmount: 0,
    order_annotation: [],
    modal: {
      isShowModal: true,
    }, // 弹窗数据
    cashData: {},
    pointsForMoney: 0,
  },
  goRecharge() {
    this.setData({
      showRecharge: true,
    });
  },
  onClose() {
    this.setData({
      showRecharge: false,
    });
  },

  async walletGet() {
    let params = {
      wallet_type: 'cash',
    };
    try {
      let { errcode, cash } = await api.hei.walletGet(params);
      if (errcode === 0) {
        let cashData = cash;
        this.setData({
          cashData,
          order_annotation: cashData.setting.cash_withdraw_form,
        });
      }
    } catch (e) {}
  },
  // 充值
  async recharge() {
    let { rechargeAmount } = this.data;
    let params = {
      amount: rechargeAmount,
      wallet_type: 'cash',
    };
    try {
      let { errcode, order } = await api.hei.recharge(params);
      if (errcode === 0) {
        let { status, order_no } = order;
        // console.log('order_no', order_no);
        // console.log('status', status);
        if (status === 1000) {
          const { pay_interact_data } = await api.hei.walletPay({
            order_no: order_no,
            pay_method: 'WEIXIN',
          });
          console.log(pay_interact_data, '--');
          const { pay_sign } = pay_interact_data;
          this.wxPay(pay_sign, order_no);
        }
        if (status === 2000) {
          wx.showToast({
            title: '支付成功',
          });
        }
      }
    } catch (e) {
      console.log('requestPayment err', e);
      wx.showModal({
        content: e.errMsg || '请尽快完成付款',
        title: '支付取消',
        showCancel: false,
      });
    }
  },

  async wxPay(pay_sign, orderNo) {
    const { project, cid } = this.options;
    try {
      await wxProxy.requestPayment(pay_sign);
      wx.showToast({
        title: '支付成功',
      });
    } catch (e) {
      console.log('requestPayment err', e);
      wx.showToast({
        title: '支付取消',
      });
      if (project) {
        const fk = await this.showModal({ type: 'pay_fail_promotion' });
        if (fk) {
          this.paying = true;
          this.pay_sign = pay_sign;
          this.orderNo = orderNo;
          this.loadProductExtra();
          await api.hei.orderRefresh({ order_no: orderNo });
        } else {
          this.paying = false;
        }
      }
    }
  },

  getCash() {
    this.setData({
      showCash: true,
    });
  },
  getMoney() {
    let component = this.selectComponent('#mark-form');
    let { pointsForMoney } = this.data;
    console.log('component', component);
    if (!pointsForMoney) {
      wx.showToast({ title: '请输入积分', icon: 'none' });
      return;
    }
    let form = [];
    if (component) {
      form = component.handleValidate();
      console.log('form', form);
    }
    if (form.length > 0) {
      this.withdraw(form);
    }
    // console.log('resolved error', e);
  },
  cashOnClose(){
    this.setData({
      showCash: false,
    });
  },
  async withdraw(form) {
    let { pointsForMoney } = this.data;
    let params = {
      wallet_type: 'cash',
      number: pointsForMoney,
      form: form,
    };
    try {
      let { errcode, errmsg } = await api.hei.withdraw(params);
      if (errcode === 0) {
        wx.showToast({ title: '提现成功', icon: 'none' });
      } else {
        wx.showToast({ title: errmsg, icon: 'none' });
      }
    } catch (e) {
      console.log(e.errmsg);
      wx.showModal({
        title: '温馨提示',
        content: e.errMsg,
        showCancel: false,
      });
    }
  },

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
    this.walletGet();
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
