import api from 'utils/api';
import { chooseAddress, showModal, getSetting } from 'utils/wxp';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY } from 'constants/index';
// import { CART_LIST_KEY, phoneStyle } from 'constants/index';
const app = getApp();

Page({
    data: {
        title: 'orderCreate',

        savePrice: 0,
        totalPrice: 0,
        items: [],
        grouponId: '',
        isCancel: false,
        address: {
            userName: '',
        },
        buyerMessage: '',
        totalPostage: 0,
        couponPrice: 0,
        orderPrice: 0,
        coupons: {
            recommend: {},
            available: [],
            unavailable: [],
            selected: {},
        },
        nowTS: Date.now() / 1000,
        wallet: {},
        coin_in_order: {},
        fee: {},
        useCoin: 0, // 使用多少金币
        shouldGoinDisplay: false, // 是否显示金币
        maxUseCoin: 0, // 最多可使用金币
        finalPay: 0,
        user_coupon_ids: '', // 选择的优惠券ID
        isGrouponBuy: false, // 是否拼团订单
        isHaveUseCoupon: true,
        isPeanutPay: false, // 是否第三方支付
        modal: {}, // 弹窗数据
        isShouldRedirect: false,
        isDisablePay: true,
        refuseAddress: false
    },

    // onLoad() {
    // 	const { themeColor } = app.globalData;
    // 	const { isIphoneX } = app.systemInfo;
    // 	this.setData({ themeColor, isIphoneX });
    // },

    async onShow() {
        console.log(this.options);
        console.log(app.globalData);
        if (app.globalData.extraData && app.globalData.extraData.isPeanutPayOk && this.data.isShouldRedirect) {
            wx.redirectTo({
                url: `/pages/orderDetail/orderDetail?id=${app.globalData.extraData.order_no}&isFromCreate=true`,
            });
        }

        const setting = await getSetting();
        console.log(setting);
        if (setting.authSetting['scope.address']) {
            this.setData({
                refuseAddress: false,
                addressModal: {
                    isFatherControl: false,
                },
            });
        }
    },

    async onLoad() {
        // this.checkPhoneModel();
        const { themeColor } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        this.setData({ themeColor, isIphoneX });
        try {
            // isCancel 仅在跳转支付后返回 标识是否取消支付
            const { grouponId, isGrouponBuy } = this.options;
            const { currentOrder } = app.globalData;
            const { items, totalPostage } = currentOrder;
            const address = wx.getStorageSync(ADDRESS_KEY) || {};
            const totalPrice = currentOrder.totalPrice;
            // let totalPostage = 0;

            this.setData({
                address,
                totalPrice,
                items,
                isGrouponBuy: isGrouponBuy || null,
                grouponId: grouponId || null,
                totalPostage,
                isShouldRedirect: false
            }, () => {
                if (!isGrouponBuy) {
                    app.event.on('getCouponIdEvent', this.getCouponIdEvent, this);
                }
                this.onLoadData();
            });
        }
        catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }

        console.log(this.data);
    },

    onUnload() {
        console.log('--- onUnLoad ----');
        app.globalData.currentOrder = {};

        // console.log(JSON.stringify(app.globalData.currentOrder));
        wx.removeStorageSync('orderCreate');
        app.event.off('getCouponIdEvent', this);
    },

    onHide() {
        console.log('--- onHide ----');

        // wx.clearStorageSync('orderCreate');
    },

    onInput(ev) {
        const { value } = ev.detail;
        this.setData({ buyerMessage: value });
    },

    async onAddress() {

        try {
            const address = await chooseAddress();
            wx.setStorageSync(ADDRESS_KEY, address);
            this.setData({
                address,
                refuseAddress: false
            }, () => {
                this.onLoadData();
            });

        } catch (err) {
            console.log(err.errMsg);
            // const addressStorage = wx.getStorageSync(ADDRESS_KEY);
            const setting = await getSetting();
            console.log(setting);
            if (!setting.authSetting['scope.address']) {
                this.setData({
                    refuseAddress: true
                }, () => {
                    this.onModal();
                });
            }
        }
    },

    onModal() {
        this.setData({
            addressModal: {
                isFatherControl: true,
                title: '温馨提示',
                isShowModal: true,
                body: '请授权地址信息',
                type: 'button',
                buttonData: {
                    opentype: 'openSetting'
                }
            },
        });
    },

    async getCouponId() {
        const { coupons } = this.data;
        wx.setStorageSync('orderCoupon', coupons);
        wx.navigateTo({
            url: '/pages/orderCoupons/orderCoupons',
        });
    },

    getCouponIdEvent(data) {
        this.setData({
            user_coupon_ids: (data && data.user_coupon_id) || -1
        }, () => {
            this.onLoadData();
        });
    },

    async onLoadData() {
        const { address, items, totalPrice, user_coupon_ids, isGrouponBuy } = this.data;
        console.log(totalPrice, 'totalPrice');
        let requestData = {};
        if (address) {
            requestData = {
                receiver_name: address.userName,
                receiver_phone: address.telNumber,
                receiver_country: address.nationalCode,
                receiver_state: address.provinceName,
                receiver_city: address.cityName,
                receiver_district: address.countyName,
                receiver_address: address.detailInfo,
                receiver_zipcode: address.postalCode
            };
        }

        if (user_coupon_ids) { // 团购无优惠卷
            requestData.user_coupon_ids = user_coupon_ids;
        }

        if (isGrouponBuy) {
            requestData.order_type = 'groupon';
        }
        requestData.posts = JSON.stringify(items);
        const { coupons, wallet, coin_in_order, fee, use_platform_pay } = await api.hei.orderPrepare(requestData);
        const shouldGoinDisplay = coin_in_order.enable && coin_in_order.order_least_cost <= fee.amount && fee.amount;
        const maxUseCoin = Math.floor((fee.amount - fee.postage) * coin_in_order.percent_in_order);
        const useCoin = Math.min(maxUseCoin, wallet.coins);
        console.log(useCoin);
        this.setData({
            coupons,
            wallet,
            coin_in_order,
            fee,
            shouldGoinDisplay,
            maxUseCoin,
            useCoin,
            user_coupon_ids: coupons.recommend && coupons.recommend.user_coupon_id || '',
            isHaveUseCoupon: (coupons.available && coupons.available.length > 0) ? true : false,
            isPeanutPay: use_platform_pay,
            isDisablePay: false
        }, () => {
            this.computedFinalPay();
        });
    },

    setUseCoin(e) {
        this.setData({
            useCoin: e.detail || 0
        }, () => {
            this.computedFinalPay();
        });
    },

    computedFinalPay() {
        const { useCoin, fee, isGrouponBuy, totalPostage, totalPrice, shouldGoinDisplay } = this.data;
        let finalPay = 0;
        if (!isGrouponBuy) {
            if (shouldGoinDisplay) {
                finalPay = fee.amount - useCoin / 100;
            } else {
                finalPay = fee.amount;
            }
            if (finalPay < 0) {
                finalPay = 0;
            }
            finalPay = Number(finalPay).toFixed(2);
        } else {
            finalPay = Number(totalPostage + totalPrice).toFixed(2);
        }

        this.setData({
            finalPay
        });
    },

    async onPay(ev) {
        console.log(ev, 'ev');
        const { formId } = ev.detail;
        const {
            address,
            items,
            buyerMessage,
            grouponId,
            isGrouponBuy,
            user_coupon_ids,
            useCoin,
            shouldGoinDisplay
        } = this.data;
        const {
            userName,
            telNumber,
            provinceName,
            cityName,
            countyName,
            postalCode,
            nationalCode,
            detailInfo,
        } = address;
        const { vendor } = app.globalData;
        console.log(vendor);

        if (!userName) {
            wx.showModal({
                title: '提示',
                content: '请先填写地址',
                showCancel: false,
            });
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

        if (user_coupon_ids) {
            requestData.user_coupon_ids = user_coupon_ids;
        }

        if (useCoin && shouldGoinDisplay) {
            requestData.coins = useCoin;
        }

        // 如果团购 团购接口 上传的数据 不是直接上传posts, 需要上传sku_id, quantity, post_id|id(grouponId)
        if (isGrouponBuy) {
            requestData.sku_id = items[0].sku_id;
            requestData.quantity = items[0].quantity;
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
            const { order_no, status, pay_sign, pay_appid } = await api.hei[method](requestData);
            // console.log(order_no, status, pay_sign, pay_appid, 'pay');
            wx.hideLoading();

            if (this.data.finalPay <= 0) {
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
                });
            }

            if (pay_sign) {
                console.log('自主支付');
                await wxPay(pay_sign);
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
                });
            }
            else if (pay_appid) {
                console.log('平台支付');

                this.setData({
                    modal: {
                        isFatherControl: true,
                        title: '温馨提示',
                        isShowModal: true,
                        body: '确定要提交订单吗？',
                        type: 'navigate',
                        navigateData: {
                            url: `/pages/peanutPay/index?order_no=${order_no}`,
                            appId: pay_appid,
                            target: 'miniProgram',
                            version: 'develop',
                            extraData: {
                                order_no: order_no,
                                address: this.data.address,
                                items: this.data.items,
                                totalPrice: this.data.totalPrice,
                                totalPostage: this.data.fee.postage,
                                orderPrice: this.data.finalPay,
                                coupons: this.data.fee.coupon_reduce_fee,
                                buyerMessage: this.data.buyerMessage,
                                coinPrice: this.data.useCoin,
                            }
                        }
                    },
                });
            }
        }
        catch (err) {
            console.log(err);
            wx.hideLoading();
            showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    onCancel() {
        this.setData({
            'modal.isShowModal': false,
            isShouldRedirect: false
        });
    },

    onConfirm() {
        this.setData({
            'modal.isShowModal': false,
            isShouldRedirect: true
        });
    },
    onAddressCancel() {
        this.setData({
            'addressModal.isShowModal': false,
            isShouldRedirect: false
        });
    },

    onAddressConfirm() {
        this.setData({
            'addressModal.isShowModal': false,
            isShouldRedirect: true
        });
    }

    // checkPhoneModel() {
    // 	wx.getSystemInfo({
    // 		success: (res) => {
    // 			this.setData({
    // 				phoneModel: phoneStyle[res.model] || ''
    // 			});
    // 			console.log(res.model);
    // 		}
    // 	});
    // }
});
