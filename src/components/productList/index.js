Component({
    properties: {
        products: {
            type: Array,
            value: [],
        },

        product: {
            type: Object,
            value: {},
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
            value: '',
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
