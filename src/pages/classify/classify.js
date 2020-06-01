import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { showModal } from 'utils/wxp';
import { CONFIG, SHIPPING_TYPE } from 'constants/index';
import { updateTabbar, valueToText } from 'utils/util';
const app = getApp();
Page({
    data: {
        selectedIndex: 0,
        subSelectedIndex: 0,
        toMainCategory: 0,
        toSubCategory: 0,

        filterListData: [
            { name: '价格' },
            { name: '销量' },
        ],
        filterData: {
            filterIndex: 2, // 控制箭头位置 还有 sortText排序
            filterType: 'Down' // 控制箭头上下 还有 sortStatus排序顺序
        },
        next_cursor: 0,
        products: [],
        selectedProduct: {},
        isShowCouponList: false,
        current_page: 1,
        isLoading: true,
        hasProducts: true,
        isShowPopup: false,
        sortText: [
            'price',
            'total_sales',
            'default'
        ],
        sortStatus: {
            'Up': 'asc',
            'Down': 'desc'
        },
        config: {},
        multiStoreEnable: false,  // 判断店铺多门店开关
        isStoreFinish: false,  // 判断店铺多门店ID是否已获取
    },

    async onLoad() {
        const { themeColor } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        this.setData({
            isIphoneX,
            themeColor,
            tplStyle,
            globalData: app.globalData,
            config,
            isLoading: false,
        });
    },

    async onShow() {
        updateTabbar({ pageKey: 'product_classify' });

        // setTimeout(() => {
        //     this.setData({
        //         multiStoreEnable: true
        //     });
        // }, 6000);
        this.loadAllData();


    },

    async loadAllData() {
        let { isStoreFinish, config = {}} = this.data;
        let multiStoreEnable = Boolean(config.offline_store_enable);

        this.setData({
            multiStoreEnable
        });

        // 多门店模式，未获取门店ID
        if (multiStoreEnable && !isStoreFinish) {
            return;
        }
        const { categories } = await api.hei.fetchCategory();
        this.setData({
            categories,
            current_page: 1,
            products: [],
        });
        await this.loadProducts();
        const data = await api.hei.fetchCartList();
        this.reloadCart(data);
    },

    changeFilterList(e) {
        console.log('e56', e);
        this.setData({
            filterData: e.detail,
            current_page: 1,
            products: [],
            hasProducts: true
        }, this.loadProducts);
    },

    async loadProducts() {
        let { categories, selectedIndex, subSelectedIndex, current_page, products, filterData, sortText, sortStatus } = this.data;
        let options = {
            paged: current_page,
            product_category_parent: categories[selectedIndex].id
        };
        if (subSelectedIndex > 0) {
            options.product_category_id = categories[selectedIndex].children[subSelectedIndex - 1].id;
        } else {
            options.product_category_id = categories[selectedIndex].id;
        }

        options.orderby = sortText[filterData.filterIndex];
        options.order = sortStatus[filterData.filterType];

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
            hasProducts: false,
            share_image: productData.share_image,
            share_title: productData.share_title,
        });

        this.setDefinePrice();
    },

    setDefinePrice() {
        const { products } = this.data;
        const now = Math.round(Date.now() / 1000);
        products.forEach(product => {
            product.definePrice = 0;

            if (product.groupon_enable) {
                product.definePrice = product.groupon_commander_price ? product.groupon_commander_price : product.groupon_price;
                product.showOriginalPrice = product.groupon_price !== product.original_price;
            } else if (product.miaosha_enable && !(now > product.miaosha_end_timestamp) && (now > product.miaosha_start_timestamp)) {
                product.definePrice = product.miaosha_price;
                product.showOriginalPrice = product.miaosha_price !== product.original_price;
            } else if (product.seckill_enable && !(now > product.miaosha_end_timestamp) && (now > product.miaosha_start_timestamp)) {
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
            hasProducts: true,
            filterData: {
                filterIndex: 2,
                filterType: 'Down'
            }
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
    // skuModel 弹窗返回数据
    onAddCart(e) {
        this.addCart(e.detail);
        console.log('e209', e.detail);
    },

    /* 加车 */
    async addCart(e) {
        console.log('e214', e);
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
        options.sku_id = e.sku_id || 0; // 多规格
        options.shipping_type = e.shipping_type;
        options.quantity = e.quantity || 1; // 商品数量
        options.vendor = vendor;
        options.form_id = this.data.formId;

        let shippingText = valueToText(SHIPPING_TYPE, Number(e.shipping_type));
        try {
            const data = await api.hei.addCart(options);
            wx.showToast({
                icon: 'none',
                title: `加入${shippingText}成功`,
            });
            this.reloadCart(data);
            wx.setStorageSync('CART_NUM', data.count);
            updateTabbar({ tabbarStyleDisable: true, pageKey: 'product_classify' });
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

    // 选规格弹窗
    isShowSkuModal(e) {
        const { product } = e.currentTarget.dataset;
        this.setData({
            isShowSkuModal: true,
            selectedProduct: product
        });
    },

    // leftImage 组件 单规格且配送方式只有一种 直接 加入购物车
    // 单规格但多种配送方式 显示弹窗选择 配送方式
    // singleAddCart(e) {
    //     console.log('e262', e);
    //     const { product } = e.currentTarget.dataset;
    //     if (product.shipping_types && (product.shipping_types.length === 1)) {
    //         e.shipping_type = product.shipping_types[0];
    //         this.addCart(e);
    //     } else {
    //         this.isShowSkuModal(e);
    //     }
    // },

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
    onShareAppMessage: onDefaultShareAppMessage,

    // 选择门店刷新页面
    async updateStoreData() {
        this.setData({
            isStoreFinish: true
        });
        await this.loadAllData();
    },
});
