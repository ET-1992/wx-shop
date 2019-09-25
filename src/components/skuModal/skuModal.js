import { Sku } from 'peanut-all';
import { getAgainUserForInvalid } from 'utils/util';
import { CONFIG, SHIPPING_TYPE } from 'constants/index';
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
                    this.firstInit();
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
        now: Math.round(Date.now() / 1000),
        shipping_type: '1'
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        this.setData({ config });
    },
    methods: {
        // 初始化配送方式
        firstInit() {
            const { product } = this.data;
            console.log('shipping_type', product.shipping_types);
            let type = product.shipping_types;
            const liftStyles = SHIPPING_TYPE.filter(item => {
                return type.indexOf(item.value) > -1;
            });
            console.log('data', liftStyles);
            if (liftStyles && liftStyles[0]) {
                liftStyles.forEach(item => {
                    item.checked = false;
                });
                liftStyles[0].checked = true;
                this.setData({ liftStyles, shipping_type: type[0] });
                this.triggerEvent('getShippingType', { shipping_type: type[0] }, { bubbles: true });
            }
            console.log('shipping_type94', this.data.shipping_type);
        },
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
        // classify 页面
        async onAddCart(e) {
            const { selectedSku, shipping_type } = this.data;
            console.log(selectedSku, e, 'erer');
            e.sku_id = selectedSku.id; // 多规格
            e.shipping_type = shipping_type;
            console.log('shipping_type139', shipping_type);
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
            this.setData({
                isShowSkuModal: false
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

        /* radio选择改变触发 */
        radioChange(e) {
            const { liftStyles } = this.data;
            const { value } = e.detail;
            console.log('radioValue263', value, typeof value);
            console.log('liftStyles', liftStyles);
            liftStyles.forEach((item) => {
                if (item.value === Number(value)) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            });
            this.setData({ liftStyles, shipping_type: value });
            console.log('liftStyles', liftStyles, 'shipping_type', this.data.shipping_type);
            this.triggerEvent('getShippingType', { shipping_type: this.data.shipping_type }, { bubbles: true });
        },
    }
});

