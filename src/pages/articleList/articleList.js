// pages/articleList/articleList.js
import api from 'utils/api'
import { onDefaultShareAppMessage } from 'utils/pageShare'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		getIndex: 0,
		isLoading: false,
		isRefresh: false,
		currentPages: 1,
		articleList: [],
		totalPages: 1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getArticleList()
  //    this.setData(data)
		// 第一种方法
		// this.getArticleList()
		//   this.setData({
		//      isRefresh: true,
		//      getIndex: 0,
		//   })
	},
	// async getArticleList(id) {
	//   const {currentPage,isRefresh} = this.data
	//   const data = await api.hei.articleList({
	//     article_category_id:id || 0,
	//     paged: currentPage
	//   })
	//     const articleList = isRefresh ? data.articles:this.data.articleList.concat(data.articles)
	//     const categories = data.categories.unshift( {name:'全部',id:0})
	//      this.setData({
	//       categories:data.categories,
	//       currentPage: data.current_page,
	//       isRefresh: false,
	//       totalPages: data.total_pages,
	//       article:articleList,
	//       isLoading:false,
	//       share_title:data.share_title
	//     })
	//   if (data.page_title) {
	//     wx.setNavigationBarTitle({
	//         title: data.page_title
	//     });
	//   }
	//    this.setData(data)
	// },
	async changeCurrent(e) {
		this.setData({
			getIndex: e.detail.current
		})
    wx.setNavigationBarTitle({
      title:this.data.categories[e.detail.current].page_title
    })
	},

	handleArticleList(e) {
		const { index } = e.currentTarget.dataset
		const { id } = e.currentTarget
		this.setData({
			isRefresh: true,
			current: index,
		})
   
    wx.setNavigationBarTitle({
      title:this.data.categories[index].page_title
    })
	},
	// onPullDownRefresh(){
	//   console.log('下拉刷新')
	// },
	// async onPullDownRefresh() {
	//   console.log('daole');
	//     this.setData({
	//         isRefresh: true,
	//         currentPage: 1,
	//     });
	//     console.log('22')
	//     await this.getArticleList()
	//   },
	// const formatedOrders = data.orders.map((order) => {
	//    const statusCode = +order.status;
	//    order.statusCode = statusCode;
	//    order.statusText = STATUS_TEXT[+order.status];
	//    order.productCount = order.items.reduce((count, item) => {
	//      return count + +item.quantity;
	//    }, 0);
	//    return order;
	//  });
	async getArticleList() {
		const { currentPage, getIndex, isLoading } = this.data
		if (isLoading) return
		else this.data.isLoading = true
		const data = await api.hei.articleList({
			article_category_id: 0,
			paged: 1
		})
		const categoriesId = data.categories.map(function (item, index) {
			return item.id
		})

		const articleList = []
		let totalPages = [data.total_pages], currentPages = [data.current_page]
		for (var i = 0; i < categoriesId.length; i++) {
			const data2 = await api.hei.articleList({
				article_category_id: categoriesId[i] || 0,
				paged: 1
			})
			articleList.push(data2.articles)
			currentPages.push(data.current_page)
			totalPages.push(data2.total_pages)
		}
		articleList.unshift(data.articles)
		// const articleLists = isRefresh ? data.articles:this.data.articleList.concat(data.articles)

		const categories = data.categories.unshift({ name: '全部', id: 0,page_title:data.page_title })
		this.setData({
			articles: articleList,
			categories: data.categories,
			isLoading: false,
			currentPages,
			totalPages
		})
		wx.setNavigationBarTitle({
			title:data.page_title 
		})
	},
	async onReachBottom() {
		const { currentPages, totalPages, getIndex, isLoading } = this.data
		if (currentPages[getIndex] >= totalPages[getIndex] || isLoading) {
			return
		}
		this.data.isLoading = true
		const article_category_id = this.data.categories[this.data.getIndex].id
		const data = await api.hei.articleList({
			article_category_id: article_category_id,
			paged: currentPages[getIndex] + 1
		})
		const newArticleList = data.articles
		const newArticle = this.data.articles[this.data.getIndex]
		let data3 = []
		data3 = newArticleList.map(function (item, index) {
			newArticle.push(item)
		})

		this.setData({
			articles: this.data.articles
		})
		this.data.totalPages[getIndex] = data.total_pages
		this.data.currentPages[getIndex] = data.current_page
		this.setData({
			isLoading: false
		})
	},
	/* async onReachBottom() {
     // console.log('111');
       console.log(this.data);
       const { currentPage, totalPages } = this.data;
       console.log(this.data);
       // let getIndex = this.data.getIndex ? this.data.getIndex : 0
       // // const {id} = this.data.current_article_category
       // if (currentPage >= totalPages) {
       //     return;
       // }
       // this.setData({ isRefresh: false,currentPage: currentPage + 1 });
       // await this.getArticleList(getIndex)
       // this.setData({
       //   getIndex,

       // });

   },*/

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
