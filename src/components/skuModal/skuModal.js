import { sku } from 'peanut-all';
import { getAgainUserForInvalid, updateCart } from 'utils/util';
import { CONFIG, SHIPPING_TYPE } from 'constants/index';
import proxy from 'utils/wxProxy';
import api from 'utils/api';
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
                console.log(newValue, 'newValue', oldValue, 'oldValue');
                if (newValue.id !== (oldValue && oldValue.id)) { // 缓存
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
        isBargainBuy: {
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
        }
    },
    data: {
        selectedProperties: [],
        selectedSku: {},
        disableSkuItems: {},
        skuMap: {},
        globalData: app.globalData,
        now: Math.round(Date.now() / 1000),
        shipping_type: 1
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        this.setData({ config });
    },
    methods: {
        // 初始化配送方式
        firstInit() {
            const shippingState = wx.getStorageSync('shippingType');
            console.log('shipping_type91', shippingState, typeof shippingState);
            const { product } = this.data;
            let type = product.shipping_types; // [1,2,4]
            const liftStyles = SHIPPING_TYPE.filter(item => {
                return type.indexOf(item.value) > -1;
            });
            liftStyles.forEach(item => { item.checked = false });
            const isHasState = liftStyles.find(item => { // 判断缓存配送方式是否已开启
                return item.value === shippingState;
            });
            console.log('data96', liftStyles);
            console.log('isHasStyles101', isHasState);
            if (liftStyles && isHasState) {
                liftStyles.forEach((item) => {
                    if (item.value === Number(shippingState)) {
                        item.checked = true;
                    }
                });
                console.log('shippingState106', shippingState, typeof shippingState);
                this.setData({ liftStyles, shipping_type: shippingState });
                this.triggerEvent('getShippingType', { shipping_type: shippingState }, { bubbles: true });
            } else {
                liftStyles[0].checked = true;
                this.setData({ liftStyles, shipping_type: type[0] });
                this.triggerEvent('getShippingType', { shipping_type: type[0] }, { bubbles: true });
                console.log('shipping_type115', typeof type[0]);
                wx.setStorage({
                    key: 'shippingType',
                    data: type[0]
                });
            }
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
            const { product, selectedSku, shipping_type } = this.data;
            console.log('product142', product);
            console.log(selectedSku, e, 'erer');
            if (product.skus && product.skus.length && !selectedSku.id) {
                wx.showToast({
                    title: '请选择商品规格',
                    icon: 'none',
                    duration: 2000,
                    mask: false,
                });
                return;
            }
            e.sku_id = selectedSku.id; // 多规格
            e.shipping_type = shipping_type;
            e.quantity = Number(product.uniqueNumber);
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
                this.Sku = new sku({ max: 3 });
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

        updateNumber({ detail }) {
            const { value } = detail;
            this.setData({ 'product.uniqueNumber': value }, () => {
                console.log('product', this.data.product);
            });
        },

        onFormSubmit(e) {
            const { formId } = e.detail;
            this.setData({ formId });
        },

        async onUserInfo(e) {
            console.log('onUserInfo', e);
            const { encryptedData, iv } = e.detail;
            const { product, selectedSku } = this.data;
            if (iv && encryptedData) {
                if (product.skus && product.skus.length && !selectedSku.id) {
                    wx.showToast({
                        title: '请选择商品规格',
                        icon: 'none',
                        duration: 2000,
                        mask: false,
                    });
                    return;
                }
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
            this.setData({ liftStyles, shipping_type: Number(value) });
            console.log('liftStyles', liftStyles, 'shipping_type', this.data.shipping_type, typeof this.data.shipping_type);
            this.triggerEvent('getShippingType', { shipping_type: this.data.shipping_type }, { bubbles: true });
            wx.setStorage({
                key: 'shippingType',
                data: this.data.shipping_type
            });
        }
    }
});

