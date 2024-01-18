// pages/shopDetail/index.js

import api from 'utils/api';
import { autoTransformAddress, joinUrl } from 'utils/util';
import wxProxy from 'utils/wxProxy';
import { autoNavigate_, subscribeMessage } from 'utils/util';
import proxy from 'utils/wxProxy';
import { onDefaultShareAppMessage } from 'utils/pageShare';
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    toCartActions: [
      {
        type: 'addCartPvm',
        text: '加入购物车',
      },
    ],
    actions: [
      {
        type: 'onBuy',
        text: '立即支付',
      },
    ],
    isShowSkuModal: false,
    isShowToCardSkuModal: false,
    // isBargainBuy: false, // 购买数量加减隐藏
    time: 30 * 60 * 60 * 1000, // 倒计时
    timeData: {},
    showModalType: 'colse',
    best_promotion: [],
    product: {},
    showBgColor: false,
    coupons: [],
    isShowCouponList: false,
    tplStyle: 'newCoupon',
    config: {},
    receivableCoupons: [],
    receivedCoupons: [],
    themeColor: {},
    isLoading: true,
    isShowShare: false,
    globalData: app.globalData,
  },

  onShowCouponList() {
    console.log('onShowCoupons');
    this.setData({
      isShowCouponList: true,
    });
  },

  countdownChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  onHideCouponList() {
    this.setData({
      isShowCouponList: false,
    });
  },

  getcoupon: function (params) {
    console.log('getcoupon', params);
    console.log('detail', params.detail);
    this.onCloseModal();
    wx.showToast({
      title: '领取成功',
    });
    // this.loadProductExtra();
  },

  async showModal({ type }) {
    let showModalType;
    const { project, cid, id } = this.options;
    const { promotion } = await api.hei.getRecoverProject({
      project,
      cid,
      product_id: id,
      type,
    });

    if (promotion && promotion.type) {
      showModalType =
        promotion.type === 'discount_code'
          ? promotion.data.style_type
          : promotion.type;

      if (showModalType === 'page') {
        const params = {
          key: promotion.data.key,
          project,
          cid,
          product_id: id,
          type: promotion.action_type,
        };
        wx.navigateTo({
          url: joinUrl('/pages-mvp/promotionList/promotionList', params),
          success: (result) => {},
          fail: () => {},
          complete: () => {},
        });
      }

      if (showModalType === 'dialog') {
        if (promotion.data.product_first_img) {
          const { images = [] } = this.data.product;
          images.unshift({ large: promotion.data.product_first_img });
          this.setData({
            'product.images': images,
          });
        }
      }

      this.setData({
        promotion,
        showModalType,
      });
      return true;
    } else {
      return false;
    }
  },

  async onClickLeft() {
    const { project } = this.options;
    if (project) {
      const ak = await this.showModal({ type: 'recover_promotion' });
      if (ak) {
        await this.loadProductExtra();
      } else {
        wx.switchTab({
          url: '/pages/home/home',
        });
      }
    } else {
      wx.navigateBack({
        delta: 1,
      });
    }
  },

  onCloseModal() {
    const { paying, orderNo } = this;
    this.setData(
      {
        showModalType: '',
      },
      async () => {
        if (paying) {
          const { pay_interact_data } = await api.hei.orderPay({
            order_nos: [orderNo],
            pay_method: 'WEIXIN',
          });
          console.log(pay_interact_data, '--');
          const { pay_sign } = pay_interact_data;

          this.wxPay(pay_sign, orderNo);
        } else {
          this.setData({
            isShowSkuModal: true,
          });
        }
      }
    );
  },

  onShowSkuModal() {
    this.setData({
      isShowSkuModal: true,
    });
  },
  onShowToCartSkuModal() {
    this.setData({
      isShowToCardSkuModal: true,
    });
  },

  async initPage() {
    const { id } = this.options || {};
    if (id) {
      const { share_title, share_image, page_title, product } =
        await api.hei.fetchProduct({ id });
      let cdn_host = wx.getStorageSync('cdn_host');
      let config = {
        cdn_host,
        style_type: 'newCoupon',
      };
      // app.globalData.couponBackgroundColor = 'orange'
      product.coupons_price = 0;
      console.log('configsss', config);
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
    const { afcode } = options;
    console.log('options', options);
    const { themeColor } = app.globalData;
    console.log('afcode', afcode);
    if (afcode) {
      app.globalData.afcode = afcode;
    }
    this.setData({ themeColor });
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    app.event.on('getCouponData', this.getCouponData, this);
    await this.initPage(options);
    await this.loadProductExtra();
    wx.hideLoading();
  },

  async loadProductExtra() {
    let showModalType;
    const { project, cid, id } = this.options;
    const { product } = this.data;
    const { recover_project, coupons, affiliate } = await api.hei.productExtra({
      project,
      id,
      cid,
    });

    if (affiliate.afcode) {
      let isShowShare = true;
      let afcode = affiliate.afcode;
      this.setData({
        afcode,
        isShowShare,
      });
    }

    const { receivableCoupons, receivedCoupons } =
      coupons &&
      coupons.reduce(
        (classifyCoupons, coupon) => {
          const { receivableCoupons, receivedCoupons } = classifyCoupons;

          // coupon.fomatedTitle = coupon.title.split('-')[1];
          if (Number(coupon.status) === 2) {
            receivableCoupons.push(coupon);
          } else if (Number(coupon.status) === 4) {
            receivedCoupons.push(coupon);
          }
          return classifyCoupons;
        },
        { receivableCoupons: [], receivedCoupons: [] }
      );

    this.setData({
      receivableCoupons,
      receivedCoupons,
    });

    console.log('coupons', coupons);
    if (recover_project) {
      const { promotion, max_promotion_price, ...rest } = recover_project;

      // product.coupons_price = max_promotion_price;
      console.log(product, 'product1');

      if (promotion) {
        showModalType =
          promotion.type === 'discount_code'
            ? promotion.data.style_type
            : promotion.type;

        this.setData({
          promotion,
          showModalType,
        });
      }

      if (max_promotion_price) {
        this.setData({
          'product.coupons_price': max_promotion_price,
        });
      }
    }

    if (coupons) {
      this.setData({
        coupons,
      });
    }

    console.log(recover_project, '---');
  },

  shareProduct() {
    const opts = {
      afcode: this.data.afcode || '',
    };
    let path = '/pages-pvm/productList/productList';
    return onDefaultShareAppMessage.call(this, opts, path);
  },

  async onSkuConfirm(e) {
    let orderNo = '';
    try {
      console.log(e, 'onSkuConfirm');
      const { project, cid } = this.options;
      const { queryData, actionType } = e.detail;
      console.log('queryData', queryData);
      const { best_promotion } = this.data;
      const {
        quantity,
        selectedSku: { id },
        address,
        product,
        message,
      } = queryData;
      const orderQuery = {
        posts: [{ post_id: product.id, sku_id: id, quantity }],
        pay_method: 'WEIXIN',
        receiver: autoTransformAddress(address),
        buyer_message: message,
        project,
        cid,
        promotions: best_promotion,
        afcode: app.globalData.afcode
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
      this.wxPay(pay_sign, orderNo);
      // await wxProxy.requestPayment(pay_sign);
      // wx.showToast({
      //   title: '支付成功',
      // });
    } catch (e) {
      console.log('requestPayment err', e);
      wx.showModal({
        content: e.errMsg || '请尽快完成付款',
        title: '支付取消',
        showCancel: false,
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
      // await this.showModal({ type: 'pay_fail_promotion' });
      // await api.hei.orderRefresh({ 'order_no': orderNo });
      // await this.loadProductExtra();
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

  async addCart(e) {
    // console.log('ssss')
    // const { id } = this.options || {};
    // let product = {
    //   "id": id,
    //   "sku_id": 0,
    //   "quantity": 1,
    //   "shipping_type": 1
    // }
    // let products = [product]
    try {
      const { project, cid } = this.options;
      const { queryData, actionType } = e.detail;
      const {
        quantity,
        selectedSku: { id },
        product,
      } = queryData;
      console.log('product', product);
      console.log('queryData', queryData);

      let products = [
        {
          id: product.id,
          sku_id: id,
          quantity: quantity,
          shipping_type: 1,
        },
      ];
      console.log('queryData', queryData);
      let response = await api.hei.pvmAddCart({
        products,
      });
      if (response.errcode === '0') {
        wx.showModal({
          content: '加入购物车成功',
          title: '操作成功',
          showCancel: false,
        });
      }
    } catch (e) {
      console.log('error', e);
      wx.showModal({
        content: e.errMsg || '加入购物车失败',
        title: '操作失败',
        showCancel: false,
      });
    }
  },
  // 返回首页
  onGoHome() {
    let url = '/pages/home/home';
    let type = 'switchTab';
    autoNavigate_({ url, type });
  },
  // 返回购物车
  onGoCart() {
    let url = '/pages-pvm/cart/cart';
    let type = 'switchTab';
    autoNavigate_({ url, type });
  },
  async bindGetCoupon(e) {
    this.onCouponClick(e);
  },

  async onCouponClick(ev) {
    const { id, index, status, title } = ev.currentTarget.dataset;
    if (Number(status) === 2) {
      await this.onReceiveCoupon(id, index);
    } else {
      wx.navigateTo({
        url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
      });
    }
  },
  async onReceiveCoupon(id, index) {
    try {
      const data = await api.hei.pvmReceiveCoupon({
        id: id,
      });
      if (!data.errcode) {
        let subKeys = [{ key: 'coupon_expiring' }];
        await subscribeMessage(subKeys);
        await proxy.showToast({ title: '领取成功' });
        const updateData = {};
        const key = `receivableCoupons[${index}].status`;
        updateData[key] = 4;
        this.setData(updateData);
      }
    } catch (err) {
      await proxy.showModal({
        title: '温馨提示',
        content: err.errMsg,
        showCancel: false,
      });
    }
  },
  getCouponData(data) {
    console.log('获取优惠券数据', data);
    this.setData({
      best_promotion: data,
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
  onUnload: function () {
    app.event.off('getCouponData');
  },

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
  onShareAppMessage() {
    const opts = {
      afcode: this.data.afcode || '',
    };
    let path = '/pages-pvm/productList/productList';
    return onDefaultShareAppMessage.call(this, opts, path);
  },
});
