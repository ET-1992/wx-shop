import { getAgainUserForInvalid } from 'utils/util';
import { CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
import api from 'utils/api';
import behaviorSku from 'utils/behavior/behaviorSku';

const app = getApp();
Component({
    behaviors: [behaviorSku],
    properties: {
        isShowSkuModal: {
            type: Boolean,
            value: false
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
            try {
                this.onFormConfirm();
                e.id = product.id;
                e.sku_id = selectedSku.id; // 多规格
                e.shipping_type = shipping_type;
                e.quantity = Number(product.uniqueNumber) || 1;
                this.close();
                this.triggerEvent('onAddCart', e, { bubbles: true });
            } catch (e) {
                console.log('resolved error', e);
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
                { currentRelation, currentSpecial, selectedSku, quantity } = this.data;

            if (!iv || !encryptedData) {
                wx.showModal({
                    title: '温馨提示',
                    content: '需授权后操作',
                    showCancel: false,
                });
                return;
            }
            try {
                this.onFormConfirm();
                await getAgainUserForInvalid({ encryptedData, iv });
                this.close();
                this.triggerEvent('onSkuConfirm', {
                    actionType,
                    selectedSku,
                    quantity,
                    currentSpecial,
                    currentRelation,
                }, { bubbles: true });
            } catch (e) {
                console.log('resolved error', e);
            }

        },

    }
});

