import api from 'utils/api';
import { PRODUCT_LAYOUT_STYLE } from 'constants/index';

const app = getApp();

Page({
    data: {
        currentPage: 1,
        products: [],

        isRefresh: false,
        isLoading: true,
        isSearch: false,
        productListStyle: PRODUCT_LAYOUT_STYLE[0],

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
        const {
            currentPage,
            isRefresh,
            products,
            priceSort,
            activeIdx,
            saleSort,
            indexParams
        } = this.data;

        const options = {
            paged: currentPage,
        };

        indexParams && indexParams.couponId
            ?
            options.coupon_id = indexParams.couponId
            :
            options.user_coupon_id = indexParams.userCouponId;

        switch (activeIdx) {
            case '1':
                Object.assign(options, priceSort);
                break;
            case '2':
                Object.assign(options, saleSort);
                break;
        }
        const data = await api.hei.fetchProductList(options);
        const newProducts = isRefresh ? data.products : products.concat(data.products);
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
        const { themeColor, tplStyle } = app.globalData;
        this.setData({
            isRefresh: true,
            isSearch: true,
            indexParams: params,
            isLoading: true,
            themeColor,
            tplStyle
        });
        this.loadProducts();
    },

    onSort(ev) {
        const { type, index } = ev.currentTarget.dataset;
        console.log(index);
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

        console.log('index', index);
        console.log('sortType', sortType);

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
        console.log(updateData);
        updateData.activeIdx = index;
        this.setData(updateData);
        this.loadProducts();
    },

    async onPullDownRefresh() {
        this.setData({
            isRefresh: true,
            isLoading: true,
            currentPage: 1,
        });
        await this.loadProducts();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        const { currentPage, totalPages } = this.data;
        if (currentPage >= totalPages) {
            return;
        }
        this.setData({ currentPage: currentPage + 1 });
        this.loadProducts();
    },

});
