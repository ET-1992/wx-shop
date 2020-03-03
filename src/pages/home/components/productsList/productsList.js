import api from 'utils/api';
import { parseScene, go } from 'utils/util';

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
        last_cursor: 0
    },

    attached() {
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

    methods: {
        go,

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
    }
});