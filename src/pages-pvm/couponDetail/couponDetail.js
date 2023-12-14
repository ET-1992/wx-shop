import { auth, wxReceriverPairs } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY, CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
import api from 'utils/api';

const app = getApp();

Page({
  data: {
    config: {},
    couponList: [
      // {
      //   'id': 98447,
      //   'platform_user_id': 1531454,
      //   'appid': 'wx205da4d5cad1c388',
      //   'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
      //   'price': 100,
      //   'discount': '',
      //   'discount_desc': '订单满400可用',
      //   'isUse': true, // 是否使用
      //   'isThreshold': true, // s是否达到门槛
      //   'validity_period': '2023-3-3', // 有效期
      //   checked:false

      // },
      // {
      //   'id': 1064,
      //   'platform_user_id': 1531454,
      //   'appid': 'wx205da4d5cad1c388',
      //   'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
      //   'price': 0,
      //   'discount': '8',
      //   'discount_desc': '满2件可享8折',
      //   'isUse': false, // 是否使用
      //   'isThreshold': false,
      //   'validity_period': '2023-4-5',
      //   checked:false

      // },
      // {
      //   'id': 1064,
      //   'platform_user_id': 1531454,
      //   'appid': 'wx205da4d5cad1c388',
      //   'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
      //   'price': 50,
      //   'discount': '',
      //   'discount_desc': '订单满400可用',
      //   'isUse': false, // 是否使用
      //   'isThreshold': true,
      //   'validity_period': '2023-6',
      //   checked:false
      // }
    ],
    userCouponList: []
  },

  async onLoad(options) {
    try {
      const data = await api.hei.fetchCouponList();
      const { list } = data
      this.setData({
        couponList: list
      })
    } catch (e) {

    }
  },

  confirmCoupon() {
    // couponList[]
    let { couponList } = this.data
    let userCouponList = []

    couponList.forEach(item => {
      if(item.checked){
        let params = { "type": "coupon", "id": item.id }
        userCouponList.push(params)
      }
    })
    this.setData({
      userCouponList
    })
    app.event.emit('getCouponData', userCouponList);
    wx.navigateBack();
  },

  userCoupon(e) {
    console.log(e.currentTarget.dataset)
    let { id, index } = e.currentTarget.dataset
    console.log('id', id)
    console.log('index', index)
    let { couponList } = this.data
    couponList[index].checked = !couponList[index].checked
    this.setData({
      couponList
    })
    // couponList[]
    // let params = {"type":"coupon", "id": 14}
    // let userCouponList = []
    // userCouponList.push(params)
    // this.setData({
    //   userCouponList
    // })
    // app.event.emit('getCouponData', userCouponList);
  }

});