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
            value: 1
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
        shipping_type: 1,
        scrollEnable: true,
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
                this.triggerEvent('addCartSuccess');
                return data;
            } catch (e) {
                console.log('resolved error', e);
                throw new Error(e);
            }
        },

        // 进行加车操作
        async runAddCart() {
            this.getCurrentOrder();
            let { _currentOrder } = this;
            let posts = JSON.stringify(_currentOrder.items);
            try {
                let data = await api.hei.addCart({ posts });
                let { count } = data;
                wx.showToast({ title: '成功添加' });
                wx.setStorageSync('CART_NUM', count);
                updateTabbar({ tabbarStyleDisable: true });
                return data;
            } catch (e) {
                wx.showModal({
                    title: '报错提示',
                    content: e.errMsg,
                    showCancel: false,
                });
                throw new Error(e);
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

        // SKU表单提交
        async onUserInfo(e) {
            // console.log('onUserInfo and sku confirm', e);
            const { encryptedData, iv } = e.detail,
                { actionType } = e.target.dataset,
                { currentRelation, currentSpecial, selectedSku, quantity, selectedOptions } = this.data;

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
                let component = this.selectComponent('#mark-form');
                if (component) {
                    let form = component.handleValidate();
                    this._remarks = form;
                }
                await getAgainUserForInvalid({ encryptedData, iv });
                this.close();
                let queryData = {};
                if (actionType === 'addCart') {
                    queryData = await this.onAddCart();
                } else {
                    let remarks = this._remarks;
                    queryData = { selectedSku, quantity, currentSpecial, currentRelation, selectedOptions, remarks };
                }
                this.triggerEvent('onSkuConfirm', {
                    actionType,
                    queryData,
                });
            } catch (e) {
                console.log('resolved error', e);
            }
        },

        // 留言表单聚焦/失焦
        onChangeFormFocus(e) {
            let { isFocused } = e.detail;
            let scrollEnable = !isFocused;
            this.setData({ scrollEnable });
        },

    }
});

