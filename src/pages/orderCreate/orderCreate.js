import api from 'utils/api';
import {chooseAddress, showModal} from 'utils/wxp';
import {wxPay} from 'utils/pageShare';
import {ADDRESS_KEY} from 'constants/index';

const app = getApp();

Page({
    data: {
        title: 'orderCreate',

        savePrice: 0,
        totalPrice: 0,
        items: [],

        isGroupon: 0,
        grouponId: '',
        skuId: '',
        quantity: 1,
        address: {
            userName: ''
        },
        buyerMessage: '',
        totalPostage: 0,
        couponPrice: 0, //此功能未开放

    },

    onShow() {
        const {isGroupon, grouponId, skuId, quantity} = wx.getStorageSync('orderCreateObj')
        const {currentOrder} = app.globalData;
        console.log(app.globalData)
        const address = wx.getStorageSync(ADDRESS_KEY) || {};
        let totalPostage = 0;
        currentOrder.items.forEach((item) => {
            const {postage} = item;
            if (postage > totalPostage) {
                totalPostage = postage;
            }
        });
        currentOrder.totalPostage = totalPostage;
        currentOrder.isGroupon = isGroupon;
        currentOrder.grouponId = grouponId;
        currentOrder.skuId = skuId;
        currentOrder.quantity = quantity;
        currentOrder.address = address;
        this.setData(currentOrder);
    },

    onUnLoad() {
        app.globalData.currentOrder = {};
    },

    onInput(ev) {
        const {value} = ev.detail;
        this.setData({buyerMessage: value});
    },

    async onAddress() {
        const address = await chooseAddress();
        wx.setStorageSync(ADDRESS_KEY, address);
        this.setData({address});
    },

    async onPay(ev) {
        const {formId} = ev.detail;
        const {address, items, buyerMessage, grouponId, isGroupon, skuId, quantity} = this.data;
        const {userName, telNumber, provinceName, cityName, countyName, postalCode, nationalCode, detailInfo} = address;
        const {vendor} = app.globalData;

        if(!userName) {
            wx.showModal({
                title: '提示',
                content: '请先填写地址',
                showCancel: false,
            })
            return;
        }

        wx.setStorageSync(ADDRESS_KEY, address);

        let method = 'createOrderAndPay';
        wx.showLoading({
            title: '处理订单中',
            mark: true,
        });
        const requestData = {
            receiver_name: userName,
            receiver_phone: telNumber,
            receiver_country: nationalCode,
            receiver_state: provinceName,
            receiver_city: cityName,
            receiver_district: countyName,
            receiver_address: detailInfo,
            receiver_zipcode: postalCode,
            buyer_message: buyerMessage,
            form_id: formId,
            vendor,
        };

        if (isGroupon) {
            requestData.sku_id = skuId;
            requestData.quantity = quantity;
            if (grouponId) {
                requestData.id = grouponId;
                method = 'joinGroupon';
            }
            else {
                requestData.post_id = items[0].id;
                method = 'createGroupon';
            }
        }
        else {
            requestData.posts = JSON.stringify(items);
        }

        try {
            const {order_no, pay_sign} = await api.hei[method](requestData);
            wx.hideLoading();
            if (pay_sign) {
                await wxPay(pay_sign);
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${order_no}`
                });
            }
        }
        catch (err) {
            wx.hideLoading();
            showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }


    }
});
