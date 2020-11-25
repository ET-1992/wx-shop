import { getAgainUserForInvalid, updateTabbar } from 'utils/util';
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

        // 加入购物车
        async onAddCart() {
            try {
                this.onFormConfirm();
                let data = await this.runAddCart();
                return data;
                // this.triggerEvent('onAddCart', e, { bubbles: true });
            } catch (e) {
                console.log('resolved error', e);
            }
        },

        // 进行加车操作
        async runAddCart() {
            this.getCurrentOrder();
            let { _currentOrder } = this;
            let posts = JSON.stringify(_currentOrder.items);
            let data = await api.hei.addCart({ posts });
            if (!data.errcode) {
                let { count } = data;
                wx.showToast({ title: '成功添加' });
                wx.setStorageSync('CART_NUM', count);
                updateTabbar({ tabbarStyleDisable: true });
                return data;
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
                let queryData = {};
                if (actionType === 'addCart') {
                    queryData = await this.onAddCart();
                } else {
                    queryData = { selectedSku, quantity, currentSpecial, currentRelation };
                }
                this.triggerEvent('onSkuConfirm', {
                    actionType,
                    queryData,
                });
            } catch (e) {
                console.log('resolved error', e);
            }
        },

    }
});

