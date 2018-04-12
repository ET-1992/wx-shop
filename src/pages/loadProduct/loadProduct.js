import { PRODUCT_LIST_STYLE, CATEGORY_LIST_STYLE } from 'constants/index';
import api from 'utils/api';
import { showToast, showModal } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import getToken from 'utils/getToken';
import login from 'utils/login';
import autoRedirect from 'utils/autoRedirect';


// 获取应用实例
const app = getApp(); // eslint-disable-line no-undef

Page({
  data: {
    pageName: 'home',

    products: [],
    product_categories: [],
    home_sliders: { 
      home_sliders: [],
    },
    miaoshas: [],
    groupons: [],
    featured_products: [],
    coupons: [],
      
    productListStyle: PRODUCT_LIST_STYLE[1],
    categoryListStyle: CATEGORY_LIST_STYLE[2],
    isRefresh: false,
    isLoading: false,

    post_type_title: '',
    taxonomy_title: '',
    share_title: '',
    page_title: '',
    type:''
  },

  async loadProducts() {
   // this.setData({ isLoading: true });
   const { next_cursor, products } = this.data;
  
   const data = await api.hei.fetchProductList({
     cursor: next_cursor
   });
   console.log(data)

   const newProducts = products.concat(data.products);
   this.setData({
     products: newProducts,
     next_cursor: data.next_cursor
   });
   if (data.page_title) {
      wx.setNavigationBarTitle({
        title: data.page_title
      });

    }
   // this.setData({ isLoading: false });
   // return data;
  },

  async loadHome() {
    this.setData({ isLoading: true });
    const data = await api.hei.fetchHome();
    
  },


  async onLoad() {
    this.loadProducts();
  },

  async onPullDownRefresh() {
    await this.loadHome();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    const { next_cursor } = this.data;
    if (!next_cursor) {
      return;
    }
    this.loadProducts();
  },

  onShareAppMessage: onDefaultShareAppMessage,
  // onShareAppMessage:function(res) {
  //  console.log(this.data)
  //  return {
  //    title: this.data.share_title,
  //    imageUrl:this.data.share_image,
  //    path:'/pages/home/home'
  //  }
  // }
});

