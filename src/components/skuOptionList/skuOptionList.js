import { sku as Sku } from 'peanut-all';

const app = getApp();
Component({
    properties: {
        product: {
            type: Object,
            value: {},
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
    observers: {
        'product': function(value = {}) {
            let { id } = value;
            if (!id || id === this._id) { return }
            this._id = id;
            this.setOptionList();
        }
    },
    methods: {
        // 初始化选项组合
        setOptionList() {
            const { product, product: { properties, skus, special_attributes, related_product }} = this.data;
            if (Object.keys(product).length === 0) {
                return;
            }
            try {
                this._sku = new Sku({ max: 3 });

                // const currentSku = this._sku.getDefaultSku(skus);
                // currentSku.forEach(item => { item.value = '' });
                // SKU数组 不过滤库存为0的
                let currentSku = properties.map(({ key }) => ({ key, value: '' }));

                // 所有规格/增值规格数组
                let currentSpecial = special_attributes.map(({ key }) => ({ key, value: '' }));
                let currentRelation = related_product.map(({ key }) => ({ key, value: '' }));

                this.setData({
                    currentSku,
                    currentSpecial,
                    currentRelation,
                });
                this.notifyParent();

                console.log(this.data, 'init sku data');
            } catch (e) {
                console.log(e);
            }
        },

        // 触发选中选项
        onSelectOption(e) {
            console.log('2', e);
            let { type, nameIndex, valueIndex } = e.mark,
                { product, disableOptions } = this.data;

            if (isNaN(valueIndex)) {
                return;
            }

            let dataArr = { properties: 'currentSku', special_attributes: 'currentSpecial', related_product: 'currentRelation' },
                dataKey = dataArr[type];  // 修改的data关键字

            console.log('dataKey', dataKey);

            // 三个选项数据结构不同，特殊处理
            let propValue = '';  // 选中对象的值
            let propArr = product[type][nameIndex];  // 选中的SKU数组/规格数组/增值规格数组
            if (type === 'properties') {
                propValue = propArr.items[valueIndex].name;
                if (disableOptions[propValue]) return;
            } else if (type === 'special_attributes') {
                propValue = propArr.value[valueIndex];
            } else if (type === 'related_product') {
                propValue = propArr.value[valueIndex].title;
            }

            console.log('this.data[dataKey][nameIndex]', this.data[dataKey], this.data[dataKey][nameIndex]);

            // 选中/取消
            propValue = (this.data[dataKey][nameIndex].value === propValue ? '' : propValue);
            this.data[dataKey][nameIndex].value = propValue;

            // 视图更新的数据
            let setDataObj = { [dataKey]: this.data[dataKey] };
            this.setData(setDataObj);
            this.notifyParent();
        },

        // 通知父组件数据
        notifyParent() {
            let { currentSku, currentSpecial, currentRelation, product } = this.data,
                { skus, properties } = product;

            const skuMap = this._sku.getSkus(skus);
            const selectedSku = this._sku.findSelectedSku(skus, currentSku);
            const disableOptions = this._sku.getDisableSkuItem({
                properties,
                skuMap,
                selectedProperties: currentSku,
            });
            this.setData({ disableOptions });

            let detail = {
                skuMap,
                selectedSku,
                currentSku,
                currentSpecial,
                currentRelation,
            };
            this.triggerEvent('select', detail);
        },
    }
});

