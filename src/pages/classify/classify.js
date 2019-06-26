import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { showModal } from 'utils/wxp';
import { CONFIG } from 'constants/index';
import { updateCart } from 'utils/util';
const app = getApp();
Page({
    data: {
        selectedIndex: 0,
        subSelectedIndex: 0,
        toMainCategory: 0,
        toSubCategory: 0,

        filterListData: [{ name: '销量' }, { name: '价格' }],
        filterData: {
            filterIndex: 0,
            filterType: 'Down'
        },
        next_cursor: 0,
        products: [],
        selectedProduct: {},
        isShowCouponList: false,
        current_page: 1,
        isLoading: true,
        hasProducts: true,
        isShowPopup: false
    },

    async onLoad() {
        const { themeColor } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;

        const { categories } = await api.hei.fetchCategory();

        this.setData({
            categories,
            isIphoneX,
            themeColor,
            tplStyle,
            globalData: app.globalData,
            config,
            isLoading: false,
        });

        await this.filterProduct();
    },

    async onShow() {
        const data = await api.hei.fetchCartList();
        this.reloadCart(data);
    },

    changeFilterList(e) {
        this.setData({
            filterData: e.detail,
            current_page: 1,
            products: [],
            hasProducts: true
        }, this.filterProduct);
    },
    filterProduct() {
        const { filterData } = this.data;
        const sortText = {
            1: 'price',
            0: 'total_sales'
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
        let { categories, selectedIndex, subSelectedIndex, current_page, filterOrderby, filterOrder, products } = this.data;
        let options = {
            paged: current_page,
            product_category_parent: categories[selectedIndex].id
        };
        if (subSelectedIndex > 0) {
            options.product_category_id = categories[selectedIndex].children[subSelectedIndex - 1].id;
        } else {
            options.product_category_id = categories[selectedIndex].id;
        }
        if (filterOrderby) {
            options.orderby = filterOrderby;
        }
        if (filterOrder) {
            options.order = filterOrder;
        }

        this.data.fetchProductListStatus = 'Pending';

        const productData = await api.hei.fetchProductList(options);
        current_page++;

        this.data.fetchProductListStatus = 'Success';

        if (products.length > 0) {
            productData.products = products.concat(productData.products);
        }

        this.setData({
            products: productData.products,
            current_page,
            total_pages: productData.total_pages,
            hasProducts: false
        });

        this.setDefinePrice();
    },

    setDefinePrice() {
        const { products } = this.data;
        const now = Math.round(Date.now() / 1000);
        products.forEach(product => {
            product.definePrice = 0;

            if (product.groupon_enable === '1') {
                product.definePrice = product.groupon_commander_price ? product.groupon_commander_price : product.groupon_price;
                product.showOriginalPrice = product.groupon_price !== product.original_price;
            } else if (product.miaosha_enable === '1' && !(now > product.miaosha_end_timestamp) && (now > product.miaosha_start_timestamp)) {
                product.definePrice = product.miaosha_price;
                product.showOriginalPrice = product.miaosha_price !== product.original_price;
            } else if (product.seckill_enable === '1' && !(now > product.miaosha_end_timestamp) && (now > product.miaosha_start_timestamp)) {
                product.definePrice = product.seckill_price;
                product.showOriginalPrice = product.seckill_price !== product.original_price;
            } else {
                product.definePrice = product.price;
                product.showOriginalPrice = product.price !== product.original_price;
            }
        });
        this.setData({
            products,
        });
    },

    async reloadCart(data) {
        const { count, counts = {}, items } = data;

        let items_counts = {};
        items.forEach((item) => {
            items_counts[item.post_id] = item.quantity;
        });

        this.setData({
            counts,
            items_counts,
            items,
            count,
            isShowSkuModal: false
        });
    },

    /* 一级标题 */
    async onMainCategoryItemClick(ev) {
        const { index } = ev.currentTarget.dataset;
        this.setData({
            selectedIndex: index,
            subSelectedIndex: 0,
            toMainCategory: index,
            toSubCategory: 0,
            products: [],
            current_page: 1,
            hasProducts: true
        });
        this.loadProducts();
    },
    /* 二级标题 */
    onSubCategoryItemClick(ev) {
        const { index } = ev.currentTarget.dataset;
        this.setData({
            products: [],
            subSelectedIndex: index,
            toSubCategory: index,
            current_page: 1,
            hasProducts: true
        });
        this.loadProducts();
    },

    /* 商品列表滚动 */
    subContentScroll(ev) {
        //
    },

    /* 商品列表触底 */
    subScrolltolower() {
        console.log('触底');
        let { current_page, total_pages } = this.data;
        if (current_page > total_pages) { return }
        console.log(this.data.fetchProductListStatus, 'fetchProductListStatus');
        if (this.data.fetchProductListStatus === 'Success') {
            this.loadProducts();
        }
    },

    onFormSubmit(ev) {
        const { formId } = ev.detail;
        this.setData({ formId });
    },

    onAddCart(e) {
        this.addCart(e.detail);
    },

    /* 加车 */
    async addCart(e) {
        let { vendor } = app.globalData;
        let { id, stock } = e.currentTarget.dataset;
        if (stock === 0) {
            await showModal({
                title: '温馨提示',
                content: '商品库存为0',
            });
            return;
        }
        let options = {};

        options.post_id = id;
        options.sku_id = e.sku_id || 0;
        options.quantity = 1;
        options.vendor = vendor;
        options.form_id = this.data.formId;
        try {
            const data = await api.hei.addCart(options);
            wx.showToast({
                icon: 'none',
                title: '加入成功',
            });
            this.reloadCart(data);
            wx.setStorageSync('CART_NUM', String(data.count));
            const { categoryIndex } = app.globalData;
            updateCart(categoryIndex);
        } catch (ev) {
            if (ev.code === 'system_error') {
                return;
            }
            await showModal({
                title: '温馨提示',
                content: ev.errMsg,
            });
        }
    },

    isShowSkuModal(e) {
        const { product } = e.currentTarget.dataset;
        this.setData({
            isShowSkuModal: true,
            selectedProduct: product
        });
    },

    touchstart(e) {
        this.data.clineX = e.touches[0].clientX;
    },
    touchend(e) {
        let ev;
        let { subSelectedIndex, selectedIndex, categories } = this.data;
        // next
        if (e.changedTouches[0].clientX - this.data.clineX < -120) {
            if (subSelectedIndex === categories[selectedIndex].children.length) {
                ev = {
                    currentTarget: {
                        dataset: {
                            index: 0,
                        },
                    },
                };
            } else {
                ev = {
                    currentTarget: {
                        dataset: {
                            index: subSelectedIndex + 1,
                        },
                    },
                };
            }
            this.onSubCategoryItemClick(ev);
        }
        // pre
        if (e.changedTouches[0].clientX - this.data.clineX > 120) {
            if (subSelectedIndex === 0) {
                return;
            } else {
                ev = {
                    currentTarget: {
                        dataset: {
                            index: subSelectedIndex - 1,
                        },
                    },
                };
                this.onSubCategoryItemClick(ev);
            }
        }
    },
    onShareAppMessage: onDefaultShareAppMessage
});