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
        sortText: [
            'default',
            'price',
            'total_sales'
        ],
        sortStatus: {
            'Up': 'asc',
            'Down': 'desc'
        }
    },

    async onLoad({ categoryId = '', categoryParent, memberExclusive, orderby }) {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);

        const { style_type: tplStyle = 'default' } = config;
        const { sortText, filterData } = this.data;

        const index = sortText.findIndex(item => item === orderby);

        filterData.filterIndex = index > -1 ? index : 0;
        this.setData({
            categoryId,
            categoryParent,
            config,
            memberExclusive,
            filterData
        });
        await this.loadProducts();
        const { categories = [] } = this.data;
        let navbarListData = [];
        let activeIndex;
        let parentCategory = [];

        if (categories.length <= 1) {
            wx.setNavigationBarTitle({ title: parentCategory.name || (memberExclusive ? '会员商品' : '商品列表') });
            parentCategory = categories[0] && categories[0].children;
        } else {
            wx.setNavigationBarTitle({ title: this.data.page_title || (memberExclusive ? '会员商品' : '商品列表') });
            parentCategory = categories;
        }

        parentCategory && parentCategory.forEach((item) => {
            navbarListData.push({
                text: item.name,
                value: item.id
            });
        });
        navbarListData.unshift({ text: '全部', value: parentCategory.id });
        activeIndex = navbarListData.findIndex((item) => {
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

    // 列表导航模块
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

    // 列表筛选模块
    changeFilterList(e) {
        console.log(e);
        this.setData({
            filterData: e.detail,
            current_page: 1,
            products: [],
            isLoading: true
        }, this.loadProducts);
    },
    // filterProduct() {
    //     const { filterData, sortText, sortStatus } = this.data;
    //     this.setData({
    //         filterOrderby: sortText[filterData.filterIndex],
    //         filterOrder: sortStatus[filterData.filterType]
    //     }, this.loadProducts);
    // },

    // 加载商品列表
    async loadProducts() {
        let { current_page, categoryId = '', products, categoryParent = '', memberExclusive, filterData, sortText, sortStatus } = this.data;
        let options = {
            paged: current_page,
            product_category_id: categoryId,
            product_category_parent: categoryParent,
            promotion_type: memberExclusive ? 'membership_dedicated_enable' : '',
        };
        if (filterData.filterIndex) {
            options.orderby = sortText[filterData.filterIndex];
            options.order = sortStatus[filterData.filterType];
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
