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
                { product, product: { related_product, miaosha_enable }} = this.data;

            let price = Number(selectedSku.price || product.price) * 100;
            if (miaosha_enable) {
                let { miaosha_end_timestamp, miaosha_start_timestamp, miaosha_price } = product;
                const now = Math.round(Date.now() / 1000);
                if (now >= miaosha_start_timestamp && now < miaosha_end_timestamp) {
                    price = Number(miaosha_price) * 100;
                }
            }
            let relationPrice = 0;
            if (currentRelation.length) {
                let flatProducts = related_product.flatMap(item => item.value);
                relationPrice = currentRelation.reduce((acc, { value }) => {
                    let product = flatProducts.find(({ title }) => title === value);
                    return acc + Number(product ? product.price * 100 : 0);
                }, 0);
            }
            price = (price + relationPrice) / 100;
            relationPrice = relationPrice / 100;

            let content = [...currentSku, ...currentSpecial, ...currentRelation].reduce((acc, { value }) => {
                return value ? acc + value + ';' : acc;
            }, '');
            let selectedOptions = { price, content, relationPrice };

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
            let { product } = this.data;
            let { shipping_type } = e.detail;
            if (product && product.product_type === 1) {
                // 虚拟商品
                shipping_type = -1;
            }
            this._shipping_type = shipping_type;
            this.triggerEvent('shipping-change', { shipping_type });
        },

        // 表单提交验证
        onFormConfirm() {
            let { product, selectedSku, currentSpecial, currentRelation } = this.data;
            let title = '';
            if (product.skus && product.skus.length) {
                let { id, stock } = selectedSku;
                if (!id) {
                    title = '请选择必要的商品规格';
                } else if (stock === 0) {
                    title = '无法购买库存为0的商品';
                }
            }
            let hasAllSpecial = currentSpecial.every(item => item.value);
            let hasAllRelation = currentRelation.every(item => item.value);
            if (!hasAllSpecial || !hasAllRelation) {
                title = '请选择必要的商品规格';
            }

            if (!title) { return }
            // 报错
            wx.showToast({ title, icon: 'none', duration: 2000 });
            throw new Error(title);
        },

        // 创建订单信息
        getCurrentOrder() {
            let { product, selectedSku, quantity, currentSpecial, currentRelation, selectedOptions } = this.data;
            let { _shipping_type, _remarks } = this;
            let currentOrder = pageShare.createCurrentOrder({
                product,
                selectedSku,
                quantity,
                currentSpecial,
                currentRelation,
                shipping_type: _shipping_type,
                selectedOptions,
                remarks: _remarks,
            });
            this._currentOrder = currentOrder;
            this._remarks = [];
        },
    }
});