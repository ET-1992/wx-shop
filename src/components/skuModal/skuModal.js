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
        // 初始化配送方式
        firstInit() {
            const cashedType = wx.getStorageSync('shippingType'),
                {
                    product: { shipping_types: types = [] },  // 商品物流方式
                    config: { shipping_type_name = [], }  // 店铺物流名称字典
                } = this.data;

            // 选中物流对应对象数组 添加checked属性
            let liftStyles = [];
            for (let lift of shipping_type_name) {
                let type = Number(lift.value),
                    productShippingType = types.indexOf(type) > -1;
                if (productShippingType) {
                    Object.assign(lift, { checked: false });
                    liftStyles.push(lift);
                }
            }

            // 设置当前选中物流
            let shipping_type = '';
            for (let lift of liftStyles) {
                if (lift.value === Number(cashedType)) {
                    lift.checked = true;
                    shipping_type = Number(cashedType);
                }
            }
            if (!shipping_type && liftStyles[0]) {
                // 不存在缓存则选第一个
                liftStyles[0].checked = true;
                shipping_type = liftStyles[0].value;
            }

            this.setData({
                liftStyles,
                shipping_type,
            });
            this.triggerEvent(
                'getShippingType',
                { shipping_type },
                { bubbles: true }
            );
            wx.setStorage({
                key: 'shippingType',
                data: shipping_type
            });
        },

        close() {
            this.setData({
                isShowSkuModal: false
            });
        },

        // 商品规格回调
        onOptionSelect(e) {
            let { currentOptions, selectedSku, skuMap } = e.detail;
            this.setData({
                selectedProperties: currentOptions,
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

