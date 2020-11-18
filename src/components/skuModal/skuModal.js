import { getAgainUserForInvalid } from 'utils/util';
import { CONFIG } from 'constants/index';
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
        skuMap: {},
        globalData: app.globalData,
        now: Math.round(Date.now() / 1000),
        shipping_type: 1
    },

    async attached() {
        let config = wx.getStorageSync(CONFIG);
        if (!config) {
            let data = await api.hei.config();
            ({ config } = data);
        }
        this.setData({ config });
    },

    methods: {
        close() {
            this.setData({
                isShowSkuModal: false
            });
        },

        // 商品规格回调
        onOptionSelect(e) {
            let { currentSku, selectedSku, skuMap } = e.detail;
            this.setData({
                selectedProperties: currentSku,
                selectedSku,
                skuMap,
            });
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
            e.id = product.id;
            e.sku_id = selectedSku.id; // 多规格
            e.shipping_type = shipping_type;
            e.quantity = Number(product.uniqueNumber) || 1;
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

        updateNumber({ detail }) {
            const { value } = detail;
            this.setData({ 'product.uniqueNumber': value }, () => {
                console.log('product', this.data.product);
            });
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

        // SKU确认
        onSkuConfirm(actionType) {
            this.close();
            const { selectedSku, quantity } = this.data;
            this.triggerEvent('onSkuConfirm', { actionType, selectedSku, quantity }, { bubbles: true });
        },

        // 物流选择回调
        radioChange(e) {
            let { shipping_type } = e.detail;
            this.setData({ shipping_type });
            this.triggerEvent('getShippingType', { shipping_type }, { bubbles: true });
        }
    }
});

