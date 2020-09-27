import api from 'utils/api';
import { SEARCH_KEY, PRODUCT_LIST_STYLE } from 'constants/index';
import { showModal } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
// const app = getApp()

// 创建页面实例对象
Page({
    // 页面的初始数据
    data: {
        searchKeys: [],
        searchKey: '',

        currentPage: 1,
        products: [],

        isRefresh: false,
        isLoading: false,
        isSearch: false,
        productListStyle: PRODUCT_LIST_STYLE[1],

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

        activeIdx: '0'
    },

    async loadProducts() {
        const { currentPage, searchKey, isRefresh, products, sortType, priceSort, activeIdx, saleSort } = this.data;
        const options = {
            paged: currentPage,
            s: searchKey,
        };


        // if(sortType !== 'default') {
        // 	Object.assign(options, priceSort);
        // }else {
        // 	console.log(this.data);
        // }
        switch (activeIdx) {
            case '1':
                Object.assign(options, priceSort);
                break;
            case '2':
                Object.assign(options, saleSort);
                break;
        }


        // if(sortType !== 'default' && sortType2 !== 'saleSort'){
        // 	console.log('222')
        // 	Object.assign(options, saleSort);
        // }

        this.setData({ isLoading: true });

        const data = await api.hei.fetchProductList(options);
        const newProducts = isRefresh ? data.products : products.concat(data.products);
        this.setData({
            products: newProducts,
            isRefresh: false,
            currentPage: data.current_page,
            totalPages: data.total_pages,
            isLoading: false,
            share_image: data.share_image,
            share_title: data.share_title
        });
        return data;
    },


    onLoad({ key }) {
        const searchKeys = wx.getStorageSync(SEARCH_KEY) || [];
        this.setData({
            searchKeys,
        });
        if (key) {
            this.setData({
                isRefresh: true,
                isSearch: true,
                searchKey: key
            });
            this.onSearch({ isHistroy: false });
        }
    },

    onInput(ev) {
        const { value } = ev.detail;
        this.setData({
            searchKey: value
        });
    },

    async onSearch({ isHistroy }) {
        const { searchKeys, searchKey } = this.data;
        this.setData({
            isRefresh: true,
            isSearch: true,
            currentPage: 1,
        });
        if (!isHistroy && searchKey) {
            const result = searchKeys.find((key) => searchKey === key);
            if (!result) {
                searchKeys.unshift(searchKey);

                wx.setStorageSync(SEARCH_KEY, searchKeys);

                this.setData({ searchKeys });
            }
        }
        this.loadProducts();
    },

    onSort(ev) {
        const { type, index } = ev.currentTarget.dataset;
        const { sortType, activeIdx, sortSales } = this.data;
        // TODO 优化处理排序逻辑
        let updateData = {};
        switch (index) {
            case '0':
                updateData = {
                    activeIdx: index,
                    sortType: 'default',
                    sortSales: 'default',
                    isRefresh: true,
                    currentPage: 1,
                };
                console.log(updateData);
                break;
            case '1':
                updateData = {
                    activeIdx: index,
                    sortType: this.data.priceSort.order,
                    sortSales: 'default',
                    isRefresh: true,
                    currentPage: 1,
                };
                break;
            case '2':
                updateData = {
                    activeIdx: index,
                    sortType: 'default',
                    sortSales: 'saleDown',
                    isRefresh: true,
                    currentPage: 1,
                };
                break;

        }

        if (activeIdx === index && (index === '0' || index === '2')) { return }


        console.log(index);
        console.log(sortType);
        console.log(sortSales);
        if (index === '1' && sortType === 'priceUp' || index === '1' && sortType === 'default') {
            updateData.sortType = 'priceDown';
            updateData['priceSort.order'] = 'desc';
        }
        if (index === '1' && sortType === 'priceDown') {
            updateData.sortType = 'priceUp';
            updateData['priceSort.order'] = 'asc';
        }
        // if (index === '2' && sortSales === 'saleUp' || index === '2' && sortSales === 'default') {
        // 	updateData.sortSales = 'saleDown';
        // 	updateData['saleSort.order'] = 'desc';
        // }
        // if (index === '2' && sortSales === 'saleDown') {
        // 	updateData.sortSales = 'saleUp';
        // 	updateData['saleSort.order'] = 'asc';
        // }

        this.setData(updateData);
        this.loadProducts();

    },
    onSearchKeyClick(ev) {
        const { search } = ev.currentTarget.dataset;
        this.setData({ searchKey: search });
        this.onSearch({ isHistroy: true });
    },

    onClearSearch() {
        this.setData({ searchKey: '' });
    },

    async onClearHistory() {
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认清空历史？'
        });
        if (confirm) {
            this.setData({ searchKeys: [] });
            wx.setStorageSync(SEARCH_KEY, []);
        }
    },

    async onPullDownRefresh() {
        this.setData({
            isRefresh: true,
            currentPage: 1,
            isSearch: false,
        });
        await this.loadProducts();
        wx.stopPullDownRefresh();
    },

    // 翻页有bug
    async onReachBottom() {
        const { currentPage, totalPages } = this.data;
        console.log(currentPage >= totalPages);
        if (currentPage >= totalPages) { return }
        this.setData({ currentPage: currentPage + 1 });
        this.loadProducts();
    },

    // 页面分享设置
    onShareAppMessage: onDefaultShareAppMessage
});
