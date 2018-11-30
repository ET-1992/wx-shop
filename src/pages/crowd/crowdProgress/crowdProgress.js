import api from 'utils/api';
import { Decimal } from 'decimal.js';
import { USER_KEY } from 'constants/index';
import { showModal, showToast } from 'utils/wxp';
import { wxPay } from 'utils/pageShare';
const app = getApp();

Page({
    data: {
        isLoading: true,
        payModal: true
    },

    onLoad() {
        const userInfo = wx.getStorageSync(USER_KEY);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        this.setData({
            themeColor,
            isIphoneX,
            userInfo
        });
    },
    async onShow() {
        let { id, crowd_pay_no } = this.options;
        let queryOption = { order_no: id };
        if (crowd_pay_no) {
            queryOption.crowd_pay_no = crowd_pay_no;
            this.setData({ crowd_pay_no });
        }
        await this.loadOrder(queryOption);

        let title = '';
        const { userInfo, openid } = this.data;
        userInfo.openid === openid ? title = '代付进度' : title = '土豪帮帮忙';
        wx.setNavigationBarTitle({ title });

    },
    async loadOrder(queryOption) {

        const { order } = await api.hei.fetchOrder(queryOption);

        // -----------------处理价格显示
        let info = {};

        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);

        let rest_amount = new Decimal(order.amount).minus(order.crowd.pay_amount).toNumber();    // 尾款
        let rest_amount_display = rest_amount.toFixed(2);

        let progress = new Decimal(order.crowd.pay_amount).div(order.amount).mul(100).toNumber();    // 进度条
        // -----------------End

        this.setData({
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
            progress,
            isLoading: false
        });
    },
    onShareAppMessage() {
        let { crowd, order_no, crowd_pay_no } = this.data;
        if (!crowd_pay_no) { crowd_pay_no = crowd.crowd_pay_no }
        let shareMsg = {
            title: crowd.word,
            path: `/pages/crowd/crowdProgress/crowdProgress?id=${order_no}&crowd_pay_no=${crowd_pay_no}`,
            imageUrl: ''
        };
        return shareMsg;
    },

    async crowdRefund(ev) {
        const { confirm } = await showModal({
            title: '温馨提醒',
            content: '确定放弃代付？退款将原路返回'
        });
        if (confirm) {
            let { order_no } = this.data;
            const { formId } = ev.detail;
            try {
                const res = await api.hei.crowdRefund({
                    order_no,
                    form_id: formId
                });
                if (res.errcode === 0) {
                    await showToast({
                        title: '退款成功',
                    });
                }
            } catch (e) {
                wx.showModal({
                    title: '温馨提醒',
                    content: e.errMsg,
                    showCancel: false
                });
            }
        }
    },
    // 付尾款
    async payTailMoney(ev) {
        const { confirm } = await showModal({
            title: '温馨提醒',
            content: '确定支付尾款？'
        });
        if (confirm) {
            let { rest_amount, crowd } = this.data;
            const { formId } = ev.detail;
            try {
                const { pay_sign } = await api.hei.crowdPay({
                    crowd_pay_no: crowd.crowd_pay_no,
                    amount: rest_amount,
                    form_id: formId
                });
                if (pay_sign) {
                    await wxPay(pay_sign);
                }
            } catch (e) {
                wx.showModal({
                    title: '温馨提醒',
                    content: e.errMsg,
                    showCancel: false
                });
            }
        }
    },
    // 赞助
    async onPay(ev) {
        const { confirm } = await showModal({
            title: '温馨提醒',
            content: '确定赞助？'
        });
        if (confirm) {
            let { rest_amount, crowd } = this.data;
            const { formId } = ev.detail;
            try {
                const { pay_sign } = await api.hei.crowdPay({
                    crowd_pay_no: crowd.crowd_pay_no,
                    amount: rest_amount,
                    form_id: formId
                });
                if (pay_sign) {
                    await wxPay(pay_sign);
                }
            } catch (e) {
                wx.showModal({
                    title: '温馨提醒',
                    content: e.errMsg,
                    showCancel: false
                });
            }
        }
    },
    // 赞助弹窗
    showPayModal() {
        let { payModal } = this.data;
        payModal ? payModal = false : payModal = true;
        this.setData({
            payModal
        });
    }
});
