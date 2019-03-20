import { CONFIG } from 'constants/index';
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

const app = getApp();

Page({
    data: {
        filterListData: [
            {
                name: '综合',
                hideOption: true
            },
            {
                name: '价格',
            },
            {
                name: '销量',
            }
        ],
        filterData: {
            filterIndex: 0,
            filterType: 'Down'
        },
        filterOrderby: '',
        filterOrder: '',
        products: [],
        categories: [],

        categoryId: 0,
        categoryParent: 0,
        isLoading: true,
        isInit: true,

        current_page: 1,

        page_title: '',
        share_title: '',
        post_type_title: '',
        taxonomy_title: '',

        clientX: 0,
        activeIndex: 0,
    },

    async onLoad({ categoryId, categoryParent }) {
        const { themeColor } = app.globalData;
        const { style_type: tplStyle = 'default' } = wx.getStorageSync(CONFIG);
        this.setData({
            categoryId,
            categoryParent
        });
        await this.loadProducts();
        const { categories } = this.data;
        wx.setNavigationBarTitle({ title: categories[0].name });

        let navbarListData = [];
        categories[0].children.forEach((item) => {
            navbarListData.push({
                text: item.name,
                value: item.id
            });
        });
        navbarListData.unshift({ text: '全部', value: categories[0].id });
        let activeIndex = navbarListData.findIndex((item) => {
            return item.value === Number(categoryId);
        });

        this.setData({
            themeColor,
            tplStyle,
            globalData: app.globalData,
            navbarListData,
            activeIndex,
            isInit: false
        });
    },

    changeNavbarList(e) {
        const { index, value } = e.detail;
        this.setData({
            products: [],
            categoryId: value,
            activeIndex: index,
            isLoading: true,
            current_page: 1
        });
        this.loadProducts();
    },

    changeFilterList(e) {
        console.log(e);
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
            0: 'default',
            1: 'price',
            2: 'total_sales'
        };
        const sortStatus = {
            'Up': 'asc',
            'Down': 'desc'
        };
        this.setData({
            filterOrderby: sortText[filterData.filterIndex],
            filterOrder: sortStatus[filterData.filterType]
        }, this.loadProducts);
    },
    async loadProducts() {
        let { current_page, categoryId, products, categoryParent, filterOrderby, filterOrder, filterData } = this.data;
        let options = {
            paged: current_page,
            product_category_id: categoryId,
            product_category_parent: categoryParent,
        };
        if (filterData.filterIndex) {
            options.orderby = filterOrderby;
            options.order = filterOrder;
        }

        this.data.fetchProductListStatus = 'Pending';

        const data = await api.hei.fetchProductList(options);
        current_page++;

        this.data.fetchProductListStatus = 'Success';

        if (products.length > 0) {
            data.products = products.concat(data.products);
        }
        this.setData({
            ...data,
            current_page,
            isLoading: false
        });
    },

    onTouchStart(e) {
        this.data.clineX = e.touches[0].clientX;
    },
    onTouchEnd(e) {
        let { activeIndex } = this.data;
        if (e.changedTouches[0].clientX - this.data.clineX < -120) {
            this.moveIndex(activeIndex + 1);
        }
        if (e.changedTouches[0].clientX - this.data.clineX > 120) {
            this.moveIndex(activeIndex - 1);
        }
    },
    moveIndex(index) {
        let activeIndex = index;
        const { navbarListData } = this.data;
        const { length, last = length - 1 } = navbarListData;
        if (activeIndex < 0) {
            return;
        }
        if (index > last) {
            activeIndex = 0;
        }
        this.setData({
            products: [],
            categoryId: navbarListData[activeIndex].value,
            activeIndex,
            isLoading: true,
            current_page: 1
        });
        this.loadProducts();
    },

    async onPullDownRefresh() {
        this.setData({
            products: [],
            isLoading: true,
            current_page: 1,
        });
        await this.loadProducts();
        wx.stopPullDownRefresh();
    },

    async onReachBottom() {
        let { current_page, total_pages } = this.data;
        if (current_page > total_pages) { return }
        if (this.data.fetchProductListStatus === 'Success') {
            this.loadProducts();
        }
    },

    onShareAppMessage: onDefaultShareAppMessage,
});
