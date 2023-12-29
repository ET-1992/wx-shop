import api from 'utils/api';
import { wxPay } from 'utils/pageShare';
import { ADDRESS_KEY, CONFIG, PAY_STYLES, LOCATION_KEY } from 'constants/index';
import { auth, subscribeMessage, getDistance, autoTransformAddress } from 'utils/util';
import proxy from 'utils/wxProxy';
import { Decimal } from 'decimal.js';

const app = getApp();

Page({
    data: {
        title: 'orderCreate',
        liftInfo: {
            isCanInput: true,
            isCanNav: true,
            sl_least_fee: 0,
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
        postageTip: '',  // 运费模板提示
        sl_least_fee: '',  // 自提最低金额
        amounts: {},  // 金额
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
            // 理论上this.options和params一样，但我选后者
            let { shipping_type = 1, product_type } = params;

            // 新增秒杀
            const { seckill, seckill_product_id } = this.options;
            const { currentOrder } = app.globalData;
            const { items, totalPostage } = currentOrder;
            let location = wx.getStorageSync(LOCATION_KEY) || false;
            let address = wx.getStorageSync(ADDRESS_KEY) || {};
            let liftInfo = { isCanInput: true, isCanNav: true };
            let storeUpdateEnable = true;
            const totalPrice = currentOrder.totalPrice || 0;
            product_type = Number(product_type);
            shipping_type = Number(shipping_type);
            // let totalPostage = 0;


            const receiver_name = wx.getStorageSync('receiver_name') || '';
            const receiver_phone = wx.getStorageSync('receiver_phone') || '';

            // 送货上门清空无定位地址
            if (shipping_type === 4 && !address.latitude) {
                address = { userName: '', };
            }

            this.setData({
                storeUpdateEnable,
                seckill,
                seckill_product_id,
                address,
                liftInfo: { ...liftInfo, receiver_name, receiver_phone },
                totalPrice,
                items,
                isGrouponBuy: isGrouponBuy || null,
                grouponId: grouponId || null,
                totalPostage,
                isShouldRedirect: false,
                crowd,
                groupon_commander_price: Boolean(groupon_commander_price),
                shipping_type,
                product_type,
            }, () => {
                if (!isGrouponBuy) {
                    app.event.on('getCouponIdEvent', this.getCouponIdEvent, this);
                }
                app.event.on('getLiftInfoEvent', this.getLiftInfoEvent, this);
                app.event.on('getStoreInfoEvent', this.getStoreInfoEvent, this);
                app.event.on('setOverseeAddressEvent', this.setOverseeAddressEvent, this);
                app.event.on('setAddressListEvent', this.setAddressListEvent, this);
                app.event.on('getCouponIdEvent', this.getCouponIdEvent, this);
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
        app.event.off('getCouponIdEvent', this);
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
        }
        // else if (offline_store_enable && shipping_type === 4) {
        //     // 多门店送货上门
        //     let type = 'orderEdit';
        //     url = `../addressEdit/addressEdit?type=${type}`;
        // }
        else {
            // 普通地址列表
            url = `/pages/addressList/addressList`;
        }
        wx.navigateTo({ url, fail: (e) => { console.log('e', e) } });
    },

    // 使用优惠券
    async getCouponId() {
        const { coupons } = this.data;
        wx.setStorageSync('orderCoupon', coupons);
        wx.navigateTo({
            url: '/pages-pvm/couponDetail/couponDetail',
        });
    },

    // 使用优惠码
    async onDiscountCode(e) {
        let { code } = e.detail;
        this._discountCode = code;
        wx.showLoading();
        await this.onLoadData();
        wx.hideLoading();
    },

    // 选择优惠券回调
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
            address,
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
            this.onLoadData();
        });
    },

    // 更新自提地址
    updateLiftInfo(e) {
        console.log('updateLiftInfo', e);
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
                product_type,
                chooseAreaId,
            } = this.data;
            let requestData = {};
            if (address) {
                requestData = {
                    receiver_id: address.id || '',
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


            if (product_type === 4) {
                // 金币商品
                requestData.promotion_type = 6;
            }
            if (items && items[0] && items[0].order_promotion_type) {
                // 电子卡券 不能加车
                requestData.promotion_type = items[0].order_promotion_type;
            }

            // 优惠码
            requestData.discount_code = this._discountCode || '';

            requestData.shipping_type = Number(shipping_type);

            requestData.posts = items;

            requestData.pay_method = 'WEIXIN';

            const orderPrepareData = await api.hei.pvmOrderPrepare(requestData);
            const {
                coupons = {},
                wallet,
                coin_in_order,
                fee,
                use_platform_pay,
                order_annotation,
                payment_tips,
                store_card,
                store = {},
                shipment_tips: postageTip,
                default_store,
                amounts
            } = orderPrepareData;

            // // 设置订单留言
            // if (!this.data.order_annotation) {
            //     this.setData({ order_annotation });
            // }

            // // 花生米是否可用：花生米开启 并且 订单总额 - 邮费 满足 order_least_cost
            // let shouldGoinDisplay = coin_in_order.enable && (coin_in_order.order_least_cost <= fee.amount - fee.postage);
            // console.log(shouldGoinDisplay, '---------shouldGoinDisplay');

            // const maxUseCoin = Number(new Decimal(fee.amount).sub(new Decimal(fee.postage)).mul(coin_in_order.percent_in_order || 0));

            // let useCoin = Math.min(maxUseCoin, wallet.coins);

            // // 金币商品 自动抵扣花生米
            // if (product_type === 4) {
            //     shouldGoinDisplay = false;
            //     useCoin = fee.coins_fee;
            //     Object.assign(fee, { showCoinNumber: true });
            // }

            // if (product_type !== 1 && shipping_type === 1) {
            //     this.setData({
            //         free_shipping_amount: config && config.free_shipping_amount
            //     });
            // }

            this.setData({
                coupons,
                wallet,
                coin_in_order,
                fee: amounts,
                // shouldGoinDisplay,
                // maxUseCoin,
                // useCoin,
                user_coupon_ids: (coupons.recommend && coupons.recommend.user_coupon_id) || '',
                isHaveUseCoupon: (coupons.available && coupons.available.length > 0),
                isPeanutPay: use_platform_pay || '',
                isDisablePay: false,
                product_type,
                payment_tips,
                store_card,
                liftInfo,
                config,
                postageTip,
                amounts
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
        console.log('fee', fee);

        let finalPay = 0;
        // console.log(useCoin, shouldGoinDisplay);
        if (shouldGoinDisplay && !isGrouponBuy) {
            finalPay = fee.total_fee - useCoin / 100;
        } else {
            finalPay = fee.total_fee;
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

      try {
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
            product_type,
            selectedPayValue,
            store_card,
            storeListAddress,
            shipping_type,
            bargain_mission_code,
            config,
            finalPay,
            fee,
        } = this.data;
        const { vendor, afcode } = app.globalData;

        let addressComponent = this.selectComponent('#address');
        console.log(addressComponent, addressComponent.data, 'addressComponent');

        const {
          userName,
          telNumber,
          provinceName,
          cityName,
          countyName,
          postalCode,
          nationalCode,
          detailInfo,
          latitude,
          longitude,
          room,
      } = addressComponent.data.address;

        if (!userName && !detailInfo && shipping_type !== 2 && product_type !== 1) {
            wx.showModal({
                title: '提示',
                content: '请先填写地址',
                showCancel: false,
            });
            return;
        }

        // if (shipping_type === 2 && !liftInfo.receiver_address_name && product_type !== 1) {
        //     wx.showModal({
        //         title: '提示',
        //         content: '请先选择自提地址',
        //         showCancel: false,
        //     });
        //     return;
        // }

        // if (shipping_type === 2 && !liftInfo.receiver_phone && product_type !== 1) {
        //     wx.showModal({
        //         title: '提示',
        //         content: '请输入正确的手机号',
        //         showCancel: false,
        //     });
        //     return;
        // }

        wx.setStorageSync(ADDRESS_KEY, address);

        let method = 'createOrder';

        let requestData = {
            receiver_id: address.id || '',
            receiver_name: userName || '',
            receiver_phone: telNumber || '',
            receiver_country: nationalCode || '',
            receiver_state: provinceName || '',
            receiver_city: cityName || '',
            receiver_district: countyName || '',
            receiver_address: detailInfo || '',
            receiver_zipcode: postalCode || '',
            longtitude: longitude || '',
            latitude: latitude || '',
            room: room || '',
            buyer_message: buyerMessage,
            form_id: formId,
            vendor,
            afcode,
            pay_method: selectedPayValue
        };

        let queryData = {}; // 接口url带的get参数

        // 订单留言
        // let component = this.selectComponent('#mark-form');
        // if (component) {
        //     try {
        //         let remarks = component.handleValidate();
        //         requestData.annotation = remarks ? JSON.stringify({ remarks }) : '';
        //     } catch (e) {
        //         console.log('e', e);
        //         return;
        //     }
        // }

        // if (store_card && store_card.store_card_enable && selectedPayValue === 'STORE_CARD') {
        //     const { confirm } = await proxy.showModal({
        //         title: '提示',
        //         content: '您确定要用储值卡支付吗？',
        //         showCancel: true,
        //     });
        //     if (!confirm) {
        //         return;
        //     }
        // }

        if (user_coupon_ids) {
            requestData.user_coupon_ids = user_coupon_ids;
        }

        if (useCoin && shouldGoinDisplay) {
            requestData.coins = useCoin;
        }

        requestData.discount_code = this._discountCode || '';

        const orderQuery = {
          posts: items,
          pay_method: 'WEIXIN',
          receiver: autoTransformAddress(address),
          buyer_message: buyerMessage
        };
        console.log(orderQuery);
        const { order_no } = await api.hei.orderCreate(orderQuery);
        if (fee.total_fee !== 0) {
          const { pay_interact_data } = await api.hei.orderPay({
            order_nos: [order_no],
            pay_method: 'WEIXIN',
          });
          console.log(pay_interact_data, '--');
          const { pay_sign } = pay_interact_data;
          // await this.wxPvmPay(pay_sign);
          await proxy.requestPayment(pay_sign);
        }


        // await wxProxy.requestPayment(pay_sign);
        proxy.showModal({
          title: '提示',
          content: '支付成功',
        });

        wx.redirectTo({
          url: `/pages-pvm/orderDetail/orderDetail?id=${order_no}`
        });
      } catch (err) {
        console.log(err);
        wx.showModal({
          content: err.errMsg || '请尽快完成付款',
          title: '支付取消',
          showCancel: false
        });
      }
    },


  //   async wxPvmPay(pay_sign, subKeys) {
  //     try {
  //       await proxy.requestPayment(pay_sign);

  //         if (subKeys && subKeys.length) {
  //             console.log(subKeys, 'subKeys');
  //             // 注意一定要紧跟在requestPayment后面
  //             await subscribeMessage(subKeys);
  //         }
  //     }
  //     catch (err) {
  //         console.log('requestPayment err', err);
  //         const { errMsg } = err;
  //         if (errMsg.indexOf('cancel') >= 0) {
  //             await proxy.showModal({
  //                 title: '支付取消',
  //                 content: '请尽快完成付款',
  //                 showCancel: false,
  //             });
  //             return { isCancel: true };
  //         }
  //         else {
  //             await proxy.showModal({
  //                 title: '支付失败',
  //                 content: '网络错误，请稍后重试',
  //                 showCancel: false,
  //             });
  //         }
  //     }
  //     // wx.redirectTo({
  //     // 	url: `/pages/orderDetail/orderDetail?id=${orderNo}`
  //     // });
  // },

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
    // 改变订单商品数量
    async onStepperChange(e) {
        let { items, isGrouponBuy } = this.data;
        let { index, number } = e.detail;
        if (isGrouponBuy) {
            wx.showModal({
                title: '温馨提示',
                content: '团购商品不支持此项操作',
                showCancel: false,
            });
        } else {
            wx.showLoading({ title: '加载中...' });
            items[index].quantity = number;
            this.setData({ items });
            await this.onLoadData();
            wx.hideLoading();
        }
    },
});
