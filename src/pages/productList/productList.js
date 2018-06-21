import { PRODUCT_LAYOUT_STYLE } from 'constants/index';
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({

    // 页面的初始数据
    data: {
        products: [],
        productLayoutStyle: PRODUCT_LAYOUT_STYLE[0],

        categoryId: 0,
        categoryParent: 0,
        isRefresh: false,
        isLoading: false,

        currentPage: 1,

        page_title: '',
        share_title: '',
        post_type_title: '',
        taxonomy_title: '',

        clientX: 0,
        activeIndex: 0,

        sortType: 'default',
        sortSales: 'saleDown',

        priceSort: {
            orderby: 'price',
            order: 'desc',
        },
        saleSort: {
            orderby: 'total_sales',
            order: 'desc',
        },

        activeIdx: '0',
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
            saleSort,
        } = this.data;
        let options = {
            paged: currentPage,
            product_category_id: categoryId,
            product_category_parent: categoryParent,
        };
        console.log(activeIdx);
        switch (activeIdx) {
            case '1':
                Object.assign(options, priceSort);
                break;
            case '2':
                Object.assign(options, saleSort);
                break;
        }

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
            selectedCategoryId: data.current_product_category.id,
        });
        this.setData({ isLoading: false });
        return data;
    },

    async onLoad({ categoryId, categoryParent }) {
        const { themeColor } = app.globalData;
        this.setData({ categoryId, categoryParent, themeColor });
        const { page_title } = await this.loadProducts();
        wx.setNavigationBarTitle({
            title: this.data.categories[0].name,
        });
        this.setData({ toView: 'tab' + categoryId });
    },

    onSegmentItemClick(ev) {
        this.setData({ currentPage: 1 });
        const { selectedCategoryId } = this.data;
        const { categoryId, index } = ev.currentTarget.dataset;
        if (selectedCategoryId === categoryId) {
            return;
        }

        this.setData({
            selectedCategoryId: Number(categoryId),
            isRefresh: true,
            categoryId,
            activeIndex: index,
            currentPage: 1
        });

        this.loadProducts();
    },

    onSort(ev) {
        const { type, index } = ev.currentTarget.dataset;
        const { sortType, activeIdx, sortSales } = this.data;
        let updateData = {};
        switch (index) {
            case '0':
                updateData = {
                    sortType: 'default',
                    sortSales: 'default',
                    isRefresh: true,
                    currentPage: 1,
                };
                break;
            case '1':
                updateData = {
                    sortType: this.data.priceSort.order,
                    sortSales: 'default',
                    isRefresh: true,
                    currentPage: 1,
                };
                break;
            case '2':
                updateData = {
                    sortType: 'default',
                    sortSales: this.data.saleSort.order,
                    isRefresh: true,
                    currentPage: 1,
                };
                break;
        }

        if (activeIdx === index && (index === '0' || index === '2')) {
            return;
        }

        if (
            (index === '1' && sortType === 'priceUp') ||
			(index === '1' && sortType === 'default')
        ) {
            updateData.sortType = 'priceDown';
            updateData['priceSort.order'] = 'desc';
        }
        if (index === '1' && sortType === 'priceDown') {
            updateData.sortType = 'priceUp';
            updateData['priceSort.order'] = 'asc';
        }

        // if (
        // 	(index === "2" && sortSales === "saleUp") ||
        // 	(index === "2" && sortSales === "default")
        // ) {
        // 	updateData.sortSales = "saleDown";
        // 	updateData["saleSort.order"] = "desc";
        // }
        // if (index === "2" && sortSales === "saleDown") {
        // 	updateData.sortSales = "saleUp";
        // 	updateData["saleSort.order"] = "asc";
        // }
        updateData.activeIdx = index;
        this.setData(updateData);
        this.loadProducts();
    },

    onTouchStart(e) {
        this.data.clientX = e.touches[0].clientX;
    },
    onTouchEnd(e) {
        let val,
            idx,
            ev;
        if (e.changedTouches[0].clientX - this.data.clientX > 90) {
            // prev
            if (Number(this.data.activeIndex) === 0) {
                // ev = {
                // 	currentTarget: {
                // 		dataset: {
                // 			categoryId: this.data.categories[0].children[
                // 				this.data.categories[0].children.length - 1
                // 			].id,
                // 			index: this.getIndex(
                // 				this.data.categories[0].children[
                // 					this.data.categories[0].children.length - 1
                // 				].id,
                // 			),
                // 		},
                // 	},
                // };
                return;
            }
            else if (this.data.activeIndex === 1) {
                ev = {
                    currentTarget: {
                        dataset: {
                            categoryId: this.data.categories[0].id,
                            index: this.getIndex(0),
                        },
                    },
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
                                this.data.categories[0].children[this.data.activeIndex - 2].id,
                            ),
                        },
                    },
                };
            }

            this.onSegmentItemClick(ev);
        }

        if (e.changedTouches[0].clientX - this.data.clientX < -90) {

            // next

            if (this.data.activeIndex === this.data.categories[0].children.length) {
                ev = {
                    currentTarget: {
                        dataset: {
                            categoryId: this.data.categories[0].id,
                            index: this.getIndex(0),
                        },
                    },
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
                                this.data.categories[0].children[this.data.activeIndex].id,
                            ),
                        },
                    },
                };
            }
            this.onSegmentItemClick(ev);
        }
    },

    getIndex(id) {
        if (`${id}` === '0') {
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

    async onReachBottom() {
        const { currentPage, totalPages } = this.data;
        if (currentPage >= totalPages) {
            return;
        }
        this.setData({ currentPage: currentPage + 1 });
        this.loadProducts();
    },

    // 页面分享设置
    onShareAppMessage: onDefaultShareAppMessage,
});
