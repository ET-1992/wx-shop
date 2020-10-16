import api from 'utils/api';
import { parseScene, go, autoNavigate_, valueToText, updateTabbar } from 'utils/util';
import { showModal } from 'utils/wxp';
import { CONFIG } from 'constants/index';
// 获取应用实例
const app = getApp();

Component({
    properties: {
        productsList: {
            type: Object,
            value: {},
            observer(newVal) {
                console.log('productsList', newVal);
                if (!newVal) { return }
                const { content, setting, title, type, id } = newVal;
                this.setData({
                    scrollLeft: 0,
                    content,
                    setting,
                    title,
                    type,
                    id
                });
            }
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
        products: {
            type: Array,
            value: [],
            observer(newVal) {
                if (!newVal || !newVal.length) { return }
                const { products, isLastModule, content = [] } = this.data;
                // const newContent = content.concat(products);
                if (isLastModule) {
                    this.setData({
                        content: products
                    });
                }
            }
        },
        isLastModule: {
            type: Boolean,
            value: false,
        }
    },

    data: {
        content: [],
        setting: {
            margin: 0,
            title_display: false,
            title_position: 'left',
            style: 'per_2',
            orderby: 'post_date'
        },
        isShowSkuModal: false,
        selectedProduct: {},
    },

    lifetimes: {
        attached: function() {
            const config = wx.getStorageSync(CONFIG) || app.globalData.config;
            this.setData({ config });
        },
    },

    methods: {
        goMore() {
            const { setting = {}, id } = this.data;
            const { orderby = '', product_category_id = '', promotion_type = '' } = setting;
            let promotionUrl = '/pages/miaoshaList/miaoshaList',
                originalPath = '/pages/productList/productList',
                paramsStr = `?module_id=${id}&orderby=${orderby}&categoryId=${product_category_id}`;

            promotionUrl += paramsStr;
            originalPath += paramsStr;

            let pathUrl = '';
            let pagePath = {
                'groupon_enable': () => { pathUrl = promotionUrl + '&type=groupon' },
                'bargain_enable': () => { pathUrl = promotionUrl + '&type=bargain' },
                'seckill_enable': () => { pathUrl = promotionUrl + '&type=seckill' },
                'miaosha_enable': () => { pathUrl = promotionUrl + '&type=miaosha' },
                'membership_dedicated_enable': () => { pathUrl = originalPath + '&memberExclusive=true&promotionType=membership_dedicated_enable' },
                'membership_price_enable': () => { pathUrl = originalPath + '&promotionType=membership_price_enable' },
            };
            if (promotion_type) {
                pagePath[promotion_type].call(this);
            }
            let finalUrl = pathUrl || originalPath;
            console.log('跳转finalUrl', finalUrl);
            autoNavigate_({ url: finalUrl });
        },

        // 首页商品模块可直接加车
        /* 加车 */
        async addCart(product) {
            console.log('e214', product);
            wx.showLoading({ title: '加车中' });
            let { vendor } = app.globalData;
            let { id, stock } = product;
            if (stock === 0) {
                await showModal({
                    title: '温馨提示',
                    content: '商品库存为0',
                });
                return;
            }
            let options = {};

            options.post_id = id;
            options.sku_id = product.sku_id || 0; // 多规格
            options.shipping_type = product.shipping_type;
            options.quantity = product.quantity || 1;
            options.vendor = vendor;
            options.form_id = this.data.formId;

            try {
                const data = await api.hei.addCart(options);
                wx.hideLoading();
                this.setData({ isShowSkuModal: false });
                wx.setStorageSync('CART_NUM', data.count);
                wx.showToast({
                    icon: 'success',
                    title: `已加入购物车`,
                });
                updateTabbar({ tabbarStyleDisable: true, pageKey: 'cart' });
            } catch (ev) {
                console.log('ev', ev);
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
        isShowSkuModal(product) {
            this.setData({
                isShowSkuModal: true,
                selectedProduct: product
            });
        },

        // 单规格 且 配送方式只有一种时 直接 加入购物车
        // 多规格 或 多种配送方式 显示弹窗选择 配送方式 或 规格
        singleAddCart(e) {
            let product = {};

            product = e.currentTarget.dataset.product ? e.currentTarget.dataset.product : e.detail.product;
            console.log('singleAddCartproduct', product);
            if ((product.shipping_types && product.shipping_types.length === 1)) {
                product.shipping_type = product.shipping_types[0];
            }

            if ((product.shipping_types && product.shipping_types.length > 1) || (product.skus && product.skus.length > 0)) {
                this.isShowSkuModal(product);
            } else {
                console.log('singleAddCartproduct', product);
                this.addCart(product);
            }
        },

        // skuModel 弹窗返回数据
        onAddCart(e) {
            console.log('e211', e);
            this.addCart(e.detail);
        }
    }
});