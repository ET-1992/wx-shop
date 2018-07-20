import api from 'utils/api';
import { showModal } from 'utils/wxp';
import getToken from 'utils/getToken';
import forceUserInfo from 'utils/forceUserInfo';
import { CART_LIST_KEY, phoneStyle, PRODUCT_LAYOUT_STYLE } from 'constants/index';
import { updateCart } from 'utils/util';

const app = getApp();

// 创建页面实例对象
Page({
    data: {
        items: [],
        isAllSelected: false,
        totalPrice: 0,
        savePrice: 0,
        totalPostage: 0,
        isLoading: false,
        isLogin: false,
        nowTS: Date.now() / 1000,
        isSelectedObject: {},
        phoneModel: '',
        isShowConsole: false,
        productLayoutStyle: PRODUCT_LAYOUT_STYLE[3],
    },
    onLoad() {
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
    },

    async onShow() {
        this.setData({ isLogin: true, isLoading: true, isShowConsole: app.openConsole });
        await this.loadCart();
        const cartNumber = (this.data.items.length).toString();
        wx.setStorageSync('CART_NUM', cartNumber);
        this.showCart();
    },

    onHide() {
        wx.setStorageSync(CART_LIST_KEY, this.data.isSelectedObject);
    },

    onUnload() {
        wx.setStorageSync(CART_LIST_KEY, this.data.isSelectedObject);
    },

    async loadCart() {
        // this.checkPhoneModel();
        const { isIphone5 } = app.systemInfo;
        const lastSelectedArray = wx.getStorageSync(CART_LIST_KEY);
        const data = await api.hei.fetchCartList();
        const items = data && data.items || [];
        let isSelectedObject = {};
        let isAllSelected = false;
        items.forEach((item) => {
            if (item.status !== 0) {
                isSelectedObject[item.id] = lastSelectedArray ? lastSelectedArray[item.id] || false : false;
            }
        });
        isAllSelected = this.checkAllSelected(isSelectedObject);
        console.log(isSelectedObject, 'isSelectedObject');
        this.setData({
            items,
            isSelectedObject,
            isAllSelected,
            isLoading: false,
            isIphone5,
            products: data.products
        });
        this.calculatePrice();
    },

    checkAllSelected(isSelectedObject) {
        return Object.keys(isSelectedObject).filter(item => !isSelectedObject[item]) && !Object.keys(isSelectedObject).filter(item => !isSelectedObject[item]).length > 0;
    },

    // checkPhoneModel() {
    // 	wx.getSystemInfo({
    // 		success: (res) => {
    // 			this.setData({
    // 				phoneModel: phoneStyle[res.model] || ''
    // 			});
    // 		}
    // 	});
    // },

    onHandleItemSelect(e) {
        let { itemId } = e.currentTarget.dataset;
        let { isSelectedObject, isAllSelected } = this.data;
        isSelectedObject[itemId] = !isSelectedObject[itemId];
        isAllSelected = this.checkAllSelected(isSelectedObject);
        this.setData({
            isSelectedObject,
            isAllSelected
        });
        this.calculatePrice();
    },

    onSelectAll() {
        let { isSelectedObject, isAllSelected } = this.data;
        for (let key in isSelectedObject) {
            isSelectedObject[key] = !isAllSelected;
        }
        isAllSelected = !isAllSelected;
        this.setData({
            isSelectedObject,
            isAllSelected
        });
        this.calculatePrice();
    },

    async updateCart({ detail }) {
        const { items } = this.data;
        const { vendor } = app.globalData;
        const { value, postId, skuId } = detail;
        const data = await api.hei.updateCart({
            post_id: postId,
            sku_id: skuId,
            quantity: value,
            vendor,
        });
        const index = items.findIndex((item) => item.post_id === postId && item.sku_id === skuId);
        const updateData = {};
        const quantitykey = `items[${index}].quantity`;
        updateData[quantitykey] = value;
        this.setData(updateData);
        this.calculatePrice();
    },

    async onDelete(e) {
        const { items, isSelectedObject } = this.data;
        const { postId, skuId, index, itemId } = e.currentTarget.dataset;
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认删除商品？',
            confirmText: '删除',
            confirmColor: '#dc143c',
        });
        if (confirm) {
            await api.hei.removeCart({
                post_id: postId,
                sku_id: skuId,
            });
            wx.showToast({
                title: '成功删除',
            });
            items.splice(index, 1);
            this.setData({ items });
            delete isSelectedObject[itemId];
            this.calculatePrice();

            const cartNumber = (items.length).toString();
            wx.setStorageSync('CART_NUM', cartNumber);
            this.showCart();
        }
    },

    async onClearCart() {
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认清空购物车？',
            confirmText: '清空',
            confirmColor: '#dc143c',
        });
        if (confirm) {
            await api.hei.clearCart();
            wx.showToast({
                title: '成功清空购物车',
            });
            this.setData({ items: [], isSelectedObject: {}});
            this.calculatePrice();
            wx.removeStorageSync('CART_NUM');
            this.showCart();
        }
    },

    async onCreateOrder(e) {
        console.log(e, 'e');
        const { encryptedData, iv } = e.detail;
        if (encryptedData && iv) {
            const { items, isSelectedObject } = this.data;
            const selectdItems = items.filter((item) => isSelectedObject[item.id]);
            this.data.items = selectdItems; // 不需要更新UI,直接赋值即可
            app.globalData.currentOrder = this.data;
            wx.navigateTo({
                url: '/pages/orderCreate/orderCreate',
            });
        }
        else {
            showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    calculatePrice() {
        const { items, nowTS, isSelectedObject } = this.data;
        let totalPrice = 0;
        let savePrice = 0;
        let totalPostage = 0;
        items.forEach((item) => {
            if (isSelectedObject[item.id]) {
                const { price, original_price, quantity, postage, miaosha_end_timestamp, miaosha_start_timestamp, miaosha_price } = item;
                const isMiaoshaStart = nowTS >= miaosha_start_timestamp;
                const isMiaoshaEnd = nowTS >= miaosha_end_timestamp;
                const _price = !isMiaoshaEnd && isMiaoshaStart ? miaosha_price : price;
                const discountFee = (original_price - _price) * quantity;
                totalPrice = totalPrice + _price * quantity;
                savePrice = savePrice + discountFee;
                totalPostage = postage > totalPostage ? postage : totalPostage;
            }
        });
        totalPrice = totalPrice.toFixed(2);
        savePrice = savePrice.toFixed(2);
        totalPostage = totalPostage.toFixed(2);

        let isShouldPay = items.filter((item) => isSelectedObject[item.id]) && items.filter((item) => isSelectedObject[item.id]).length > 0;

        this.setData({ totalPrice, savePrice, totalPostage, isShouldPay });
    },

    showCart() {
        const { categoryIndex } = app.globalData;
        updateCart(categoryIndex.categoryIndex);
    }
});
