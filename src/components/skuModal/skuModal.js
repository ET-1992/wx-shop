import { Sku } from 'peanut-all';
import { showModal } from 'utils/wxp';
const app = getApp();
Component({
    properties: {
        isShowSkuModal: {
            type: Boolean,
            value: false,
            observer(newValue) {
                if (newValue) {
                    this.setData({
                        isShowSkuModalCss: true
                    });
                }
            }
        },
        product: {
            type: Object,
            value: {},
            observer(newValue, oldValue) {
                console.log(newValue, oldValue);
                if (newValue.id !== oldValue.id) { // 缓存
                    this.setSku();
                }
            }
        },
        themeColor: {
            type: Object,
            value: {}
        }
    },
    data: {
        selectedProperties: [],
        selectedSku: {},
        disableSkuItems: {},
        skuMap: {},
        globalData: app.globalData
    },
    methods: {
        close() {
            this.setData({
                isShowSkuModalCss: false
            }, () => {
                setTimeout(() => {
                    this.setData({
                        isShowSkuModal: false
                    });
                }, 300);
            });
        },
        onSkuItem(e) {
            const { key, skuName, propertyIndex, isDisabled } = e.currentTarget.dataset;
            if (isDisabled) {
                return;
            }
            const {
                selectedProperties,
                product: { properties, skus },
                skuMap
            } = this.data;

            if (selectedProperties[propertyIndex] && selectedProperties[propertyIndex].value !== skuName) {
                selectedProperties[propertyIndex] = {
                    value: skuName,
                    key
                };
                const selectedSku = this.Sku.findSelectedSku(skus, selectedProperties) || {};
                const disableSkuItems = this.Sku.getDisableSkuItem({
                    properties: properties,
                    skuMap,
                    selectedProperties
                });
                this.setData({
                    selectedProperties,
                    disableSkuItems,
                    selectedSku
                });
            }
        },
        async onAddCart(e) {
            const { selectedSku } = this.data;
            console.log(selectedSku, e, 'erer');
            e.sku_id = selectedSku.id;
            if (selectedSku.stock === 0) {
                await showModal({
                    title: '温馨提示',
                    content: '商品库存为0',
                });
                return;
            }
            this.close();
            this.triggerEvent('onAddCart', e, { bubbles: true });
        },
        setSku() {
            const { product } = this.data;
            if (Object.keys(product).length === 0) {
                return;
            }
            try {
                const { skus, properties: productProperties } = product;
                this.Sku = new Sku({ max: 3 });
                const skuMap = this.Sku.getSkus(skus);
                const defalutSelectedProperties = this.Sku.getDefaultSku(skus);
                const selectedSku = this.Sku.findSelectedSku(skus, defalutSelectedProperties) || {};
                const disableSkuItems = this.Sku.getDisableSkuItem({
                    properties: productProperties,
                    skuMap,
                    selectedProperties: defalutSelectedProperties || [],
                });

                console.log(selectedSku, 'selectedSku');
                console.log(disableSkuItems, 'disableSkuItems');
                this.setData({
                    disableSkuItems,
                    selectedProperties: defalutSelectedProperties,
                    selectedSku,
                    skuMap,
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
});

