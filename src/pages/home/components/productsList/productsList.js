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

        // 加入购物车
        async singleAddCart(e) {
            let product = {};
            product = e.currentTarget.dataset.product ? e.currentTarget.dataset.product : e.detail.product;
            // 不能加车商品
            let { individual_buy, id } = product;
            if (individual_buy) {
                wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${id}` });
                return;
            }
            this.triggerEvent('add-cart', { product }, { bubbles: true, composed: true });
        },
    }
});