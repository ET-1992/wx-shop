import { auth, autoTransformAddress, subscribeMessage } from 'utils/util';
import { showModal, chooseAddress } from 'utils/wxp';
import api from 'utils/api';
import { ADDRESS_KEY, CONFIG, USER_KEY } from 'constants/index';
import { wxPay } from 'utils/pageShare';

const app = getApp();

Page({
    data: {
        title: 'coinOrderCreate',
        isLoading: true,
        address: {},
        expressType: 1,  // 快递方式-默认快递
        items: {},  // sku数据
        fee: {},  // 订单数据
        formValidateFail: true, // 表单验证
        cloudOrder: [],  // 云购订单
        pay_sign: '',
        order_no: '',
        current_user: {},
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG);
        const current_user = wx.getStorageSync(USER_KEY);
        this.setData({
            config,
            current_user,
        });
        this.initData();
        this.initPage(params);
    },

    // 初始化本地数据
    initData() {
        const address = wx.getStorageSync(ADDRESS_KEY) || {};
        const systemInfo = wx.getSystemInfoSync();
        const { themeColor } = getApp().globalData;
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        this.setData({
            themeColor,
            isIphoneX,
            address,
        });
    },

    // 渲染页面分配
    initPage(params) {
        let { pageValue, expressType, orderAmount } = params;
        const pageArr = [
            // 金币兑换页面
            { value: '1', page: 'COINEXCHANGE' },
            // 云购页面
            { value: '2', page: 'COINDRAW' }
        ];
        let pageStr = '';
        pageArr.forEach(item => {
            if (item.value === pageValue) {
                pageStr = item.page;
            }
        });
        if (pageStr === 'COINEXCHANGE') {
            this.setData({
                pageValue,
                expressType,  // 快递方式
            });
            this.getPrepareData();
        } else if (pageStr === 'COINDRAW') {
            this.setData({
                pageValue,
            });
            this.getCloudPrepareData();
        }

    },

    // 填写地址
    async onAddress() {
        const res = await auth({
            scope: 'scope.address',
            ctx: this,
            isFatherControl: true
        });
        if (res) {
            const addressRes = await chooseAddress();
            this.setData({ address: addressRes });
            wx.setStorageSync(ADDRESS_KEY, addressRes);
        }
    },

    // 获取金币兑换预下单数据
    async getPrepareData() {
        let { expressType } = this.data;
        const { items } = app.globalData.currentOrder;
        let requestData = {
            promotion_type: 6
        };
        requestData.shipping_type = Number(expressType);
        requestData.posts = JSON.stringify(items);
        let { fee } = await api.hei.orderPrepare(requestData);
        this.setData({
            items,
            fee,
            isLoading: false,
        });
    },

    // 获取云购预下单数据
    getCloudPrepareData() {
        const arr = app.globalData.currentOrder;
        console.log('arr', arr);
        this.setData({
            isLoading: false,
            cloudOrder: arr,
        });
    },

    // 金币兑换支付
    async onExchangePay() {
        await this.formValidation();
        let { formValidateFail } = this.data;
        if (formValidateFail) { return }
        await this.postOrder();
        let { pay_sign, order_no, items: { coin_price }} = this.data;
        if (!order_no) { return }
        try {
            if (pay_sign) {
                await wxPay(pay_sign, order_no);
            } else if (coin_price > 0) {
                return;
            }
            wx.redirectTo({
                url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
            });
        } catch (error) {
            console.log('error', error);
        }
    },

    // 云购支付
    async onCoinPay() {
        let { cloudOrder } = this.data;
        let subKeys = [{ key: 'activity_drawed' }];
        try {
            let isBreak = await this.checkNumIsOut();
            if (isBreak) return;
            wx.showLoading();
            const data = await api.hei.postCreatDrawOrder({
                posts: JSON.stringify(cloudOrder),
            });
            wx.hideLoading();
            await subscribeMessage(subKeys);
            const { confirm } = await showModal({
                content: '购买成功！',
                showCancel: false,
            });
            if (confirm) {
                wx.redirectTo({ url: `/pages-cuilv/joinRecord/joinRecord` });
            }
        } catch (e) {
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg || '支付出错了',
                showCancel: false,
            });
        }
    },

    // 请求支付后台-金币兑换
    async postOrder() {
        let { items, address } = this.data;
        const pay_method = 'WEIXIN';
        let newAddress = autoTransformAddress(address);
        try {
            wx.showLoading({
                title: '处理订单中',
                mark: true,
            });
            const data = await api.hei.postCreatCoinOrder({
                posts: JSON.stringify(items),
                pay_method,
                ...newAddress
            });
            wx.hideLoading();
            const { pay_sign, order_no } = data;
            this.setData({
                pay_sign,
                order_no,
            });
        } catch (error) {
            wx.hideLoading();
            this.setData({
                pay_sign: '',
                order_no: '',
            });
            wx.showModal({
                title: '温馨提示',
                content: error.errMsg,
                showCancel: false,
            });
        }
    },

    // 地址表单验证
    formValidation() {
        let { address } = this.data;
        let formValidateFail = false;
        if (!address || !address.userName) {
            wx.showModal({
                title: '温馨提示',
                content: '请先填写地址信息',
                showCancel: false,
            });
            formValidateFail = true;
        }
        this.setData({ formValidateFail });
    },

    // 检查云购数量是否超出该期剩余
    async checkNumIsOut() {
        let { cloudOrder = [] } = this.data;
        let pass = cloudOrder.every(item => {
            let { quantity, current_quantity, realQuantity } = item;
            let resNum = realQuantity - current_quantity;
            return resNum >= quantity;
        });
        if (!pass) {
            const { cancel } =  await showModal({
                title: '温馨提示',
                content: '当前购买数量超过该期商品余数，是否自动转入下一期'
            });
            if (cancel) {
                return true;
            }
        }
        return false;
    },
});
