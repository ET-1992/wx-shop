import { PRODUCT_LAYOUT_STYLE } from 'constants/index';
Component({
    properties: {
        products: {
            type: Array,
            value: [],
        },
        themeColor: {
            type: Object,
            value: {},
        },
        modules: {
            type: Object,
            value: {},
        },
        productLayoutStyle: {
            type: String,
            value: PRODUCT_LAYOUT_STYLE[0],
        },
        nextCursor: {
            type: Number,
            value: 0,
            observer(newVal) {
                console.log(newVal);
            }
        },
    },
    data: {
        nowTS: Date.now() / 1000,
    }
});
