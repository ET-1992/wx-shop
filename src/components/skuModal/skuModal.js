import { Sku } from 'peanut-all';
import { getAgainUserForInvalid } from 'utils/util';
import proxy from 'utils/wxProxy';
const app = getApp();
Component({
    properties: {
        isShowSkuModal: {
            type: Boolean,
            value: false
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
        },
        position: {
            type: String,
            value: 'center'
        },
        duration: {
            type: Number,
            value: 300
        },
        quantity: {
            type: Number,
            value: 0
        },
        actions: {
            type: Array,
            value: [{ type: 'onBuy', text: '立即购买' }]
        },
        isCrowd: {
            type: Boolean,
            value: false
        },
        isGrouponBuy: {
            type: Boolean,
            value: false
        },
        config: {
            type: Object,
            value: {}
        },
        isIphoneX: {
            type: Boolean,
            value: false
        },
        miaoshaObj: {
            type: Object,
            value: {}
        }
    },
    data: {
        selectedProperties: [],
        selectedSku: {},
        disableSkuItems: {},
        skuMap: {},
        globalData: app.globalData,
        now: Math.round(Date.now() / 1000)
    },
    methods: {
        close() {
            this.setData({
                isShowSkuModal: false
            });
        },
        onSkuItem(e) {
            console.log(e, 'onSku');
            const { key, skuName, propertyIndex, isDisabled } = e.currentTarget.dataset;
            if (isDisabled) {
                return;
            }
            const {
                selectedProperties,
                product: { properties, skus },
                skuMap
            } = this.data;

            if (selectedProperties[propertyIndex]) {
                selectedProperties[propertyIndex] = {
                    key,
                    value: selectedProperties[propertyIndex].value === skuName ? '' : skuName
                };
                const selectedSku = this.Sku.findSelectedSku(skus, selectedProperties) || {};
                const disableSkuItems = this.Sku.getDisableSkuItem({
                    properties,
                    skuMap,
                    selectedProperties
                });
                this.setData({
                    selectedProperties,
                    disableSkuItems,
                    selectedSku
                });
            }
            console.log(this.data, 'onSkuItem');
        },
        async onAddCart(e) {
            const { selectedSku } = this.data;
            console.log(selectedSku, e, 'erer');
            e.sku_id = selectedSku.id;
            if (selectedSku.stock === 0) {
                await proxy.showModal({
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
                const { skus, properties } = product;
                this.Sku = new Sku({ max: 3 });
                const skuMap = this.Sku.getSkus(skus);
                const defalutSelectedProperties = this.Sku.getDefaultSku(skus);

                defalutSelectedProperties.forEach(item => {
                    item.value = '';
                });

                const selectedSku = this.Sku.findSelectedSku(skus, defalutSelectedProperties) || {};
                const disableSkuItems = this.Sku.getDisableSkuItem({
                    properties,
                    skuMap,
                    selectedProperties: defalutSelectedProperties,
                });

                this.setData({
                    properties,
                    disableSkuItems,
                    selectedProperties: defalutSelectedProperties,
                    selectedSku,
                    skuMap,
                });

                console.log(this.data, 'init data');
            } catch (e) {
                console.log(e);
            }
        },

        previewImage(e) {
            const { src } = e.currentTarget.dataset;
            wx.previewImage({
                urls: [src]
            });
        },

        updateQuantity({ detail }) {
            const { value } = detail;
            this.setData({ quantity: value });
        },

        onFormSubmit(e) {
            const { formId } = e.detail;
            this.setData({ formId });
        },

        async onUserInfo(e) {
            console.log('onUserInfo', e);
            const { encryptedData, iv } = e.detail;
            if (iv && encryptedData) {
                const { actionType } = e.target.dataset;
                await getAgainUserForInvalid({ encryptedData, iv });
                this.onSkuConfirm(actionType);
            }
            else {
                wx.showModal({
                    title: '温馨提示',
                    content: '需授权后操作',
                    showCancel: false,
                });
            }
        },

        onSkuConfirm(actionType) {
            this.close();
            console.log(this.data);
            const { selectedSku, quantity, formId } = this.data;
            this.triggerEvent('onSkuConfirm', { actionType, selectedSku, quantity, formId }, { bubbles: true });
        },
    }
});

