import api from 'utils/api';

Component({
    properties: {
        categoryProducts: {
            type: Object,
            value: {},
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
    },
    data: {
        productList: {},  // 商品列表数据
        setting: {},  // 标题设置
        title: '',  // 标题文字
        titleDisplay: false,  // 标题显隐
        currentIndex: 0,  // 导航选中项
        categories: [],  // 分类导航列表
        newProducts: [],  // 选中商品列表
        selectedId: [],  // 选中类型id
    },
    lifetimes: {
        attached: function () {
            let { productList } = this.data;
            console.log('productList', productList);
        },
    },
    observers: {
        'categoryProducts': function(value) {
            let titleDisplay = false;
            let { setting = {}, title } = value;
            let { title_display = false, categories = [] } = setting;
            if (title_display) {
                // 隐藏商品列表的标题
                titleDisplay = value.setting.title_display;
                value.setting.title_display = false;
                value.setting.more = true;
            }
            this.setData({
                productList: value,
                titleDisplay,
                setting,
                title,
                categories,
            });
        }
    },
    methods: {
        // 点击标签栏
        onClickBtn(e) {
            let { currentIndex } = this.data;
            let { index, id } = e.currentTarget.dataset;
            if (currentIndex === index) {
                return;
            }
            this.loadProducts(id);
            this.setData({ currentIndex: index });
        },

        // 获取标签商品列表
        async loadProducts(id) {
            let { orderby = '' } = this.data.setting;
            let options = {
                product_category_id: id,
                orderby,
            };
            try {
                let data = await api.hei.fetchProductList(options);
                let { products: newProducts } = data;
                this.setData({ newProducts });
                this.updateProducts(id);
            } catch (e) {
                console.log('分组商品列表请求出错，出错提示：', e);
            }
        },

        // 更新商品列表
        updateProducts(id) {
            let { productList, newProducts } = this.data;
            productList.content = newProducts;
            productList.setting.product_category_id = id;
            this.setData({
                productList,
            });
        },
    }
});

