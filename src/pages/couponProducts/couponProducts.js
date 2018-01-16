import api from "utils/api";
import { SEARCH_KEY, PRODUCT_LIST_STYLE } from "constants/index";
import { showModal } from "utils/wxp";
// const app = getApp()

// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		searchKeys: [],
		searchKey: "",

		currentPage: 0,
		products: [],

		isRefresh: false,
		isLoading: false,
		isSearch: false,
		productListStyle: PRODUCT_LIST_STYLE[1],

		sortType: "defalut",
		sortSales: "default",

		priceSort: {
			orderby: "price",
			order: "desc"
		},
		saleSort: {
			orderby: "sale",
			order: "desc"
		},

		activeIdx: "0",

		indexParams: {
			couponId: '',
			couponTitle: '',
		}
	},

	async loadProducts() {
		const {
			currentPage,
			isRefresh,
			products,
			sortType,
			priceSort,
			activeIdx,
			saleSort,
			indexParams
		} = this.data;
		const options = {
			cursor: currentPage,
			coupon_id: indexParams.couponId
		};

		// if(sortType !== 'defalut') {
		// 	Object.assign(options, priceSort);
		// }else {
		// 	console.log(this.data);
		// }
		switch (activeIdx) {
			case "1":
				Object.assign(options, priceSort);
				break;
			case "2":
				Object.assign(options, saleSort);
				break;
		}

		// if(sortType !== 'defalut' && sortType2 !== 'saleSort'){
		// 	console.log('222')
		// 	Object.assign(options, saleSort);
		// }

		this.setData({ isLoading: true });

		const data = await api.hei.fetchProductList(options);
		const newProducts = isRefresh ?
			data.products :
			products.concat(data.products);
		this.setData({
			products: newProducts,
			isRefresh: false,
			currentPage: data.current_page,
			totalPages: data.total_pages,
			isLoading: false
		});
		return data;
	},

	onLoad(params) {
		this.setData({
			isRefresh: true,
			isSearch: true,
			indexParams: params,
		});
		this.loadProducts();
	},


	onSort(ev) {
		const { type, index } = ev.currentTarget.dataset;
		const { sortType, activeIdx, sortSales } = this.data;
		let updateData = {};
		switch (index) {
			case "0":
				updateData = {
					activeIdx: index,
					sortType: "defalut",
					sortSales: "defalut",
					isRefresh: true,
					currentPage: 0
				};
				console.log(updateData);
				break;
			case "1":
				updateData = {
					activeIdx: index,
					sortType: this.data.priceSort.order,
					sortSales: "defalut",
					isRefresh: true,
					currentPage: 0
				};
				break;
			case "2":
				updateData = {
					activeIdx: index,
					sortType: "defalut",
					sortSales: this.data.saleSort.order,
					isRefresh: true,
					currentPage: 0
				};
				break;
		}

		if (activeIdx === index && index === "0") {
			return;
		}

		console.log(index);
		console.log(sortType);
		console.log(sortSales);
		if (
			(index === "1" && sortType === "priceUp") ||
			(index === "1" && sortType === "defalut")
		) {
			updateData.sortType = "priceDown";
			updateData["priceSort.order"] = "desc";
		}
		if (index === "1" && sortType === "priceDown") {
			updateData.sortType = "priceUp";
			updateData["priceSort.order"] = "asc";
		}
		if (
			(index === "2" && sortSales === "saleUp") ||
			(index === "2" && sortSales === "defalut")
		) {
			updateData.sortSales = "saleDown";
			updateData["saleSort.order"] = "desc";
		}
		if (index === "2" && sortSales === "saleDown") {
			updateData.sortSales = "saleUp";
			updateData["saleSort.order"] = "asc";
		}

		this.setData(updateData);
		this.loadProducts();
	},

	async onPullDownRefresh() {
		this.setData({
			isRefresh: true,
			currentPage: 0,
			isSearch: false
		});
		await this.loadProducts();
		wx.stopPullDownRefresh();
	},

	async onReachBottom() {
		const { currentPage, totalPages } = this.data;
		if (currentPage === totalPages) {
			return;
		}
		this.loadProducts();
	},

	// 页面分享设置
	onShareAppMessage() {
		return {
			title: "share title",
			path: "/pages/search/search"
		};
	}
});
