// pages/articleDetail/index.js
const WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp()
import api from 'utils/api';
import login from 'utils/login';
import { onDefaultShareAppMessage } from 'utils/pageShare';
let isSubmiting = false
let isFocusing = false
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        is_single: true,
        isLoading: true,
        type: 'topic',
        topic: null,
        user: null,
        text: '',
        reply_to: 0,
        page_title: '',
        share_title: '',
        reply_focus: false,
        placeholder: '发布评论',
        headerType: 'images',
        pageSize:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const pages = getCurrentPages()
        console.log(pages.length);
        this.getDetail(options.id)
        this.needAuth()
        const systemInfo = wx.getSystemInfoSync();
        console.log(systemInfo);
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        this.setData({
            isIphoneX,
            pageSize:pages.length
        });

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async getDetail(id) {
        const data = await api.hei.articleDetail({ id: id })
        this.setData({
            id,
            article:data.article,
            fav_count:data.article.fav_count,
            is_faved:data.article.is_faved,
            product:data.article.products,
            share_title:data.share_title,
            article_content: WxParse.wxParse('article_content', 'html', data.article.content, this, 5),
            topic: {
                reply_count: data.article.replies ? data.article.replies.length : 0,
                replies: data.article.replies
            }
        })

        if (data.page_title) {
            wx.setNavigationBarTitle({
                title: data.page_title
            });
        }
    },
    wxParseTagATap(e) {
        wx.navigateTo({
            url: '/' + e.currentTarget.dataset.src,
            success: function(res) {
                console.log('跳转成功')
            }
        })
    },

    async needAuth(e) {
        const user = await login();
        console.log(user)
        this.setData({ user: user })
    },

  
  
   async fav(e) {
        console.log(this.data);
         const data = await api.hei.fav({
            post_id:e.currentTarget.id
        })
      this.setData({
        is_faved:true,
        fav_count:this.data.fav_count+1
      })
      wx.showToast({
          title: data.errmsg,
          icon: 'success',
          duration: 2000
        })
    },
  async unfav(e){
       const data = await api.hei.unfav({
            post_id:e.currentTarget.id
        })
      this.setData({
        is_faved:false,
        fav_count:this.data.fav_count-1
      })
   wx.showToast({
      title: data.errmsg,
      icon: 'success',
      duration: 2000
    })
    },
  onReady() {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  currentIndex(e) {
    this.setData({ current: e.detail.current });
  },
  clickMe() {
    const that = this;
    that.setData({ autoplay: false, activeIndex: 1 });
    this.videoContext.requestFullScreen({
      direction: 0,
    });
  },
  startPlay() {
    this.setData({ autoplay: false });
  },
  pause() {
    this.setData({ autoplay: true });
  },
  end() {
    this.setData({ autoplay: true });
  },
  fullScreen(e) {
    console.log(e.detail.fullScreen);
    if (e.detail.fullScreen === false) {
      this.setData({ autoplay: true, activeIndex: -1 });
    }
  },

  onHideCouponList() {
    this.setData({
      isShowCouponList: false,
    });
  },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
     // onShareAppMessage: function (res) {
     //  console.log(this.data)
     //  if (res.from === 'button') {
     //     return {
     //        title: this.data.share_title,
     //        path: '/page/articleDetail/articleDetail?id={{this.data.id}}',
     //        success: function(res) {
     //          // 转发成功
     //        },
     //        fail: function(res) {
     //          // 转发失败
     //        }
     //      }
     //  }else{
     //    return {
     //        title: this.data.share_title,
     //        path: '/page/articleDetail/articleDetail?id={{this.data.id}}',
     //        success: function(res) {
     //          // 转发成功
     //        },
     //        fail: function(res) {
     //          // 转发失败
     //        }
     //      }
     //  }
     
    // },
    /**
     * 用户点击右上角分享
     */
  onShareAppMessage: onDefaultShareAppMessage,
    
})
