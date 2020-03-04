import api from 'utils/api';
import { parseScene, go, autoNavigate_ } from 'utils/util';
// 获取应用实例
const app = getApp();

Component({
    properties: {
        productsList: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title, type, id, args = 'product_category_id=44&product_category_parent=44' } = newVal;
                this.setData({
                    content,
                    setting,
                    title,
                    type,
                    id,
                    args
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
        }
    },

    data: {
        next_cursor: 0,
        last_cursor: 0,
        isProductBottom: false,
    },

    attached() {
        this.init();
    },

    methods: {
        goMore() {
            const { setting, id } = this.data;
            if (setting.promotion_type === 'groupon_enable') {
                autoNavigate_({url: '/pages/miaoshaList/miaoshaList?type=groupon&module_id=' + id })
            }
            if (setting.promotion_type === 'bargain_enable') {
                autoNavigate_({url: '/pages/miaoshaList/miaoshaList?type=bargain&module_id=' + id })
            }
            if (setting.promotion_type === 'miaosha_enable') {
                autoNavigate_({url: '/pages/miaoshaList/miaoshaList?type=miaosha&module_id=' + id })
            }
            if (!setting.promotion_type) {
                autoNavigate_({url: '/pages/loadProduct/loadProduct?module_id=' + id })
            }
        },

        init() {
            let products = this.data.content;
            if (products && products[products.length - 1]) {
                let next_cursor = products[products.length - 1].timestamp;
                this.setData({
                    next_cursor: next_cursor
                });
            } else {
                this.setData({
                    next_cursor: 0
                });
            }
        },

        async loadProducts() {
            const { next_cursor, content: products, modules } = this.data;
            let hack = {};
            // if (modules && modules.length && modules[modules.length - 1] && modules[modules.length - 1].args) {
            //     hack = parseScene(modules[modules.length - 1].args);
            // }
            const data = await api.hei.fetchProductList({
                cursor: next_cursor,
                // ...hack
            });
            this.data.isProductBottom = false;
            const newProducts = products.concat(data.products);
            this.setData({
                content: newProducts,
                next_cursor: data.next_cursor,
                last_cursor: this.data.next_cursor
            });
            console.log(this.data);
            return data;
        },

        /* 无限加载 */
        async showProducts() {
            const { windowHeight } = app.systemInfo;
            const rect = await this.getDomRect('loadProducts');
            if (rect.top && (rect.top <= windowHeight - 30) && !this.data.isProductBottom) {
                const { next_cursor } = this.data;
                this.data.isProductBottom = true; // 判断是否触底并且执行了逻辑
                if (next_cursor !== 0) {
                    this.loadProducts();
                }
            }
        },

        getDomRect(id) {
            return new Promise((resolve, reject) => {
                wx.createSelectorQuery().select(`#${id}`).boundingClientRect((rect) => {
                    resolve(rect);
                }).exec();
            });
        },
    }
});