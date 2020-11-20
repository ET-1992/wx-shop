// behaviorSku.js

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
        currentSku: [],  // 选中SKU
        selectedSku: {},
        skuMap: {},
        currentSpecial: {},  // 选中规格
        currentRelation: {},  // 选中增值规格
        shipping_type: '1',  // 选中物流
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
            let { currentSku, selectedSku, skuMap, currentSpecial, currentRelation } = e.detail;
            this.setData({
                currentSku,
                selectedSku,
                skuMap,
                currentSpecial,
                currentRelation,
            });
        },

        // 物流选择回调
        radioChange(e) {
            let { shipping_type } = e.detail;
            this.setData({ shipping_type });
            this.triggerEvent('getShippingType', { shipping_type }, { bubbles: true });
        },

        // 表单提交
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
    }
});