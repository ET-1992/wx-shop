import { sku as Sku } from 'peanut-all';

const app = getApp();
Component({
    properties: {
        product: {
            type: Object,
            value: {},
            observer(newValue, oldValue) {
                if (newValue.id === oldValue.id) { return }
                this.setOptionList();
            }
        },
    },
    data: {
        themeColor: {},
        currentOptions: [],  // 选中商品选项组合
        disableOptions: [],  // 不可选商品选项
    },
    lifetimes: {
        attached() {
            const { themeColor } = app.globalData;
            this.setData({ themeColor });
        }
    },
    methods: {
        // 初始化选项组合
        setOptionList() {
            const { product, product: { skus }} = this.data;
            if (Object.keys(product).length === 0) {
                return;
            }
            try {
                this._sku = new Sku({ max: 3 });
                const skuMap = this._sku.getSkus(skus),
                    currentOptions = this._sku.getDefaultSku(skus);

                currentOptions.forEach(item => { item.value = '' });

                this.setData({
                    currentOptions,
                    skuMap,
                });
                this.setSkuConfig();

                console.log(this.data, 'init data');
            } catch (e) {
                console.log(e);
            }
        },

        // 触发选中选项
        onSelectOption(e) {
            let { product, disableOptions, currentOptions } = this.data,
                { propertyIndex, skuIndex } = e.currentTarget.dataset;

            // 规格数组及子SKU数据
            let property = product.properties[propertyIndex],
                sku = property.items[skuIndex];

            let { name: propertyName } = property,
                { name: skuName } = sku;

            if (disableOptions[skuName] || !currentOptions[propertyIndex]) {
                return;
            }

            currentOptions[propertyIndex] = {
                key: propertyName,
                value: currentOptions[propertyIndex].value === skuName ? '' : skuName
            };

            this.setData({
                currentOptions,
            });
            this.setSkuConfig();
        },

        // 获取SKU相关数据
        setSkuConfig() {
            let { currentOptions, product, skuMap } = this.data,
                { skus, properties } = product;
            const selectedSku = this._sku.findSelectedSku(skus, currentOptions) || {};
            const disableOptions = this._sku.getDisableSkuItem({
                properties,
                skuMap,
                selectedProperties: currentOptions
            });
            this.setData({
                disableOptions,
                selectedSku
            });
            this.triggerEvent('select', { currentOptions, selectedSku, skuMap });
        },
    }
});

