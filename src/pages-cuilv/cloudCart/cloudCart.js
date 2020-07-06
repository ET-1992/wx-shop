import { go } from 'utils/util';
import api from 'utils/api';
import { showModal } from 'utils/wxp';
import { CLOUD_CART_LIST_KEY, CONFIG } from 'constants/index';
import { createCloudOrder } from 'utils/pageShare';

Page({
    data: {
        title: 'cloudCart',
        isLoading: true,
        config: {},
        themeColor: {},
        items: [],  // 购物车商品组
        isSelectedObject: {},  // 是否选中商品组
        isAllSelected: false,  // 商品是否全选
        isShouldPay: false,  // 商品是否可支付
        totalPrice: '0',  // 购物车总价
        current_user: {},
    },

    go,

    onLoad(params) {
        console.log(params);
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const { themeColor } = getApp().globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            isIphoneX,
            themeColor,
            config,
        });
        this.getCartData();
    },

    onHide() {
        wx.setStorageSync(CLOUD_CART_LIST_KEY, this.data.isSelectedObject);
    },

    onUnload() {
        wx.setStorageSync(CLOUD_CART_LIST_KEY, this.data.isSelectedObject);
    },

    // 获取列表数据
    async getCartData() {
        const CLOUDCART = 1;
        const data = await api.hei.fetchCartList({ platform: CLOUDCART });
        let { items, current_user } = data;
        this.setData({
            isLoading: false,
            items,
            current_user,
        });
        this.getCheckboxSelected();
    },

    // 读取复选框选择情况
    getCheckboxSelected() {
        let { items } = this.data;
        const lastSelectedArray = wx.getStorageSync(CLOUD_CART_LIST_KEY);
        let isSelectedObject = {};
        items.forEach((item) => {
            let isSelected = (lastSelectedArray && lastSelectedArray[item.id]) || false;
            if (item.activity && item.activity.status === 1) {
                isSelectedObject[item.id] = isSelected;
            }
        });
        this.setData({
            isSelectedObject,
        });
        this.checkAllSelected();
        this.calculatePrice();
    },

    // 检查复选框是否全选
    checkAllSelected() {
        let { isSelectedObject } = this.data;
        let keys = Object.keys(isSelectedObject);
        // 未打勾的复选需
        let notSelecteKeys = keys.filter(item => {
            return !isSelectedObject[item];
        });
        // 全选
        let bingo = notSelecteKeys && notSelecteKeys.length === 0;
        this.setData({ isAllSelected: bingo });
    },

    // 选择复选框某件商品
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

    // 复选框商品全选
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

    // 删除商品
    async onDelete(e) {
        wx.setStorageSync(CLOUD_CART_LIST_KEY, this.data.isSelectedObject);
        let { postId, blogId } = e.target.dataset;
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确认删除商品？',
        });
        if (confirm) {
            const data = await api.hei.removeCart({
                post_id: postId,
                source_blog_id: blogId,
            });
            wx.showToast({
                title: '成功删除',
            });
            this.getCartData();
        }
    },

    // 更新购物车数量
    async updateCart(e) {
        wx.setStorageSync(CLOUD_CART_LIST_KEY, this.data.isSelectedObject);
        let { items } = this.data;
        let { postId, blogId } = e.target.dataset;
        let value = e.detail;
        await api.hei.updateCart({
            post_id: postId,
            source_blog_id: blogId,
            quantity: value,
        });
        items.forEach(item => {
            if (item.post_id === postId) {
                item.quantity = value;
            }
        });
        this.setData({ items });
        this.calculatePrice();
    },

    catchEvent() {
        console.log('捕获冒泡');
    },

    // 计算总价
    calculatePrice() {
        const { items, isSelectedObject } = this.data;
        let totalPrice = 0;
        items.forEach((item) => {
            if (isSelectedObject[item.id]) {
                const { price, quantity } = item;
                totalPrice = totalPrice + price * quantity;
            }
        });
        this.setData({ totalPrice });
        this.checkShouldPay();
    },

    // 检查是否可以支付
    checkShouldPay() {
        let { items, isSelectedObject } = this.data;
        let isSelectedArr = items.filter(item => {
            return isSelectedObject[item.id];
        });
        let isShouldPay = isSelectedArr && isSelectedArr.length > 0;
        this.setData({ isShouldPay });
    },

    // 支付
    async onPay() {
        let { items, isSelectedObject } = this.data;
        let arr = [];
        items.forEach(item => {
            if (isSelectedObject[item.id]) {
                arr.push({
                    product: item,
                    productNum: item.quantity,
                });
            }
        });
        const currentOrder = createCloudOrder(arr);
        getApp().globalData.currentOrder = currentOrder;
        wx.navigateTo({ url: `/pages-cuilv/coinOrderCreate/coinOrderCreate?pageValue=2` });
    },

    // 下拉刷新
    onPullDownRefresh() {
        wx.setStorageSync(CLOUD_CART_LIST_KEY, this.data.isSelectedObject);
        this.getCartData();
        wx.stopPullDownRefresh();
    },
});
