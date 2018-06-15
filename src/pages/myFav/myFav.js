// pages/myFav/myFav.js
import api from 'utils/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
    next_cursor: 0,
    isLoading: true,
    share_title:'',
    page_title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getFavList()
      wx.setNavigationBarTitle({
        title: '我的收藏'
      });
  },

  async getFavList(){
		const { next_cursor } = this.data;
    const favData = await api.hei.queryFavList({
      cursor: next_cursor,
    });
    const newData = this.data.topics.concat(favData.articles);
    this.setData({
      topics: newData,
      isLoading: false,
      next_cursor: favData.next_cursor,
    })
    console.log(this.data.topics);
    return data;
  },

  async unfav(e) {
      wx.showModal({
        title:'确定取消收藏吗？',
        async success(){
          const data = await api.hei.unfav({
              post_id: e.currentTarget.id
          }).then(function(res){
              wx.redirectTo({
                url:'/pages/myFav/myFav',
                success:function(res){
                  wx.showToast({
                    title: '取消收藏成功！',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail(res){
                     console.log(res)
                }
              })
          })
        }
      })
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({ 
      next_cursor: 0,
      topics: [],
      isLoading: true
    });
    this.getFavList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    const { next_cursor } = this.data;
    if (!next_cursor) { return; }
    this.getFavList();
  }
})