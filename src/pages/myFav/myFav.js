// pages/myFav/myFav.js
import api from 'utils/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
        next_first: null,
        next_cursor: null,
        isLoading: false,
        isPull: false,
        share_title:'',
        page_title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFavList()
      wx.setNavigationBarTitle({
        title: '我的收藏'
      });
  },
  async getFavList(){
    if (this.data.isLoading) return;
    this.setData({
      isLoading: true
    })
    const res = await api.hei.queryFavList({
      
    })
     let args = {};
      if (res.next_first) {
        args.next_first = res.next_first
      }
      if (this.data.isPull) {
        if (res.next_cursor) {  // 下拉刷新数据超过一页
          args.topics = res.articles
          args.next_cursor = res.next_cursor
        } else {
          args.topics = [].concat(res.articles, this.data.topics)
        }
      } else {
        args.topics = [].concat(this.data.topics, res.articles)
        args.next_cursor = res.next_cursor
      }
      if (this.data.isPull) {
        wx.stopPullDownRefresh()
      }
      args.isLoading = false;
      args.isPull = false;
      this.setData(args)
  },

  /** 
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
        this.setData({isPull: true})
        this.loadTopics({first: this.data.next_first})
    },
    onReachBottom: function() {
        if(this.data.next_cursor){
            this.loadTopics({cursor: this.data.next_cursor})
        }
    },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})