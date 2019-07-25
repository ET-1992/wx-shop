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
            { title: '快递', value: 'express', checked: false, visible: false },
            { title: '自提', value: 'lift', checked: false, visible: false },
            { title: '送货上门', value: 'delivery', checked: false, visible: false }
        ],
        liftStyle: 'express',
        listStyleIndex: 0,
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
        selectedPayValue: 'weixin',
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
        let liftStyle = 'express';
        if (self_lifting_enable && self_lifting_only) {
            liftStyle = 'lift';
        }
        this.setData({
            themeColor,
            isIphoneX,
            defineTypeGlobal,
            config
        });
        try {
            // isCancel 仅在跳转支付后返回 标识是否取消支付
            const { grouponId, isGrouponBuy, crowd = false, groupon_commander_price = false } = this.options;
            const { currentOrder } = app.globalData;
            const { items, totalPostage } = currentOrder;
            const address = wx.getStorageSync(ADDRESS_KEY) || {};
            const totalPrice = currentOrder.totalPrice || 0;
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
                app.event.on('getStoreInfoEvent', this.getStoreInfoEvent, this);
                app.event.on('setOverseeAdressEvent', this.setOverseeAdressEvent, this);
                this.firstInit();
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
        app.event.off('getStoreInfoEvent', this);
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

    // 从 liftList 页面获取自提地址
    getLiftInfoEvent(data) {
        console.log('getLiftInfoEvent', data);
        const { liftInfo } = this.data;

        this.setData({
            liftInfo: { ...liftInfo, ...data }
        });
        console.log('liftInfo193', this.data.liftInfo);
    },

    setOverseeAdressEvent(selfAddressObj) {
        // console.log('setOverseeAdressEvent');
        this.setData({
            address: selfAddressObj
        });
    },

    // 从 liftList 页面获取门店地址
    getStoreInfoEvent(data) {
        // console.log('getStoreInfoEvent', data);
        const times = data[0].times || [];
        console.log('times', times);
        this.setData({
            storeListAddress: data,
            homeDeliveryTimes: times
        });
        console.log('storeListAddress211', this.data.storeListAddress);
        console.log('homeDeliveryTimes', this.data.homeDeliveryTimes);
    },

    // 更新自提地址
    updateLiftInfo(e) {
        console.log(e);
        const { liftInfo = {}} = this.data;
        this.setData({
            liftInfo: { ...liftInfo, ...e.detail }
        }, () => {
            console.log(this.data.liftInfo);
        });
    },

    // 初始化配送方式
    firstInit() {
        let {
            config: {
                logistics_enable,
                self_lifting_enable,
                home_delivery_enable
            },
            liftStyles,
            liftStyle,
            listStyleIndex
        } = this.data;

        let configLiftStyles = [
            {
                value: 'express',
                visible: logistics_enable
            },
            {
                value: 'lift',
                visible: self_lifting_enable
            },
            {
                value: 'delivery',
                visible: home_delivery_enable
            }
        ];

        if (logistics_enable || self_lifting_enable || home_delivery_enable) {
            liftStyles.forEach((item, index) => {
                item.visible = item && (item.value === configLiftStyles[index].value) && configLiftStyles[index].visible;
            });
            if (!listStyleIndex) {
                let listStyleIndex = configLiftStyles.findIndex(item => {
                    return item.visible === true;
                });
                console.log(listStyleIndex, 'listStyleIndex');
                liftStyles[listStyleIndex].checked = true;
                liftStyle = liftStyles[listStyleIndex].value;
                this.setData({
                    liftStyle,
                    liftStyles
                });
            }
        }
    },

    async onLoadData() {
        try {
            // let { address, items, totalPrice, user_coupon_ids, isGrouponBuy, liftStyle, grouponId } = this.data;
            let {
                address,
                items,
                totalPrice,
                user_coupon_ids,
                isGrouponBuy,
                liftStyle,
                grouponId,
                // seckill_product_id,
                // seckill,
                liftStyles,
                config: {
                    logistics_enable,
                    self_lifting_enable,
                    home_delivery_enable
                },
                listStyleIndex
            } = this.data;
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

            if (liftStyle === 'lift') { // 自提订单
                requestData.shipping_type = 2;
            }

            if (liftStyle === 'delivery') { // 送货上门订单
                requestData.shipping_type = 4;
            }

            requestData.posts = JSON.stringify(items);

            const { coupons, wallet, coin_in_order, fee, use_platform_pay, order_annotation, product_type, payment_tips, store_card } = await api.hei.orderPrepare(requestData);
            const shouldGoinDisplay = coin_in_order.enable && coin_in_order.order_least_cost <= fee.amount && fee.amount;
            const maxUseCoin = Math.floor((fee.amount - fee.postage) * coin_in_order.percent_in_order);

            // console.log(maxUseCoin, 'maxUseCoin');
            const useCoin = Math.min(maxUseCoin, wallet.coins);
            // console.log(useCoin);

            // if (self_lifting_only) {
            //     liftStyle = 'lift';
            // }

            this.setData({
                coupons,
                wallet,
                coin_in_order,
                fee,
                shouldGoinDisplay,
                maxUseCoin,
                useCoin,
                user_coupon_ids: (coupons.recommend && coupons.recommend.user_coupon_id) || '',
                isHaveUseCoupon: (coupons.available && coupons.available.length > 0),
                isPeanutPay: use_platform_pay || '',
                selfLiftEnable: self_lifting_enable,
                isDisablePay: false,
                order_annotation,
                product_type,
                payment_tips,
                liftStyle,
                store_card,
                liftStyles,
                logistics_enable, // 快递
                self_lifting_enable, // 自提
                home_delivery_enable // 送货上门
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
            store_card,
            storeListAddress
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

        // 自提需传数据
        if (liftStyle === 'lift') {
            requestData.shipping_type = 2;
            requestData = { ...requestData, ...liftInfo };
            wx.setStorageSync('liftInfo', liftInfo);
        }

        // 送货上门需传数据
        if (liftStyle === 'delivery') {
            requestData.shipping_type = 4;
            // 获取门店列表的门店名称
            if (!(storeListAddress && storeListAddress[0] && storeListAddress[0].name)) {
                wx.showModal({
                    title: '提示',
                    content: '请选择门店',
                    showCancel: false,
                });
                return;
            } else {
                requestData.receiver_address_name = storeListAddress[0].name;
            }
            // 直接获取送货上门子组件的任意数据和方法
            const delivery = this.selectComponent('#delivery');
            const { homeDeliveryTimes, index } = delivery.data;
            if (!(homeDeliveryTimes && homeDeliveryTimes[index])) {
                wx.showModal({
                    title: '提示',
                    content: '请到后台设置该门店配送时间',
                    showCancel: false,
                });
                return;
            } else {
                requestData.receiver_delivery_time = homeDeliveryTimes[index];
            }
            console.log(homeDeliveryTimes[index]);
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

        // 代付
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
        const { liftStyles } = this.data;
        const { value: index } = e.detail;
        if (liftStyles[index].value === 'lift') {
            const liftInfo = wx.getStorageSync('liftInfo');
            if (liftInfo) {
                this.setData({
                    liftInfo
                });
            }
        }
        liftStyles.forEach((item) => {
            if (item.value === liftStyles[index].value) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        });
        this.setData({
            liftStyle: liftStyles[index].value,
            listStyleIndex: index,
            liftStyles
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
