import api from 'utils/api';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY, CONFIG, PAY_STYLES, LOCATION_KEY } from 'constants/index';
import { auth, subscribeMessage, getDistance } from 'utils/util';
import proxy from 'utils/wxProxy';
import { Decimal } from 'decimal.js';

const app = getApp();

Page({
    data: {
        title: 'orderCreate',
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
        selectedPayValue: 'WEIXIN',
        storeUpdateEnable: true,  // 门店可修改
        storeListAddress: {},  // 送货上门的门店
    },

    async onShow() {
        if (app.globalData.extraData && app.globalData.extraData.isPeanutPayOk && this.data.isShouldRedirect) {
            wx.redirectTo({
                url: `/pages/orderDetail/orderDetail?id=${app.globalData.extraData.order_no}&isFromCreate=1`,
            });
        }
    },

    async onLoad(params) {
        console.log('params62', params);
        // this.checkPhoneModel();
        const { themeColor, defineTypeGlobal } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            themeColor,
            isIphoneX,
            defineTypeGlobal,
            config,
            bargain_mission_code: params.bargain_mission_code
        });
        try {
            // isCancel 仅在跳转支付后返回 标识是否取消支付
            const { grouponId, isGrouponBuy, crowd = false, groupon_commander_price = false } = this.options;
            // 新增秒杀
            const { seckill, seckill_product_id } = this.options;
            const { currentOrder } = app.globalData;
            const { items, totalPostage } = currentOrder;
            let location = wx.getStorageSync(LOCATION_KEY) || false;
            let address = wx.getStorageSync(ADDRESS_KEY) || {};
            let liftInfo = { isCanInput: true, isCanNav: true };
            let storeUpdateEnable = true;
            const totalPrice = currentOrder.totalPrice || 0;
            // let totalPostage = 0;

            // 多门店模式
            if (config.offline_store_enable) {
                if (location) {
                    // 地址清空
                    address = { userName: '', };
                }
                // 自提点不能选择
                liftInfo.isCanNav = false;
                // 门店不可选配置
                storeUpdateEnable = false;
            }

            this.setData({
                storeUpdateEnable,
                seckill,
                seckill_product_id,
                address,
                liftInfo,
                totalPrice,
                items,
                isGrouponBuy: isGrouponBuy || null,
                grouponId: grouponId || null,
                totalPostage,
                isShouldRedirect: false,
                crowd,
                groupon_commander_price,
                shipping_type: Number(params.shipping_type)
            }, () => {
                if (!isGrouponBuy) {
                    app.event.on('getCouponIdEvent', this.getCouponIdEvent, this);
                }
                app.event.on('getLiftInfoEvent', this.getLiftInfoEvent, this);
                app.event.on('getStoreInfoEvent', this.getStoreInfoEvent, this);
                app.event.on('setOverseeAddressEvent', this.setOverseeAddressEvent, this);
                app.event.on('setAddressListEvent', this.setAddressListEvent, this);
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
    },

    onUnload() {
        app.globalData.currentOrder = {};
        wx.removeStorageSync('orderCreate');
        app.event.off('getCouponIdEvent', this);
        app.event.off('getLiftInfoEvent', this);
        app.event.off('getStoreInfoEvent', this);
        app.event.off('setOverseeAddressEvent', this);
        app.event.off('setAddressListEvent', this);
    },

    // onHide() {
    //     console.log('--- onHide ----');
    //     wx.clearStorageSync('orderCreate');
    // },

    onInput(ev) {
        const { value } = ev.detail;
        this.setData({ buyerMessage: value });
    },

    // 收货地址修改
    async onAddress() {
        let { shipping_type, config: { self_address, offline_store_enable }} = this.data;
        let url = '';
        if (self_address) {
            // 自填地址
            url = `/pages/selfAddress/selfAddress`;
        } else if (offline_store_enable && shipping_type === 4) {
            // 多门店送货上门
            let type = 'orderEdit';
            url = `../addressEdit/addressEdit?type=${type}`;
        }
        else {
            // 普通地址列表
            url = `/pages/addressList/addressList`;
        }
        wx.navigateTo({ url });
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
        const { liftInfo } = this.data;
        this.setData({
            liftInfo: { ...liftInfo, ...data }
        });
    },

    setOverseeAddressEvent(selfAddressObj) {
        this.setData({ address: selfAddressObj }, () => { this.onLoadData() });
    },

    // 设置地址列表返回的数据
    setAddressListEvent(address) {
        let { storeListAddress = {}} = this.data;
        console.log('从地址列表返回的地址', address);
        wx.setStorageSync(ADDRESS_KEY, address);
        if (storeListAddress.name) {
            let distance = getDistance(address.latitude, address.longitude, storeListAddress.latitude, storeListAddress.longtitude);
            storeListAddress.distance = Number(distance) || '-';
        }
        this.setData({
            address: address,
            storeListAddress,
        }, () => { this.onLoadData() });
    },

    // 从 liftList 页面获取门店地址
    getStoreInfoEvent(data) {
        console.log('data196', data);
        const times = data[0].times || [];
        this.setData({
            storeListAddress: data[0],
            homeDeliveryTimes: times,
            chooseAreaId: data[0].id,
            free_shipping_amount: data[0] && data[0].free_amount
        }, () => {
            this.onLoadData(data[0].id);
        });
    },

    // 更新自提地址
    updateLiftInfo(e) {
        const { liftInfo = {}} = this.data;
        this.setData({
            liftInfo: { ...liftInfo, ...e.detail }
        }, () => {
            console.log(this.data.liftInfo);
        });
    },

    async onLoadData(params) {
        try {
            // 秒杀
            let { seckill_product_id, seckill } = this.data;
            let {
                address,
                items,
                user_coupon_ids,
                isGrouponBuy,
                grouponId,
                shipping_type,
                config,
                bargain_mission_code,
                liftInfo,
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
                    receiver_zipcode: address.postalCode || '',
                    room: address.room || '',
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

            if (shipping_type === 4) { // 送货上门
                // requestData.receiver_address_name = params;
                requestData.delivery_store_id = params; // 配送地区id
            }

            if (seckill) { // 秒杀
                requestData.seckill_pid = seckill_product_id;
                requestData.order_method = 1;
            }

            if (bargain_mission_code) { // 砍价
                requestData.promotion_type = 5;
                requestData.mission_code = bargain_mission_code;
            }

            requestData.shipping_type = Number(shipping_type);

            requestData.posts = JSON.stringify(items);

            const orderPrepareData = await api.hei.orderPrepare(requestData);
            const {
                coupons,
                wallet,
                coin_in_order,
                fee,
                use_platform_pay,
                order_annotation,
                product_type,
                payment_tips,
                store_card,
                store = {},
            } = orderPrepareData;

            // 多门店模式下-默认下单门店
            if (store && store.id) {
                let {
                    id,
                    longtitude, latitude,
                    phone: receiver_address_phone,
                    state: receiver_state,
                    city: receiver_city,
                    district: receiver_district,
                    address: receiver_address,
                    name: receiver_address_name,
                    time, remark,
                    times = [],
                    free_amount
                } = store;
                if (shipping_type === 2) {
                    let distance = '-';
                    try {
                        const data = await proxy.getLocation();
                        distance = getDistance(latitude, longtitude, data.latitude, data.longitude);
                    } catch (error) {
                        console.log('error', error);
                    }
                    // 自提注入多门店
                    Object.assign(liftInfo, {
                        receiver_address_phone,
                        receiver_state,
                        receiver_city,
                        receiver_district,
                        receiver_address,
                        receiver_address_name,
                        distance: distance,
                        time,
                        remark,
                    });
                } else if (shipping_type === 4) {
                    let distance = getDistance(latitude, longtitude, address.latitude, address.longitude);
                    distance = Number(distance) || '-';
                    // 送货上门诸如多门店
                    Object.assign(store, { distance });
                    this.setData({
                        storeListAddress: store,
                        homeDeliveryTimes: times,
                        chooseAreaId: id,
                        free_shipping_amount: free_amount,
                    });
                }
            }


            // 花生米是否可用：花生米开启 并且 订单总额 - 邮费 满足 order_least_cost
            const shouldGoinDisplay = coin_in_order.enable && (coin_in_order.order_least_cost <= fee.amount - fee.postage);
            console.log(shouldGoinDisplay, '---------shouldGoinDisplay');

            const maxUseCoin = Number(new Decimal(fee.amount).sub(new Decimal(fee.postage)).mul(coin_in_order.percent_in_order || 0));

            const useCoin = Math.min(maxUseCoin, wallet.coins);

            if (product_type !== 1 && shipping_type === 1) {
                this.setData({
                    free_shipping_amount: config && config.free_shipping_amount
                });
            }

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
                isDisablePay: false,
                order_annotation,
                product_type,
                payment_tips,
                store_card,
                liftInfo,
                config,
            }, () => {
                this.computedFinalPay();
            });
        } catch (err) {
            console.log(err);
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    // 设置可用花生米
    setUseCoin(e) {
        this.setData({
            useCoin: e.detail || 0
        }, this.computedFinalPay);
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
        console.log(ev);
        let subKeys = [{ key: 'order_consigned' }];
        const { formId, crowd, crowdtype } = ev.detail;
        const {
            seckill,
            seckill_product_id,
            address,
            items,
            buyerMessage,
            grouponId,
            isGrouponBuy,
            user_coupon_ids,
            useCoin,
            shouldGoinDisplay,
            liftInfo,
            order_annotation,
            product_type,
            selectedPayValue,
            store_card,
            storeListAddress,
            shipping_type,
            bargain_mission_code,
            config,
            finalPay,
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
            room,
        } = address;
        const { vendor, afcode } = app.globalData;

        if (!userName && !detailInfo && shipping_type !== 2 && product_type !== 1) {
            wx.showModal({
                title: '提示',
                content: '请先填写地址',
                showCancel: false,
            });
            return;
        }

        if (shipping_type === 2 && !liftInfo.receiver_address_name && product_type !== 1) {
            wx.showModal({
                title: '提示',
                content: '请先选择自提地址',
                showCancel: false,
            });
            return;
        }

        if (shipping_type === 2 && !liftInfo.receiver_phone && product_type !== 1) {
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号',
                showCancel: false,
            });
            return;
        }

        wx.setStorageSync(ADDRESS_KEY, address);

        let method = 'createOrder';

        let requestData = {
            receiver_name: userName || '',
            receiver_phone: telNumber || '',
            receiver_country: nationalCode || '',
            receiver_state: provinceName || '',
            receiver_city: cityName || '',
            receiver_district: countyName || '',
            receiver_address: detailInfo || '',
            receiver_zipcode: postalCode || '',
            room: room || '',
            buyer_message: buyerMessage,
            form_id: formId,
            vendor,
            afcode,
            pay_method: selectedPayValue
        };

        let queryData = {}; // 接口url带的get参数

        if (order_annotation && order_annotation.length > 0) {
            const orderForm = this.selectComponent('#orderForm');
            const { annotation, dns_obj } = orderForm.data;
            annotation.forEach((item, index) => {
                if (item.required && (!dns_obj[item.name] || !dns_obj[item.name].length)) {
                    item.isError = true;
                }
            });
            this.setData({
                order_annotation: annotation
            });
            const error = annotation.filter((item) => {
                return (item.isError === true);
            });
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

        if (store_card && store_card.store_card_enable && selectedPayValue === 'STORE_CARD') {
            const { confirm } = await proxy.showModal({
                title: '提示',
                content: '您确定要用储值卡支付吗？',
                showCancel: true,
            });
            if (!confirm) {
                return;
            }
        }

        if (user_coupon_ids) {
            requestData.user_coupon_ids = user_coupon_ids;
        }

        if (useCoin && shouldGoinDisplay) {
            requestData.coins = useCoin;
        }

        requestData.shipping_type = shipping_type;
        // 自提需传数据
        if (shipping_type === 2) {
            requestData = { ...requestData, ...liftInfo };
            subKeys.push({ key: 'order_stock_up' });
        }

        // 送货上门校验和添加请求信息
        if (shipping_type === 4) {
            let { name, id, distance, distance_limit } = storeListAddress,
                content = '';
            if (!name) {
                // 店不存在
                content = '请选择合适的门店';
            } else if (distance === '-' || !distance_limit) {
                // 店距离校验
                content = '门店地址信息获取失败';
            } else if (distance > distance_limit) {
                content = '地址超出门店配送范围';
            }
            // 通过弹窗提醒
            if (content) {
                wx.showModal({ title: '温馨提示', content, showCancel: false, });
                return;
            } else {
                requestData.receiver_address_name = name;
                requestData.delivery_store_id = id;
            }
            // 直接获取送货上门子组件的任意数据和方法
            const delivery = this.selectComponent('#storeList');
            console.log(delivery, '门店组件数据');
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

            subKeys.push({ key: 'groupon_finished' });
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

        // 秒杀
        if (seckill) {
            requestData.pid = seckill_product_id;
            method = 'seckillOrderCreate';
        }

        // 砍价
        if (bargain_mission_code) {
            requestData.code = bargain_mission_code;
            method = 'bargainOrder';
        }

        wx.showLoading({ title: '处理订单中', mask: true, });

        if (finalPay <= 0) {
            queryData.pay = '';
        }

        if (!config.cashier_enable) {
            queryData.pay = '';
        }

        try {
            const {
                order_no,
                status,
                pay_sign,
                pay_appid,
                crowd_pay_no,
                order = {},
                cart
            } = await api.hei[method]({
                ...requestData
            }, { ...queryData });

            wx.hideLoading();

            if (cart && cart.count) {
                wx.setStorageSync('CART_NUM', cart.count);
            }

            if (crowd && crowd_pay_no) {
                wx.redirectTo({
                    url: `/pages/crowd/inviteCrowd/inviteCrowd?id=${order_no}&crowd_pay_no=${crowd_pay_no}`,
                });
                return;
            }

            if (finalPay <= 0 || order.pay_method === 'STORE_CARD') {
                await subscribeMessage(subKeys);
                wx.redirectTo({
                    url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=1`,
                });
                return;
            }

            if (config.cashier_enable) {
                wx.redirectTo({ url: `/pages/payCashier/payCashier?order_no=${order_no}&subKeys=${JSON.stringify(subKeys)}&isFromCreate=1` });
                return;
            }

            if (pay_sign) {
                const payRes = await wxPay(pay_sign, order_no, subKeys);
                console.log(payRes, 'payRes');
                wx.redirectTo({ url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=1` });
            } else if (pay_appid) {
                const { address, items, totalPrice, fee, buyerMessage, useCoin } = this.data;
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
                                order_no,
                                address,
                                items,
                                totalPrice,
                                totalPostage: fee.postage,
                                orderPrice: finalPay,
                                coupons: fee.coupon_reduce_fee,
                                buyerMessage,
                                coinPrice: useCoin
                            }
                        }
                    }
                });
            }
        } catch (err) {
            console.log(err);
            wx.hideLoading();
            wx.showModal({
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
    // 储值卡支付
    pickPayStyle(e) {
        const { value } = e.currentTarget.dataset;
        const { store_card, finalPay } = this.data;
        if (value === 'STORE_CARD' && store_card && store_card.store_card_enable && (Number(store_card.balance) < Number(finalPay))) {
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
