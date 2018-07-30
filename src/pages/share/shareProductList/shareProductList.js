import api from 'utils/api';
import { PRODUCT_LAYOUT_STYLE } from 'constants/index';
Page({
    data: {
        productLayoutStyle: PRODUCT_LAYOUT_STYLE[4],
        filterListData: [
            {
                name: '佣金比例',
            },
            {
                name: '价格'
            },
            {
                name: '销量'
            }
        ],
        filterData: {
            filterIndex: 0,
            filterType: 'Up'
        },
        current_page: 1,
        products: [],
        isLoading: true
    },
    async onShow() {
        this.filterProduct();
    },
    changeFilterList(e) {
        this.setData({
            filterData: e.detail,
            current_page: 1,
            products: [],
            isLoading: true
        }, this.filterProduct);
    },
    filterProduct() {
        const { filterData } = this.data;
        const sortText = {
            0: 'commission',
            1: 'price',
            2: 'total_sales'
        };
        const sortStatus = {
            'Up': 'desc',
            'Down': 'asc'
        };
        this.setData({
            filterOrderby: sortText[filterData.filterIndex],
            filterOrder: sortStatus[filterData.filterType]
        }, this.loadProduct);
    },
    async loadProduct() {
        const { filterOrderby, filterOrder, current_page, products } = this.data;
        const data = await api.hei.getShareProductList({ orderby: filterOrderby, order: filterOrder, paged: current_page });
        if (products.length > 0) {
            data.products = products.concat(data.products);
        }
        this.setData({
            ...data,
            isLoading: false
        });
    },
    async onPullDownRefresh() {
        this.setData({
            isLoading: true,
            currentPage: 1,
        });
        this.loadProduct();
        wx.stopPullDownRefresh();
    },
    onReachBottom() {
        let { current_page, total_pages } = this.data;
        if (current_page === total_pages) { return }
        current_page++;
        console.log(current_page);
        this.setData({
            current_page
        }, this.loadProduct);
    }
});