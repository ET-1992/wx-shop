import { PRODUCT_LIST_STYLE } from "constants/index";
import api from "utils/api";
import { onDefaultShareAppMessage } from "utils/pageShare";

// 获取全局应用程序实例对象
// const app = getApp()

// 创建页面实例对象
Page({
	// 页面的初始数据
	data: {
		products: [],
		productListStyle: PRODUCT_LIST_STYLE[1],

		categoryId: 0,
		categoryParent: 0,
		isRefresh: false,
		isLoading: false,

		currentPage: 1,

		page_title: "",
		share_title: "",
		post_type_title: "",
		taxonomy_title: "",

		clientX: 0,
		activeIndex: 0,

		sortType: "default",
		sortSales: "default",

		priceSort: {
			orderby: "price",
			order: "desc"
		},
		saleSort: {
			orderby: "sale",
			order: "desc"
		},

		activeIdx: "0"
	},

	async loadProducts() {
		this.setData({ isLoading: true });
		const {
			currentPage,
			categoryId,
			isRefresh,
			products,
			categoryParent,
			activeIdx,
			priceSort,
			saleSort
		} = this.data;
		let options = {
			paged: currentPage,
			product_category_id: categoryId,
			product_category_parent: categoryParent
		};
		console.log(activeIdx);
		switch (activeIdx) {
			case "1":
				Object.assign(options, priceSort);
				break;
			case "2":
				Object.assign(options, saleSort);
				break;
		}
		console.log("-00-0000000000000");
		console.log(options);
		console.log("-00-0000000000000");

		const data = await api.hei.fetchProductList(options);
		const newProducts = isRefresh ?
			data.products :
			products.concat(data.products);
		this.setData({
			products: newProducts,
			isRefresh: false,
			currentPage: data.current_page,
			totalPages: data.total_pages,
			categories: data.categories,
			selectedCategoryId: data.current_product_category.id
		});
		this.setData({ isLoading: false });
		return data;
	},

	async onLoad({ categoryId, categoryParent }) {
		this.setData({ categoryId, categoryParent });
		const { page_title } = await this.loadProducts();
		wx.setNavigationBarTitle({
			title: this.data.categories[0].name
		});
	},

	onSegmentItemClick(ev) {
		const { selectedCategoryId } = this.data;
		const { categoryId, index } = ev.currentTarget.dataset;
		if (selectedCategoryId === categoryId) {
			return;
		}

		this.setData({
			selectedCategoryId: +categoryId,
			isRefresh: true,
			categoryId,
			activeIndex: index
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
					sortType: "default",
					sortSales: "default",
					isRefresh: true,
					currentPage: 1
				};
				break;
			case "1":
				updateData = {
					sortType: this.data.priceSort.order,
					sortSales: "default",
					isRefresh: true,
					currentPage: 1
				};
				break;
			case "2":
				updateData = {
					sortType: "default",
					sortSales: this.data.saleSort.order,
					isRefresh: true,
					currentPage: 1
				};
				break;
		}

		if (activeIdx === index && index === "0") {
			return;
		}

		if (
			(index === "1" && sortType === "priceUp") ||
			(index === "1" && sortType === "default")
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
			(index === "2" && sortSales === "default")
		) {
			updateData.sortSales = "saleDown";
			updateData["saleSort.order"] = "desc";
		}
		if (index === "2" && sortSales === "saleDown") {
			updateData.sortSales = "saleUp";
			updateData["saleSort.order"] = "asc";
		}
		updateData.activeIdx = index;
		this.setData(updateData);
		this.loadProducts();
	},

	onTouchStart(e) {
		this.data.clientX = e.touches[0].clientX;
	},

	onTouchMove(e) {
		this.data.clientX_move = e.touches[0].clientX;
	},

	onTouchEnd(e) {
		let val, idx, ev;
		if (this.data.clientX_move - this.data.clientX > 30) {
			// prev
			if (this.data.activeIndex === 0) {
				ev = {
					currentTarget: {
						dataset: {
							categoryId: this.data.categories[0].children[
								this.data.categories[0].children.length - 1
							].id,
							index: this.getIndex(
								this.data.categories[0].children[
									this.data.categories[0].children.length - 1
								].id
							)
						}
					}
				};
			}
			else if (this.data.activeIndex === 1) {
				ev = {
					currentTarget: {
						dataset: {
							categoryId: this.data.categories[0].id,
							index: this.getIndex(0)
						}
					}
				};
			}
			else {
				ev = {
					currentTarget: {
						dataset: {
							categoryId: this.data.categories[0].children[
								this.data.activeIndex - 2
							].id,
							index: this.getIndex(
								this.data.categories[0].children[this.data.activeIndex - 2].id
							)
						}
					}
				};
			}

			this.onSegmentItemClick(ev);
		}

		if (this.data.clientX_move - this.data.clientX < -30) {
			// next

			if (this.data.activeIndex === this.data.categories[0].children.length) {
				ev = {
					currentTarget: {
						dataset: {
							categoryId: this.data.categories[0].id,
							index: this.getIndex(0)
						}
					}
				};
			}
			else {
				ev = {
					currentTarget: {
						dataset: {
							categoryId: this.data.categories[0].children[
								this.data.activeIndex
							].id,
							index: this.getIndex(
								this.data.categories[0].children[this.data.activeIndex].id
							)
						}
					}
				};
			}
			this.onSegmentItemClick(ev);
		}
	},

	getIndex(id) {
		if (`${id}` === "0") {
			return 0;
		}

		let arr = this.data.categories[0].children;

		for (let i = 0; i < arr.length; i++) {
			if (`${id}` === `${arr[i].id}`) {
				return i + 1;
			}
		}
	},

	async onPullDownRefresh() {
		this.setData({
			isRefresh: true,
			currentPage: 1,
		});
		await this.loadProducts();
		wx.stopPullDownRefresh();
	},

	// async onReachBottom() {
	// 	const { currentPage, totalPages } = this.data;
	// 	if (currentPage === totalPages) { return; }
	// 	this.loadProducts();
	// },
	// 翻页有bug
	async onReachBottom() {
		const { currentPage, totalPages } = this.data;
		console.log(currentPage >= totalPages);
		if (currentPage >= totalPages) { return; }
		console.log('sth');
		this.setData({ currentPage: currentPage + 1 });
		this.loadProducts();
	},

	// 页面分享设置
	onShareAppMessage: onDefaultShareAppMessage
});
