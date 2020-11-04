import { CONFIG } from 'constants/index';
import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

const app = getApp();

export const pageObj = {
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
        },
        // 促销方式
        promotionType: '',
        productsList: {
            setting: {
                style: 'per_2',
                margin: 0,
                title_display: false,
                more: false
            },
            title: '',
            id: 0,
            type: 'product'
        }
    },

    async onLoad(params) {
        let {
            categoryId = '',
            categoryParent = 0,
            memberExclusive = false,
            orderby,
            promotionType = '',
        } = params;
        wx.showLoading({
            title: '加载中',
            mask: true
        });

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
            promotionType,
            filterData
        });
        await this.loadProducts();
        const { categories = [] } = this.data;
        let navbarListData = [];
        let activeIndex;
        let parentCategory = [];

        let allId = '';

        if (categories.length <= 1) {
            wx.setNavigationBarTitle({ title: parentCategory.name || (memberExclusive ? '会员商品' : '商品列表') });
            parentCategory = categories[0] && categories[0].children;
            allId = categories[0] && categories[0].id;
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
        navbarListData.unshift({ text: '全部', value: allId });
        activeIndex = navbarListData.findIndex((item) => {
            return item.value === Number(categoryId);
        });
        if (activeIndex < 0) {
            activeIndex = 0;
        }

        this.setData({
            themeColor,
            tplStyle,
            globalData: app.globalData,
            navbarListData,
            activeIndex
        });
        wx.hideLoading();
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
        let { current_page, categoryId = '', products, categoryParent = '', promotionType, memberExclusive, filterData, sortText, sortStatus } = this.data;
        // 兼容会员中心会员商品
        if (!promotionType && memberExclusive) {
            promotionType = 'membership_dedicated_enable';
        }
        let options = {
            paged: current_page,
            product_category_id: categoryId,
            product_category_parent: categoryParent,
            promotion_type: promotionType,
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
            isLoading: false,
            'productsList.content': data.products
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

    onShareAppMessage() {
        const { categoryId } = this.data;
        return onDefaultShareAppMessage.call(this, {
            categoryId
        });
    },
};

Page(pageObj);
