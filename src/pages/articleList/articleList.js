// pages/articleList/articleList.js
 import api from 'utils/api';
 import { onDefaultShareAppMessage } from 'utils/pageShare';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    isLoading: false,
    isRefresh: false,
    currentPage: 1,
    articleList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    await this.getArticleList(0)
    this.setData({
       isRefresh: true,
       current: 0,
    })
  },
  async getArticleList(id){
    const {currentPage,isRefresh} = this.data
    const data = await api.hei.articleList({
      article_category_id:id, 
      paged: currentPage
    })
    const articleList = isRefresh ? data.articles:this.data.articleList.concat(data.articles)
    const scrollWidth = 120 + 120 * data.categories.length + 10 * data.categories.length
    this.setData({
       currentPage: data.current_page,
       isRefresh: false,
       totalPages: data.total_pages,
       articleList:articleList,
       isLoading:false,
       share_title:data.share_title,
       scrollWidth:scrollWidth
    })
    console.log(scrollWidth);
    if (data.page_title) {
      wx.setNavigationBarTitle({
          title: data.page_title
      });
    }
    this.setData(data)
  },
  async handleArticleList(e){
    const {id} = e.currentTarget
     this.setData({
       current: id,
       currentPage:1,
      isRefresh: true,
       articleList:[],
    })
    await this.getArticleList(id)
    this.setData({
       current: id,
    })
    console.log(`this.data.current,${this.data.current}`);
   
    console.log('daole');

  },
  onPullDownRefresh(){
    console.log('下拉刷新')
  },
  // async onPullDownRefresh() {
  //   console.log('daole');
  //     this.setData({
  //         isRefresh: true,
  //         currentPage: 1,
  //     });
  //     console.log('22')
  //     await this.getArticleList()
  //   },
  async onReachBottom() {
      const { currentPage, totalPages } = this.data;
      // console.log(this.data.current);

      let current = this.data.current ? this.data.current : 0
      // const {id} = this.data.current_article_category
      if (currentPage >= totalPages) {
          return;
      }
      console.log(this.data)
      this.setData({ isRefresh: false,currentPage: currentPage + 1 });
      await this.getArticleList(current)
      this.setData({ 
        current,
       
      });

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
   * 用户点击右上角分享
   */
onShareAppMessage: onDefaultShareAppMessage,
})