import { CONFIG, CONSUM_TEXT } from 'constants/index';
import { formatTime, textToValue, valueToText } from 'utils/util';
import { wxPay } from 'utils/pageShare';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        activeIndex: 0,
        accountList: [],
        isLoading: false,
        rechargeModal: false,
        next_cursor: 0,
        themeColor: {},
        currentUser: {},
    },

    onLoad(params) {
        console.log(params);
        if (params.activeIndex) {
            this.setData({
                activeIndex: Number(params.activeIndex),
                next_cursor: 0
            });
        }
    },

    async onShow() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ themeColor, config });
        this.getAccountList();
        this.getRechargeData();
    },

    // 获取列表数据
    async getAccountList(isLoading = true) {
        this.setData({ isLoading });
        const { next_cursor: cursor, activeIndex, accountList } = this.data;
        let currency = ['2', '3'][activeIndex];
        const data = await api.hei.wallet({ cursor, currency });
        let { data: { logs }, next_cursor } = data;

        for (let item in logs) {
            // 格式化时间和状态
            let account = logs[item];
            account.formatTime = formatTime(new Date(account.time * 1000));
            account.text = valueToText(CONSUM_TEXT, Number(account.type));
        }
        if (cursor > 0) {
            logs = [...accountList, ...logs];
        }
        this.setData({
            accountList: logs,
            next_cursor: next_cursor,
            isLoading: false,
        });
    },

    // 获取充值信息
    async getRechargeData() {
        const recharge = await api.hei.rechargePrice();
        if (recharge && recharge.data && recharge.data[0]) {
            recharge.data[0].checked = true;
        }
        this.setData({
            currentUser: recharge.current_user,
            rechargeArray: recharge.data
        });
    },

    // 改变导航标签
    changeNavbarList(e) {
        const { index } = e.detail;
        this.setData({
            activeIndex: index,
            next_cursor: 0
        });
        this.getAccountList();
    },

    async onReachBottom() {
        const { next_cursor } = this.data;
        if (!next_cursor) {
            return;
        }
        this.getAccountList(false);
    },

    // 打开会员充值
    onOpenRecharge() {
        const { rechargeArray } = this.data;
        if (rechargeArray && rechargeArray.length) {
            this.setData({ rechargeModal: true });
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '暂时无法开通会员',
                showCancel: false
            });
        }
    },

    // 关闭会员充值
    onCloseRecharge() {
        this.setData({
            rechargeModal: false
        });
    },

    // 储值卡确定充值
    onConfirmRecharge(ev) {
        let type = 2;
        let { amount, storeCardCode, isCustom } = ev.detail;
        console.log(amount, 'recharge----');
        this.setData({
            amount,
            storeCardCode,
            isCustom,
            rechargeModal: false
        });
        this.onPay(type);
    },

    // 跳转至收银台
    async onPay(type) {
        let { amount, config, storeCardCode, isCustom } = this.data;
        const { cashier_enable } = config;
        if (cashier_enable && amount > 0 && !isCustom) {
            wx.navigateTo({ url: `/pages/payCashier/payCashier?member_amount=${amount}&member_code=${storeCardCode}&member_type=${type}&from_page=member` });
            return;
        }
        if (cashier_enable && isCustom) {
            wx.navigateTo({ url: `/pages/payCashier/payCashier?member_amount=${amount}&member_isCustom=${isCustom}&member_type=${type}&from_page=member` });
            return;
        }
        try {
            const { pay_sign } =  await api.hei.membershipMultipay({
                amount,
                pay_method: 'WEIXIN',
                type
            });
            if (amount > 0 && pay_sign) {
                await wxPay(pay_sign);
            }
            this.onShow();
        } catch (err) {
            wx.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
        }

    },

    setConsumptionList() {
        this.onShow();
    }
});