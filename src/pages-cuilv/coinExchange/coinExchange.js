import { go } from 'utils/util';
import api from 'utils/api';
import { CONFIG } from 'constants/index';

Page({
    data: {
        title: 'coinExchange',
        isLoading: true,
        products: [],
        searchContent: '',  // 搜索内容
        categories: [],
        optionType: [
            { text: '全部商品', value: 0 },
        ],
        optionSort: [
            { text: '默认排序', value: 'a' },
        ],
        optionTypeValue: 0,
        categoryType: 0,  // 分类请求类型
        optionSortValue: 'a',
        categorySort: 'a',  // 分类请求排序
        order: '',   // 排序升降字段
        orderby: '',   // 排序类型字段
        config: {},
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = getApp().globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ themeColor, config });
        wx.setNavigationBarTitle({
            title: `${(config.coin_name || '金彩')}兑换`
        });
        this.getListData();
    },

    go,

    async getListData() {
        this.setData({ isLoading: true });
        let { categoryType, order, orderby, searchContent } = this.data;
        const COINPRODUCT = 4;
        const data = await api.hei.fetchProductList({
            product_type: COINPRODUCT,
            product_category_id: categoryType,
            order,
            orderby,
            s: searchContent,
        });
        let { products, categories } = data;
        this.setData({
            isLoading: false,
            categories,
            products,
        });
        this.addTypeOptions();
        this.addSortOptions();
    },

    // 添加类型选项
    addTypeOptions() {
        let { categories, optionType } = this.data;
        if (optionType.length > 1) return;
        // 筛选分类信息
        categories.forEach(item => {
            let obj = { text: item.name, value: item.id };
            optionType.push(obj);
        });
        this.setData({ optionType });
    },

    // 类型选择
    onTypeChange(e) {
        console.log('e', e.detail);
        this.setData({ categoryType: e.detail });
        this.getListData();
    },

    // 添加排序选项
    addSortOptions() {
        let { config, optionSort } = this.data;
        let name = config.coin_name || '金彩';
        if (optionSort.length > 1) return;
        optionSort.push(
            { text: `${name}降序`, value: 'b' },
            { text: `${name}升序`, value: 'c' },
        );
        this.setData({ optionSort });
    },

    // 排序选择
    onSortChange(e) {
        console.log('e', e.detail);
        let categorySort = e.detail,
            orderby = '',
            order = '';
        // 金币降序
        if (categorySort === 'b') {
            orderby = 'coin_fee';
            order = 'DESC';
        }
        // 金币升序
        if (categorySort === 'c') {
            orderby = 'coin_fee';
            order = 'ASC';
        }
        this.setData({
            categorySort,
            orderby,
            order,
        });
        this.getListData();
    },

    // 搜索栏变化
    onSearchChange(e) {
        this.setData({ searchContent: e.detail });
    },
});
