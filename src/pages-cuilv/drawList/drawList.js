import { go } from 'utils/util';
import api from 'utils/api';

Page({
    data: {
        title: 'drawList',
        isLoading: true,
        products: [],
        searchContent: '',  // 搜索内容
        categories: [],
        optionType: [
            { text: '全部商品', value: 0 },
        ],
        optionSort: [
            { text: '默认排序', value: 'a' },
            // { text: '金币降序', value: 'b' },
            // { text: '金币升序', value: 'c' },
            { text: '价值降序', value: 'd' },
            { text: '价值升序', value: 'e' },
        ],
        optionTypeValue: 0,
        categoryType: 0,  // 分类请求类型
        optionSortValue: 'a',
        categorySort: 'a',  // 分类请求排序
        order: '',   // 排序升降字段
        orderby: '',   // 排序类型字段
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = getApp().globalData;
        this.setData({ themeColor });
        this.getListData();
    },

    go,

    // 获取列表数据
    async getListData() {
        this.setData({ isLoading: true });
        let { categoryType, order, orderby, searchContent } = this.data;
        const data = await api.hei.fetchCoinProductList({
            product_category_id: categoryType,
            order,
            orderby,
            s: searchContent,
        });
        let { products = [], categories = [] } = data;
        this.setData({
            isLoading: false,
            categories,
            products,
        });
        this.addTypeOptions();
    },

    // 加入心愿单
    async addCloudCart(e) {
        let { postId: post_id, blogId: source_blog_id } = e.currentTarget.dataset;
        try {
            await api.hei.addCart({ post_id, source_blog_id });
            wx.hideToast();
            wx.showToast({
                title: '成功添加',
                icon: 'success',
            });
        } catch (error) {
            console.log('error', error);
        }
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

    // 排序选择
    onSortChange(e) {
        console.log('e', e.detail);
        let categorySort = e.detail,
            orderby = '',
            order = '';
        // 金币降序
        if (categorySort === 'b') {
            orderby = 'unit_price';
            order = 'DESC';
        }
        // 金币升序
        if (categorySort === 'c') {
            orderby = 'unit_price';
            order = 'ASC';
        }
        // 价值降序
        if (categorySort === 'd') {
            orderby = 'luckydraw_price';
            order = 'DESC';
        }
        // 价值升序
        if (categorySort === 'e') {
            orderby = 'luckydraw_price';
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
