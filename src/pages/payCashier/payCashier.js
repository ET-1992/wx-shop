import api from 'utils/api';
import { wxPay } from 'utils/pageShare';
import { CONFIG } from 'constants/index';
import { go, autoNavigate_, subscribeMessage } from 'utils/util';
import proxy from 'utils/wxProxy';

const app = getApp();
Page({
    data: {
        isLoading: true,
        selectedPayment: {},
        payments: {},
        order: {},
        config: {},
        exchange_amount: '--',
        amount: '--',
        isFromCreate: false,
        from_page: '', // member会员页支付, crowd代付页支付, 空值为普通订单支付
        renewalId: '' // 所选择的续费项id
    },

    go,

    async onLoad(params = {}) {
        let { subKeys } = params;
        subKeys = subKeys ? JSON.parse(subKeys) : [];
        const config = wx.getStorageSync(CONFIG);
        const { isIphoneX } = app.systemInfo;
        const { crowdData = {}} = app.globalData;	// 代付页面过来的数据
        this.setData({
            ...params,
            ...crowdData,
            config,
            isIphoneX,
            globalData: app.globalData,
            subKeys
        });
        if (params.from_page !== 'member') {
            await this.loadData();
        }
        this.initPayments();
    },

    // 初始化支付方式
    async initPayments() {
        try {
            const { current_user, payments } = await api.hei.fetchPayments();
            if (payments && payments.length) {
                this.setData({
                    payments,
                    selectedPayment: payments[0],
                    current_user,
                    isLoading: false
                }, this.onSelectPayment());
            } else {
                const { confirm } = await proxy.showModal({
                    title: '温馨提示',
                    content: '商家尚未开启支付方式',
                    showCancel: false
                });
                if (confirm) {
                    this.back();
                }
            }
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    async loadData() {
        try {
            const { order_no, crowd_pay_no } = this.data;
            let data = {};
            let requestData = {};
            if (order_no) {
                requestData.order_no = order_no;
            }
            if (crowd_pay_no) {
                requestData.crowd_pay_no = crowd_pay_no;
            }
            let { order, config } = await api.hei.fetchOrder(requestData);
            const NOW_TIME = Math.round(Date.now() / 1000);
            /**
             * 拼团支付过期时间 1h
             * 普通订单支付过期时间 12h
             */
            const EXPIRED_TIME = order.groupon_id
                ? order.time + 60 * 60
                : order.time + 12 * 60 * 60;
            const timeLimit = (EXPIRED_TIME - NOW_TIME) * 1000;
            order.timeLimit = timeLimit > 0 ? timeLimit : 0;
            order.statusCode = Number(order.status);

            data.order = order;
            data.config = config;
            data.amount = order.amount;
            this.setData({ ...data });
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    onReload(e) {
        console.log(e, '倒计时结束');
        this.loadData();
    },

    // 自定义弹窗
    onConfirm() {
        this.setData({
            'modal.isShowModal': false,
            isShouldRedirect: true
        });
    },
    onCancel() {
        this.setData({
            'modal.isShowModal': false,
            isShouldRedirect: false
        });
    },

    // 跳转小程序支付后离开收银台页面
    openMiniProgram() {
        console.log('跳转小程序成功');
        this.back();
    },

    // 切换支付方式
    onChangeRadio(ev) {
        const { value } = ev.currentTarget.dataset;
        this.setData({
            selectedPayment: value
        }, this.onSelectPayment);
    },

    // 选择支付方式
    async onSelectPayment() {
        wx.showLoading({ title: '加载中...', mask: true });
        try {
            const { selectedPayment, order, from_page, crowd_amount, member_amount } = this.data;
            let requestData = { pay_method: selectedPayment.pay_method };

            switch (from_page) {
                case 'crowd':
                    requestData.amount = crowd_amount || order.amount;
                    break;
                case 'member':
                    requestData.amount = member_amount;
                    break;
                default:
                    requestData.amount = order.amount;
                    break;
            }

            let data = await api.hei.orderPreparePay({ ...requestData });

            this.setData({ ...data }, () => { wx.hideLoading() });

        } catch (err) {
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    // 确定支付
    async onPay() {
        try {
            let {
                selectedPayment,
                order_no,
                order,
                from_page,
                crowd_pay_no,
                crowd_amount,
                member_amount,
                renewalId,
                member_type,
                subKeys
            } = this.data;

            wx.showLoading({ title: '请求中...', mask: true });

            let requestData = {
                pay_method: selectedPayment.pay_method
            };
            let method = 'payOrder';

            switch (from_page) {
                case 'crowd':
                    method = 'crowdPay';
                    requestData.crowd_pay_no = crowd_pay_no;
                    if (crowd_amount) {
                        requestData.amount = crowd_amount;
                    }
                    break;
                case 'member':
                    method = 'joinMembershipMultipay';
                    requestData.amount = member_amount;
                    requestData.type = member_type;
                    if (renewalId) { // 会员续费
                        requestData.renew_id = renewalId;
                    }
                    break;
                default:
                    requestData.order_nos = JSON.stringify([order_no]);
                    break;
            }

            const data = await api.hei[method](requestData);
            const { pay_sign, pay_appid } = data;

            if (from_page === 'member') {
                order_no = data.order_no;
                this.setData({ order_no });
            }

            wx.hideLoading();

            if (selectedPayment.pay_method === 'TRANSFER_PAY') {
                wx.redirectTo({
                    url: `/pages/paymentVouchers/paymentVouchers?order_no=${order_no}&subKeys=${JSON.stringify(subKeys)}`,
                });
                return;
            }

            if (pay_sign) {
                await wxPay(pay_sign, order_no, subKeys);
                this.back();
            }

            // 平台支付
            if (selectedPayment.pay_method === 'PLATFORM_PAY' && pay_appid) {
                let order_data = {};
                if (from_page !== 'member') {
                    order_data = {
                        address: {
                            userName: order.receiver_name,
                            receiver_phone: order.receiver_phone,
                            provinceName: order.receiver_state,
                            cityName: order.receiver_city,
                            countyName: order.receiver_district,
                            detailInfo: order.receiver_address
                        },
                        items: order.items,
                        totalPrice: order.amount,
                        totalPostage: order.postage,
                        coinPrice: order.coins_fee,
                        orderPrice: order.amount,
                        buyerMessage: order.buyerMessage,
                        couponPrice: order.coupon_discount_fee,
                    };
                }
                this.setData({
                    modal: {
                        isFatherControl: true,
                        title: '温馨提示',
                        isShowModal: true,
                        body: '确定支付？',
                        type: 'navigate',
                        navigateData: {
                            url: `/pages/peanutPay/index?order_no=${order_no}`,
                            appId: pay_appid,
                            target: 'miniProgram',
                            version: 'trial', // develop, trial, release
                            extraData: {
                                order_no,
                                from_page,
                                ...order_data
                            }
                        }
                    },
                });
            }

            if (selectedPayment.pay_method === 'STORE_CARD') {
                await subscribeMessage(subKeys);
                wx.showToast({
                    title: '支付成功',
                    icon: 'success'
                });
                setTimeout(() => {
                    this.back();
                }, 200);
            }

        } catch (err) {
            wx.hideLoading();
            this.handleErrMsg(err);
        }
    },

    async handleErrMsg(err) {
        let code = err.code;
        const { confirm } = await proxy.showModal({
            title: '温馨提示',
            content: err.errMsg,
            showCancel: false
        });
        if (confirm) {
            if (code === 'balance_not_enough') {
                autoNavigate_({ url: '/pages/membership/members/members' });
            }
        }
    },

    back() {
        const { from_page, order_no, isFromCreate } = this.data;
        if (!from_page) {
            wx.redirectTo({ url: `/pages/orderDetail/orderDetail?id=${order_no}&isFromCreate=${isFromCreate}` });
            return;
        }
        wx.navigateBack({ delta: 1 });
    },

    onUnload() {
        console.log('--- onUnLoad ----');
        app.globalData.crowdData = {};
    },
});