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

        // 商品分类 加入购物车
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

        // SKU表单提交
        async onUserInfo(e) {
            console.log('onUserInfo and sku confirm', e);
            const { encryptedData, iv } = e.detail,
                { actionType } = e.target.dataset,
                { product, selectedSku, quantity } = this.data;

            if (!iv || !encryptedData) {
                wx.showModal({
                    title: '温馨提示',
                    content: '需授权后操作',
                    showCancel: false,
                });
                return;
            }
            if (product.skus && product.skus.length && !selectedSku.id) {
                wx.showToast({
                    title: '请选择商品规格',
                    icon: 'none',
                });
                return;
            }
            await getAgainUserForInvalid({ encryptedData, iv });
            this.close();
            this.triggerEvent('onSkuConfirm', { actionType, selectedSku, quantity }, { bubbles: true });
        },

        // 物流选择回调
        radioChange(e) {
            let { shipping_type } = e.detail;
            this.setData({ shipping_type });
            this.triggerEvent('getShippingType', { shipping_type }, { bubbles: true });
        },

        // 商品规格回调
        onOptionSelect(e) {
            let { currentSku, selectedSku, skuMap, currentSpecial, currentRelation } = e.detail;
            this.setData({
                selectedProperties: currentSku,
                selectedSku,
                skuMap,
                currentSpecial,
                currentRelation,
            });
        },

    }
});

