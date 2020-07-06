import api from 'utils/api';
import { Decimal } from 'decimal.js';
import { USER_KEY, CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
import { wxPay } from 'utils/pageShare';
import { go } from 'utils/util';
const app = getApp();

Page({
    data: {
        isLoading: true,
        payModal: false,
        showPosterModal: false,
        isShowShareModal: false
    },

    go,

    onLoad() {
        const userInfo = wx.getStorageSync(USER_KEY);
        const config = wx.getStorageSync(CONFIG);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        this.setData({
            themeColor,
            isIphoneX,
            userInfo,
            config,
            routePath: this.route,
            globalData: app.globalData
        });
    },
    async onShow() {
        let { id, crowd_pay_no } = this.options;
        let queryOption = { order_no: id };
        if (crowd_pay_no) {
            queryOption.crowd_pay_no = crowd_pay_no;
        }
        await this.loadOrder(queryOption);

        let title = '';
        const { userInfo, openid } = this.data;
        userInfo.openid === openid ? title = '代付进度' : title = '土豪帮帮忙';
        wx.setNavigationBarTitle({ title });

    },
    async loadOrder(queryOption) {
        try {
            const { current_user, order, config } = await api.hei.fetchOrder(queryOption);
            // -----------------处理价格显示
            let info = {};
            info.finalPay = Number(order.amount); // 付款价格
            info.finalPayDispaly = Number(info.finalPay).toFixed(2);

            let rest_amount = new Decimal(order.amount).minus(order.crowd.pay_amount).toNumber();    // 尾款
            let rest_amount_display = rest_amount.toFixed(2);

            let progress = new Decimal(order.crowd.pay_amount).div(order.amount).mul(100).toNumber();    // 进度条

            // 默认价
            let support_amount;
            if (rest_amount > 0.01 && rest_amount <= 1) {
                support_amount = new Decimal(rest_amount).mul(0.5).toNumber().toFixed(2);
            }
            if (rest_amount > 1) {
                // 取1~50%之间的随机数
                let min = 1,
                    max = new Decimal(rest_amount).mul(0.5);
                support_amount = (Math.random() * (max - min + 1) + min).toFixed(2);
            } else {
                support_amount = 0.01;
            }
            // -----------------End

            this.setData({
                order,
                userInfo: current_user,
                order_no: order.order_no,
                items: order.items,
                crowd: order.crowd,
                crowd_users: order.crowd_users,
                avatarurl: order.avatarurl,
                openid: order.openid,
                finalPay: info.finalPay,
                finalPayDispaly: info.finalPayDispaly,
                rest_amount,
                rest_amount_display,
                support_amount,
                progress,
                config,
                isLoading: false
            });
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }
    },

    // 退款
    async crowdRefund() {
        const { confirm } = await proxy.showModal({
            title: '温馨提醒',
            content: '确定放弃代付？退款将原路返回'
        });
        if (confirm) {
            try {
                let { order_no } = this.data;
                await api.hei.crowdRefund({ order_no });
                wx.showToast({ title: '退款成功', icon: 'success' });
                this.onShow();
            } catch (err) {
                wx.showModal({
                    title: '温馨提醒',
                    content: err.errMsg,
                    showCancel: false
                });
            }
        }
    },
    // 付尾款
    async payTailMoney() {
        const { confirm } = await proxy.showModal({
            title: '温馨提醒',
            content: '确定支付尾款？'
        });
        if (confirm) {
            let { rest_amount, order_no, crowd, config } = this.data;
            if (config.cashier_enable) {
                app.globalData.crowdData = {
                    order_no,
                    crowd_pay_no: crowd.crowd_pay_no,
                    crowd_amount: rest_amount,
                    from_page: 'crowd'
                };
                wx.navigateTo({ url: '/pages/payCashier/payCashier' });
                return;
            }
            try {
                const { pay_sign } = await api.hei.crowdPay({
                    crowd_pay_no: crowd.crowd_pay_no,
                    amount: rest_amount
                });
                if (pay_sign) {
                    await wxPay(pay_sign);
                    setTimeout(this.onShow, 500);
                }
            } catch (err) {
                wx.showModal({
                    title: '温馨提醒',
                    content: err.errMsg,
                    showCancel: false
                });
            }
        }
    },
    // 赞助
    async onPay() {
        let { order_no, support_amount, crowd, config } = this.data;
        if (config.cashier_enable) {
            let crowdData = {
                order_no,
                crowd_pay_no: crowd.crowd_pay_no,
                from_page: 'crowd'
            };
            if (Number(crowd.type) === 1) {   // 众筹
                crowdData.crowd_amount = support_amount;
            }
            app.globalData.crowdData = crowdData;
            wx.navigateTo({ url: '/pages/payCashier/payCashier' });
            return;
        }
        try {
            let options = {
                crowd_pay_no: crowd.crowd_pay_no
            };
            if (Number(crowd.type) === 1) {
                options.amount = support_amount;
            }
            const { pay_sign } = await api.hei.crowdPay(options);
            if (pay_sign) {
                await wxPay(pay_sign);
                this.setData({ payModal: false }, () => { setTimeout(this.onShow, 500) });
            }
        } catch (err) {
            wx.showModal({
                title: '温馨提醒',
                content: err.errMsg,
                showCancel: false
            });
        }
    },
    // 赞助弹窗
    showPayModal() {
        let { payModal } = this.data;
        this.setData({ payModal: !payModal });
    },

    // 输入赞助金额
    setMoneyValue(e) {
        const { value } = e.detail;
        let newValue = (value.match(/^\d*(\.?\d{0,2})/g)[0]) || null;   // 限制小数点后两位
        const { rest_amount } = this.data;
        if (Number(newValue) > Number(rest_amount)) {
            this.setData({
                support_amount: rest_amount
            });
            return;
        }
        this.setData({
            support_amount: newValue
        });
    },

    // 分享弹窗
    showShareModal() {
        let { isShowShareModal } = this.data;
        this.setData({
            isShowShareModal: !isShowShareModal
        });
    },

    onShareAppMessage() {
        let { crowd } = this.data;
        let shareMsg = {
            title: crowd.word,
            path: `/pages/crowd/crowdProgress/crowdProgress?crowd_pay_no=${crowd.crowd_pay_no}`,
            imageUrl: crowd.image || ''
        };
        return shareMsg;
    },

    onShowPoster() {
        const {
            order: {
                amount
            },
            items: [
                {
                    thumbnail,
                    image_url,
                    title,
                    original_price,
                    price
                }
            ],
            crowd: {
                crowd_pay_no
            }
        } = this.data;
        let posterData = {
            banner: image_url || thumbnail,
            title,
            crowd_pay_no,
            price: amount,
            original_price
        };
        this.setData({
            showPosterModal: true,
            isShowShareModal: false,
            posterData
        });
    },

    onClosePoster() {
        this.setData({
            showPosterModal: false
        });
    }
});
