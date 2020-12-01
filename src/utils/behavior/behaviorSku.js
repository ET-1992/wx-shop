let pageShare = require('utils/pageShare');

/* eslint-disable-next-line no-undef */
module.exports = Behavior({
    behaviors: [],
    properties: {
        product: {
            type: Object,
            value: {},
        },
    },
    data: {
        selectedOptions: {},  // 所有选中内容和总价
        currentSku: [],  // 选中SKU
        selectedSku: {},
        skuMap: {},
        currentSpecial: {},  // 选中规格
        currentRelation: {},  // 选中增值规格
    },

    created: function () {
        console.log('[behaviorSku] created');
    },
    attached: function () {
        console.log('[behaviorSku] attached');
    },
    ready: function () {
        console.log('[behaviorSku] ready');
    },

    methods: {

        // 商品规格回调
        onOptionSelect(e) {
            let { currentSku, selectedSku, skuMap, currentSpecial, currentRelation } = e.detail,
                { product, product: { related_product }} = this.data;

            let price = Number(selectedSku.price || product.price);
            if (currentRelation.length) {
                let flatProducts = related_product.flatMap(item => item.value);
                price = currentRelation.reduce((acc, { value }) => {
                    let product = flatProducts.find(({ title }) => title === value);
                    return acc + Number(product ? product.price : 0);
                }, price);
            }
            let content = [...currentSku, ...currentSpecial, ...currentRelation].reduce((acc, { value }) => {
                return value ? acc + value + ';' : acc;
            }, '');
            let selectedOptions = { price, content };

            this.setData({
                currentSku,
                selectedSku,
                skuMap,
                currentSpecial,
                currentRelation,
                selectedOptions,
            });
            this.triggerEvent('option-change', selectedOptions);
        },

        // 物流选择回调
        getShippingType(e) {
            let { shipping_type } = e.detail;
            this._shipping_type = shipping_type;
            this.triggerEvent('shipping-change', { shipping_type });
        },

        // 表单提交验证
        onFormConfirm() {
            let { product, selectedSku } = this.data;
            let title = '';
            if (product.skus && product.skus.length) {
                let { id, stock } = selectedSku;
                if (!id) {
                    title = '请选择必要的商品规格';
                } else if (stock === 0) {
                    title = '无法购买库存为0的商品';
                }
            }
            if (!title) { return }
            // 报错
            wx.showToast({ title, icon: 'none', duration: 2000 });
            throw new Error(title);
        },

        // 创建订单信息
        getCurrentOrder() {
            let { product, selectedSku, quantity, currentSpecial, currentRelation, selectedOptions } = this.data;
            let { _shipping_type } = this;
            let currentOrder = pageShare.createCurrentOrder({
                product,
                selectedSku,
                quantity,
                currentSpecial,
                currentRelation,
                shipping_type: _shipping_type,
                selectedOptions,
            });
            this._currentOrder = currentOrder;
        },
    }
});