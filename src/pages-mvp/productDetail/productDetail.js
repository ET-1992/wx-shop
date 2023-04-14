// pages/shopDetail/index.js

import api from 'utils/api';
import { autoTransformAddress, joinUrl } from 'utils/util';
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
        text: '立即支付',
      },
    ],
    isShowSkuModal: false,
    // isBargainBuy: false, // 购买数量加减隐藏
    time: 30 * 60 * 60 * 1000, // 倒计时
    timeData: {},
    countdownModal: false,
    showCountDown: false,
    showModalType: 'colse',
    best_promotion: [],
    product: {}
  },

  countdownChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  getcoupon: function(params) {
    console.log('getcoupon', params);
    console.log('detail', params.detail);
    this.onCloseModal();
    // this.loadProductExtra();
  },


  async showModal({ type }) {
    let showModalType;
    const { project, cid, id } = this.options;
    const { promotion } = await api.hei.getRecoverProject({
      project,
      cid,
      product_id: id,
      type
    });

    if (promotion && promotion.type) {
      showModalType = promotion.type === 'discount_code' ? promotion.data.style_type : promotion.type;

      if (showModalType === 'page') {

        const params = {
          key: promotion.data.key,
          project,
          cid,
          product_id: id,
          type: promotion.action_type
        };
        wx.navigateTo({
          url: joinUrl('/pages-mvp/promotionList/promotionList', params),
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        });

      }

      this.setData({
        promotion,
        showModalType
      });
      return true;
    } else {
      return false;
    }
  },

  async onClickLeft() {
    const { project } = this.options;
    if (project) {
      const ak =  await this.showModal({ type: 'recover_promotion' });
      if (ak) {
       await this.loadProductExtra();
      } else {
       wx.switchTab({
         url: '/pages/home/home'
       });
      }
    } else {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  onCloseModal() {
    this.setData({
      showModalType: ''
    });
  },

  onShowSkuModal() {
    this.setData({
      isShowSkuModal: true
    });
  },

  async initPage() {
    const { id } = this.options || {};
    if (id) {
      const { config, share_title, share_image, page_title, product } =
        await api.hei.fetchProduct({ id });
      this.config = config;

      product.coupons_price = 0;

      wx.setNavigationBarTitle({
        title: page_title,
      });
      this.setData({ product, page_title, config, share_image, share_title });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.initPage(options);
    await this.loadProductExtra();
  },

  async loadProductExtra() {
    let showModalType;
    const { project, cid, id } = this.options;
    const { product } = this.data;
    const { recover_project, best_promotion } = await api.hei.productExtra({
      project,
      id,
      cid
    });

    if (recover_project) {
      const { promotion, max_promotion_price, ...rest } = recover_project;

      // product.coupons_price = max_promotion_price;
      console.log(product, 'product1');

      if (promotion) {
        showModalType = promotion.type === 'discount_code' ? promotion.data.style_type : promotion.type;

        this.setData({
          promotion,
          showModalType
        });
      }

      if (max_promotion_price) {

      this.setData({
        'product.coupons_price': max_promotion_price
      });
      }
    }

    if (best_promotion) {

      this.setData({
        best_promotion
      });
    }

    console.log(recover_project, '---');
  },

  async onSkuConfirm(e) {
    let orderNo = '';
    try {
      console.log(e, 'onSkuConfirm');
      const { project, cid } = this.options;
      const { queryData, actionType } = e.detail;
      const { best_promotion } = this.data;
      const {
        quantity,
        selectedSku: { id },
        address,
        product,
        message
      } = queryData;
      const orderQuery = {
        posts: [{ post_id: product.id, sku_id: id, quantity }],
        pay_method: 'WEIXIN',
        receiver: autoTransformAddress(address),
        buyer_message: message,
        project,
        cid,
        promotions: best_promotion
      };
      console.log(orderQuery);
      const { order_no } = await api.hei.orderCreate(orderQuery);
      orderNo = order_no;
      const { pay_interact_data } = await api.hei.orderPay({
        order_nos: [order_no],
        pay_method: 'WEIXIN',
      });
      console.log(pay_interact_data, '--');
      const { pay_sign } = pay_interact_data;
      await wxProxy.requestPayment(pay_sign);
      wx.showToast({
        title: '支付成功',
      });
    } catch (e) {
      console.log('requestPayment err', e);
      wx.showToast({
        title: '支付取消',
      });
      // const { errMsg } = e;
      // if (errMsg.indexOf('cancel') >= 0) {
      //   await wxProxy.showModal({
      //     title: '支付取消',
      //     content: '请尽快完成付款',
      //     showCancel: false,
      //   });
      //   return { isCancel: true };
      // } else {
      //   await wxProxy.showModal({
      //     title: '支付失败',
      //     content: '网络错误，请稍后重试',
      //     showCancel: false,
      //   });
      // }
      // await this.loadProductExtra();
      await this.showModal({ type: 'pay_fail_promotion' });
      await api.hei.orderRefresh({ 'order_no': orderNo });
      await this.loadProductExtra();
    }
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
