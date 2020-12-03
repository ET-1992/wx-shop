import api from 'utils/api';
import { showModal } from 'utils/wxp';
import { CART_LIST_KEY, phoneStyle, PRODUCT_LAYOUT_STYLE, CONFIG } from 'constants/index';
import { updateTabbar, autoNavigate, getAgainUserForInvalid } from 'utils/util';

const app = getApp();

// 创建页面实例对象
Page({
    data: {
        items: [],
        liftStyleIndex: 0,
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
        multiStoreEnable: false,  // 判断店铺多门店开关
    },
    onLoad(params) {
        console.log('params', params);
        const { globalData, systemInfo } = app;
        this.setData({
            themeColor: globalData.themeColor,
            globalData,
            ...systemInfo
        });
    },

    async onShow() {
        const config = wx.getStorageSync(CONFIG);
        let multiStoreEnable = Boolean(config.offline_store_enable);
        this.setData({
            isLogin: true,
            isLoading: true,
            config,
            multiStoreEnable,
            free_shipping_amount: config && config.free_shipping_amount,
        });
        this.firstInit();
        // 非多门店模式
        if (!multiStoreEnable) {
            await this.loadCart();
        }
        updateTabbar({ pageKey: 'cart' });
    },

    onHide() {
        wx.setStorageSync(CART_LIST_KEY, this.data.isSelectedObject);
    },

    onUnload() {
        wx.setStorageSync(CART_LIST_KEY, this.data.isSelectedObject);
    },

    // 选择门店重新刷新
    async updateStoreData() {
        await this.loadCart();
    },

    async loadCart() {
        const { shipping_type, liftStyles } = this.data;
        console.log('shipping_type', shipping_type, typeof shipping_type, 'liftStyles', liftStyles);
        // this.checkPhoneModel();
        const lastSelectedArray = wx.getStorageSync(CART_LIST_KEY);
        const { count, items, shipping_type_counts, products } = await api.hei.fetchCartList({ shipping_type });
        wx.setStorageSync('CART_NUM', count);
        let isSelectedObject = {};
        let isAllSelected = false;
        items.forEach((item) => {
            if (item.status !== 0 && item.stock !== 0) {
                isSelectedObject[item.id] = lastSelectedArray ? lastSelectedArray[item.id] || false : false;
            }
        });
        isAllSelected = this.checkAllSelected(isSelectedObject);
        console.log(isSelectedObject, 'isSelectedObject147');

        liftStyles.forEach(item => {
            item.totalCounts = shipping_type_counts[item.value];
        });
        console.log('liftStyles93', liftStyles);
        this.setData({
            items: items || [],
            isSelectedObject,
            isAllSelected,
            isLoading: false,
            products: products,
            liftStyles
        });
        this.calculatePrice();
    },

    checkAllSelected(isSelectedObject) {
        return Object.keys(isSelectedObject).filter(item => !isSelectedObject[item]) && !Object.keys(isSelectedObject).filter(item => !isSelectedObject[item]).length > 0;
    },

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
    // 全选商品逻辑
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
    // 更新购物车数据
    async updateCart({ detail }) {
        console.log(detail);
        const { items = [], shipping_type } = this.data;
        const { vendor } = app.globalData;
        const { value, postId, skuId, cartIndex: index } = detail;

        let { cart_item_id } = items[index];
        let requestData = {
            post_id: postId,
            sku_id: skuId,
            quantity: value,
            vendor,
            shipping_type,
            cart_item_id,
        };
        await api.hei.updateCart(requestData);

        const updateData = {};
        const quantitykey = `items[${index}].quantity`;
        updateData[quantitykey] = value;
        this.setData(updateData);
        this.calculatePrice();
    },
    // 删除某一购物车商品逻辑
    async onDelete(e) {
        const { items, isSelectedObject, shipping_type, liftStyles } = this.data;
        const { postId, skuId, index, itemId } = e.currentTarget.dataset;
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认删除商品？',
            confirmText: '删除',
            confirmColor: '#dc143c',
        });
        if (confirm) {
            let { cart_item_id } = items[index];
            let requestData = {
                post_id: postId,
                sku_id: skuId,
                shipping_type,
                cart_item_id,
            };

            const data = await api.hei.removeCart(requestData);
            wx.showToast({
                title: '成功删除',
            });
            items.splice(index, 1);
            liftStyles.forEach(item => {
                item.totalCounts = data.shipping_type_counts[item.value];
            });
            this.setData({ items, liftStyles });
            delete isSelectedObject[itemId];
            this.calculatePrice();
            const cartNumber = data.count;
            wx.setStorageSync('CART_NUM', cartNumber);
            updateTabbar({ tabbarStyleDisable: true, pageKey: 'cart' });
        }
    },
    // 清空某一配送方式购物车全部商品逻辑
    async onClearCart() {
        const { shipping_type, liftStyles } = this.data;
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认清空购物车？',
            confirmText: '清空',
            confirmColor: '#dc143c',
        });
        if (confirm) {
            const data = await api.hei.clearCart({
                shipping_type
            });
            wx.showToast({
                title: '成功清空购物车',
            });
            liftStyles.forEach(item => {
                item.totalCounts = data.shipping_type_counts[item.value];
            });
            this.setData({ items: [], isSelectedObject: {}, liftStyles });
            this.calculatePrice();
            const cartNumber = data.count;
            wx.setStorageSync('CART_NUM', cartNumber);
            updateTabbar({ tabbarStyleDisable: true, pageKey: 'cart' });
        }
    },

    // 用户授权之后才能下单
    async bindGetUserInfo(e) {
        console.log(e);
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            await getAgainUserForInvalid({ encryptedData, iv });
            this.onCreateOrder();
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    // 跳转到预下单页
    async onCreateOrder() {
        const { shipping_type, items, isSelectedObject, totalPostage } = this.data;
        const selectdItems = items.filter((item) => isSelectedObject[item.id]);
        app.globalData.currentOrder = {
            items: selectdItems,
            totalPostage,
        };
        wx.navigateTo({
            url: `/pages/orderCreate/orderCreate?shipping_type=${shipping_type}`,
        });
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

    navigateToHome() {
        autoNavigate('/pages/home/home');
    },

    // 初始化配送方式
    firstInit() {
        console.log('config72', this.data.config);
        let {
            config: {
                shipping_types,
                shipping_type_name = [],
            },
            liftStyleIndex
        } = this.data;
        const liftStyles = shipping_type_name.filter(item => {
            return shipping_types.indexOf(item.value) > -1;
        });
        console.log('data', liftStyles);
        this.setData({
            liftStyles,
            shipping_type: shipping_types[liftStyleIndex]
        });
    },

    // 列表导航模块
    changeNavbarList(e) {
        const { index, value } = e.detail;
        console.log('index297', index, 'value297', value);
        this.setData({
            items: [],
            liftStyleIndex: index,
            isLoading: true,
            shipping_type: value
        });
        console.log('liftStyleIndex323', index, 'shipping_type', this.data.shipping_type);
        this.loadCart();
    },

    // 展示商品留言
    onShowProductRemark(e) {
        let { index } = e.currentTarget.dataset,
            { items } = this.data;

        let { remarks } = items[index].product_annotation;
        // console.log('remarks', remarks);
        this.setData({
            isShowRemark: true,
            currentRemark: remarks,
        });
    },

    // 关闭商品留言
    onCloseRemark() {
        this.setData({ isShowRemark: false });
    },
});
