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
        currentSku: [],  // 选中sku
        disableOptions: [],  // 不可选sku
        currentSpecial: [],  // 选中规格
        currentRelation: [],  // 选中增值规格
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
            const { product, product: { skus, special_attributes, related_product }} = this.data;
            if (Object.keys(product).length === 0) {
                return;
            }
            try {
                this._sku = new Sku({ max: 3 });
                const skuMap = this._sku.getSkus(skus),
                    currentSku = this._sku.getDefaultSku(skus);

                currentSku.forEach(item => { item.value = '' });

                let currentSpecial = special_attributes.map((key) => ({ key, value: '' }));
                let currentRelation = related_product.map((key) => ({ key, value: '' }));

                this.setData({
                    currentSku,
                    currentSpecial,
                    currentRelation,
                    skuMap,
                });
                this.setSkuConfig();

                console.log(this.data, 'init sku data');
            } catch (e) {
                console.log(e);
            }
        },

        // 触发选中选项
        onSelectOption(e) {
            let { type, nameIndex, valueIndex } = e.mark;
            if (isNaN(valueIndex)) {
                return;
            }
            let { product, disableOptions, currentSku, currentSpecial, currentRelation } = this.data;

            let arr = product[type][nameIndex];
            if (type === 'properties') {
                let value = arr.items[valueIndex].name;
                if (disableOptions[value]) return;
                currentSku[nameIndex].value = (currentSku[nameIndex].value === value ? '' : value);
                this.setData({ currentSku });
                this.setSkuConfig();
            } else if (type === 'special_attributes') {
                let value = arr.value[valueIndex];
                currentSpecial[nameIndex].value = (currentSpecial[nameIndex].value === value ? '' : value);
                this.setData({ currentSpecial });
            } else if (type === 'related_product') {
                let value = arr.value[valueIndex].title;
                currentRelation[nameIndex].value = (currentRelation[nameIndex].value === value ? '' : value);
                this.setData({ currentRelation });
            }

        },

        // 获取SKU相关数据
        setSkuConfig() {
            let { currentSku, product, skuMap } = this.data,
                { skus, properties } = product;
            console.log('currentSku', currentSku);
            const selectedSku = this._sku.findSelectedSku(skus, currentSku) || {};
            const disableOptions = this._sku.getDisableSkuItem({
                properties,
                skuMap,
                selectedProperties: [],
            });
            this.setData({
                disableOptions,
                selectedSku
            });
            this.triggerEvent('select', { currentSku, selectedSku, skuMap });
        },
    }
});

