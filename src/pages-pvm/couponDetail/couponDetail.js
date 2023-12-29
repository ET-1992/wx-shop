import api from 'utils/api';
const app = getApp();
import { CONFIG } from 'constants/index';

// 创建页面实例对象
Page({
  // 页面的初始数据
  data: {
    status: [
      { name: '可使用优惠券', value: 'available' },
      { name: '不可用优惠券', value: 'unavailable' },
    ],
    selectedStatus: 'available',
    coupons: [],
    config: {},
    tplStyle: 'newCoupon',
    selectId: '',
    onlyShow: false
  },

  // 生命周期函数--监听页面加载
  async onLoad({ id, onlyShow }) {
    console.log('id', id);
    if (onlyShow) {
      this.setData({
        onlyShow
      });
    }
    const { themeColor } = app.globalData;
    // const coupons = wx.getStorageSync('orderCoupon');
    try {
      let params = {
        post_id: id,
        status: 1
      };
      wx.showLoading();
      const { list } = await api.hei.fetchCouponList(params);
      console.log('list', list);
      let coupons = list;
      const systemInfo = wx.getSystemInfoSync();
      const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
      let cdn_host = wx.getStorageSync('cdn_host');
      console.log('cdn_host', cdn_host);
      let config = {
        cdn_host,
        style_type: 'newCoupon'
      };
      console.log();
      wx.hideLoading();
      this.setData({
        coupons,
        isIphoneX,
        themeColor,
        config
      });
    } catch (e) {
      console.log('eeeeee', e);
    }

  },

  onStautsItemClick(ev) {
    const { value } = ev.currentTarget.dataset;
    if (value === this.data.selectedStatus) { return }
    this.setData({
      selectedStatus: value,
      // activeIndex: this.getIndex(value),
      isRefresh: true,
    });
  },

  onCouponClick(ev) {
    console.log(ev);
    let { coupons, selectId } = this.data;
    const { coupon } = ev.currentTarget.dataset;
    selectId = coupon.id;
    this.setData({
      selectId
    });
    let userCouponList = [];
    coupons.forEach(item => {
      if (selectId == item.id) {
        let params = { 'type': 'coupon', 'id': item.id, title: item.title, coupon: item };
        userCouponList.push(params);
      }
    });
    this.setData({
      userCouponList
    });
    app.event.emit('getCouponData', userCouponList);
    wx.navigateBack();
    // const { coupons } = this.data;
    // if (coupons.recommend === coupons.available[index]) {
    //   coupons.recommend = {};
    // } else {
    //   coupons.recommend = coupons.available[index];
    // }
  },

  onComfirm() {
    const { coupons } = this.data;
    // app.globalData.currentOrder.coupons = coupons;
    app.event.emit('getCouponIdEvent', coupons.recommend);
    console.log(app.globalData.currentOrder);
    wx.navigateBack({
      delta: 1
    });
  },
});
