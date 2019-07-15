import api from 'utils/api';
import { chooseAddress, showModal, getSetting, authorize } from 'utils/wxp';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY, CONFIG, PAY_STYLES } from 'constants/index';
import { auth } from 'utils/util';
// import { CART_LIST_KEY, phoneStyle } from 'constants/index';
const app = getApp();

Page({
    data: {
        title: 'orderCreate',
        liftStyles: [
            { title: '快递', value: 'express', checked: 'true' },
            { title: '自提', value: 'lift' }
        ],
        liftStyle: 'express',
        liftInfo: {
            isCanInput: true,
            isCanNav: true
        },
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
        PAY_STYLES,
        selectedPayValue: 'weixin'
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
    },

    async onLoad() {
        // this.checkPhoneModel();
        const { themeColor, defineTypeGlobal } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        const config = wx.getStorageSync(CONFIG);
        const { self_lifting_enable, self_lifting_only } = config;
        let liftStyle;
        if (self_lifting_enable && self_lifting_only) {
            liftStyle = 'lift';
        }
        this.setData({
            themeColor,
            isIphoneX,
            defineTypeGlobal,
            config,
            liftStyle
        });
        try {
            // isCancel 仅在跳转支付后返回 标识是否取消支付
            const { grouponId, isGrouponBuy, crowd = false, groupon_commander_price = false } = this.options;
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
                isShouldRedirect: false,
                crowd,
                groupon_commander_price
            }, () => {
                if (!isGrouponBuy) {
                    app.event.on('getCouponIdEvent', this.getCouponIdEvent, this);
                }
                app.event.on('getLiftInfoEvent', this.getLiftInfoEvent, this);
                app.event.on('setOverseeAdressEvent', this.setOverseeAdressEvent, this);
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

        // console.log(this.data);
    },

    onUnload() {
        // console.log('--- onUnLoad ----');
        app.globalData.currentOrder = {};

        // console.log(JSON.stringify(app.globalData.currentOrder));
        wx.removeStorageSync('orderCreate');
        app.event.off('getCouponIdEvent', this);
        app.event.off('getLiftInfoEvent', this);
        app.event.off('setOverseeAdressEvent', this);
    },

    onHide() {
        // console.log('--- onHide ----');

        // wx.clearStorageSync('orderCreate');
    },

    onInput(ev) {
        const { value } = ev.detail;
        this.setData({ buyerMessage: value });
    },

    async onAddress() {
        const { self_address } = this.data.config;
        if (self_address) {
            wx.navigateTo({
                url: '/pages/selfAddress/selfAddress'
            });
            return;
        }
        const res = await auth({
            scope: 'scope.address',
            ctx: this,
            isFatherControl: true
        });
        if (res) {
            const addressRes = await chooseAddress();
            this.setData({ address: addressRes });
            wx.setStorageSync(ADDRESS_KEY, addressRes);
            this.onLoadData();
        }
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

    getLiftInfoEvent(data) {
        // console.log('getLiftInfoEvent', data);
        const { liftInfo } = this.data;

        this.setData({
            liftInfo: { ...liftInfo, ...data }
        });
    },

    setOverseeAdressEvent(selfAddressObj) {
        // console.log('setOverseeAdressEvent');
        this.setData({
            address: selfAddressObj
        });
    },

    updateLiftInfo(e) {
        // console.log(e);
        const { liftInfo = {}} = this.data;
        this.setData({
            liftInfo: { ...liftInfo, ...e.detail }
        }, () => {
            console.log(this.data.liftInfo);
        });
    },

    async onLoadData() {
        try {
            let { address, items, totalPrice, user_coupon_ids, isGrouponBuy, liftStyle, grouponId } = this.data;
            // console.log(totalPrice, 'totalPrice');
            let requestData = {};
            if (address) {
                requestData = {
                    receiver_name: address.userName || '',
                    receiver_phone: address.telNumber || '',
                    receiver_country: address.nationalCode || '',
                    receiver_state: address.provinceName || '',
                    receiver_city: address.cityName || '',
                    receiver_district: address.countyName || '',
                    receiver_address: address.detailInfo || '',
                    receiver_zipcode: address.postalCode || ''
                };
            }

            if (user_coupon_ids) { // 团购无优惠卷
                requestData.user_coupon_ids = user_coupon_ids;
            }

            if (isGrouponBuy) {
            // requestData.order_type = 'groupon';
                requestData.order_type = 1;     // 后端改post参数
            }
            if (grouponId) {
                requestData.groupon_id = grouponId;
            }

            if (liftStyle === 'lift') {
                requestData.shipping_type = 2;
            }

            requestData.posts = JSON.stringify(items);
            const { coupons, wallet, coin_in_order, fee, use_platform_pay, self_lifting_enable, order_annotation, product_type, payment_tips, self_lifting_only, store_card } = await api.hei.orderPrepare(requestData);
            const shouldGoinDisplay = coin_in_order.enable && coin_in_order.order_least_cost <= fee.amount && fee.amount;
            const maxUseCoin = Math.floor((fee.amount - fee.postage) * coin_in_order.percent_in_order);

            // console.log(maxUseCoin, 'maxUseCoin');
            const useCoin = Math.min(maxUseCoin, wallet.coins);
            // console.log(useCoin);

            if (self_lifting_only) {
                liftStyle = 'lift';
            }

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
                selfLiftEnable: self_lifting_enable,
                isDisablePay: false,
                order_annotation,
                product_type,
                payment_tips,
                self_lifting_only,
                liftStyle,
                store_card
            }, () => {
                this.computedFinalPay();
            });
        } catch (err) {
            console.log(err);
            showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
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
        // console.log(useCoin, shouldGoinDisplay);
        if (shouldGoinDisplay && !isGrouponBuy) {
            finalPay = fee.amount - useCoin / 100;
        } else {
            finalPay = fee.amount;
        }
        if (finalPay < 0) {
            finalPay = 0;
        }
        finalPay = Number(finalPay).toFixed(2);

        this.setData({
            finalPay
        });
    },

    async onPay(ev) {
        // console.log(ev, 'ev');
        const { formId, crowd, crowdtype } = ev.detail;
        const {
            address,
            items,
            buyerMessage,
            grouponId,
            isGrouponBuy,
            user_coupon_ids,
            useCoin,
            shouldGoinDisplay,
            liftStyle,
            liftInfo,
            order_annotation,
            product_type,
            selfLiftEnable,
            selectedPayValue,
            store_card
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
        const { vendor, afcode } = app.globalData;
        // console.log(vendor, afcode, 'globalData');

        if (!userName && !detailInfo && liftStyle !== 'lift' && product_type !== 1) {
            wx.showModal({
                title: '提示',
                content: '请先填写地址',
                showCancel: false,
            });
            return;
        }

        if (liftStyle === 'lift' && !liftInfo.receiver_address_name && product_type !== 1 && selfLiftEnable) {
            wx.showModal({
                title: '提示',
                content: '请先选择自提地址',
                showCancel: false,
            });
            return;
        }

        if (liftStyle === 'lift' && !liftInfo.receiver_phone && product_type !== 1 && selfLiftEnable) {
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel: false,
            });
            return;
        }

        wx.setStorageSync(ADDRESS_KEY, address);

        let method = 'createOrderAndPay';

        let requestData = {
            receiver_name: userName || '',
            receiver_phone: telNumber || '',
            receiver_country: nationalCode || '',
            receiver_state: provinceName || '',
            receiver_city: cityName || '',
            receiver_district: countyName || '',
            receiver_address: detailInfo || '',
            receiver_zipcode: postalCode || '',
            buyer_message: buyerMessage,
            form_id: formId,
            vendor,
            afcode,
            pay_method: selectedPayValue
        };

        if (order_annotation && order_annotation.length > 0) {
            const orderForm = this.selectComponent('#orderForm');
            // console.log(orderForm.data, 'orderForm');
            const { annotation, dns_obj } = orderForm.data;
            annotation.forEach((item, index) => {
                if (item.required && !dns_obj[item.name]) {
                    item.isError = true;
                }
            });
            this.setData({
                order_annotation: annotation
            });
            const error = annotation.filter((item) => {
                return (item.isError === true);
            });
            console.log(error);
            if (error.length > 0) {
                wx.showModal({
                    title: '提示',
                    content: '请检查留言信息，带*号为必填项',
                    showCancel: false,
                });
                return;
            } else {
                requestData.annotation = JSON.stringify({ remarks: dns_obj });
            }
        }

        if (store_card && store_card.store_card_enable && selectedPayValue === 'store_card') {
            const { confirm } = await showModal({
                title: '提示',
                content: '您确定要用储值卡支付吗？',
                showCancel: true,
            });
            if (!confirm) {
                return;
            }
        }

        wx.showLoading({
            title: '处理订单中',
            mark: true,
        });

        if (user_coupon_ids) {
            requestData.user_coupon_ids = user_coupon_ids;
        }

        if (useCoin && shouldGoinDisplay) {
            requestData.coins = useCoin;
        }

        if (liftStyle === 'lift') {
            requestData.shipping_type = 2;
            requestData = { ...requestData, ...liftInfo };
            wx.setStorageSync('liftInfo', liftInfo);
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

        if (crowd) {
            requestData.type = 5;
            requestData.crowd_type = crowdtype;
            method = 'createOrder';
        }

        try {
            const { order_no, status, pay_sign, pay_appid, crowd_pay_no, order } = await api.hei[method](requestData);
            // console.log(order_no, status, pay_sign, pay_appid, crowd_pay_no, 'pay');
            wx.hideLoading();

            if (crowd && crowd_pay_no) {
                wx.redirectTo({
                    url: `/pages/crowd/inviteCrowd/inviteCrowd?id=${order_no}&crowd_pay_no=${crowd_pay_no}`,
                });
            } else {
                if (this.data.finalPay <= 0 || order.pay_method === 'STORE_CARD') {
                    wx.redirectTo({
                        url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=true`,
                    });
                }

                if (pay_sign) {
                    console.log('自主支付');
                    await wxPay(pay_sign, order_no);
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
            'authModal.isShowModal': false,
            isShouldRedirect: false
        });
    },
    onAddressConfirm() {
        this.setData({
            'authModal.isShowModal': false,
            isShouldRedirect: true
        });
    },

    /* radio选择改变触发 */
    radioChange(e) {
        if (e.detail.value === 'lift') {
            const liftInfo = wx.getStorageSync('liftInfo');
            if (liftInfo) {
                this.setData({
                    liftInfo
                });
            }
        }
        this.setData({
            liftStyle: e.detail.value
        }, () => {
            this.onLoadData();
        });
    },

    pickPayStyle(e) {
        const { value } = e.currentTarget.dataset;
        const { store_card, finalPay } = this.data;
        if (value === 'store_card' && store_card && store_card.store_card_enable && (Number(store_card.balance) < Number(finalPay))) {
            wx.showModal({
                title: '提示',
                content: '您的储值卡余额不足，请到会员中心充值',
                showCancel: false,
            });
        } else {
            this.setData({
                selectedPayValue: value
            });
        }
    }
});
