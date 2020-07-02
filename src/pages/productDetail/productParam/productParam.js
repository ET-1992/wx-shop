const app = getApp();
Component({
    properties: {
        title: {
            type: String,
            value: '参数',
        },
        product: {
            type: Object,
            value: {}
        },
        type: {
            type: String,
            value: 'default'
        }
    },
    data: {
        global_Data: {},
        isShowProductParam: false,
        paramKeys: ''
    },
    attached() {
        this.setData({
            global_Data: app.globalData
        });
        const { product } = this.data;
        if (product.attributes) {
            const { attributes } = product;
            this.getAllParamKey(attributes);
        }
    },
    methods: {
        popupShow() {
            this.triggerEvent('showProductParam', { isShowProductParam: true });
        },
        // 获得产品参数的所有标题
        getAllParamKey(params) {
            let keys = params.map((item) => {
                return item.key;
            });
            let paramKeys = keys.join(' ');
            this.setData({
                paramKeys
            });
        }
    }
});