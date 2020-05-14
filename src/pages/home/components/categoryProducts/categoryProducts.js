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
        categories: [],  // 分类导航列表
        newProducts: [],  // 选中商品列表
        currentIndex: 0,  // 导航选中项
        currentId: '',  // 选中类型id
    },
    lifetimes: {
        attached: function () {
            let { themeColor } = this.data;
            console.log('themeColor', themeColor);
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
            this.setData({
                currentIndex: index,
                currentId: id,
            });
            this.loadProducts();
        },

        // 获取标签商品列表
        async loadProducts() {
            let { currentId } = this.data;
            let { orderby = '', number, style } = this.data.setting;
            let options = {
                product_category_id: currentId,
                posts_per_page: number,
                style,
                orderby,
            };
            try {
                let data = await api.hei.fetchProductList(options);
                let { products: newProducts } = data;
                this.setData({ newProducts });
                this.updateProducts();
            } catch (e) {
                console.log('分组商品列表请求出错，出错提示：', e);
            }
        },

        // 更新商品列表
        updateProducts() {
            let { productList, newProducts, currentId } = this.data;
            productList.content = newProducts;
            productList.setting.product_category_id = currentId;
            this.setData({
                productList,
            });
        },
    }
});

