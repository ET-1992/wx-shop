import { checkPhone, go, subscribeMessage } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import api from 'utils/api';
import { showModal } from 'utils/wxp';
import { Decimal } from 'decimal.js';

const app = getApp();
Page({
    data: {
        payStyles: [
            { name: '微信', value: 'weixin', checked: 'true' },
            { name: '银行卡', value: 'bank' }
        ],
        payStyle: 'weixin',
        isError: {
            phone: false,
            card: false
        },
        balance: '0',
        income_pending: '0',
        wechatId: '',   // 微信号
        username: '',   // 用户名
        phoneNumber: '',    // 手机号
        bankName: '',   // 银行
        bankNumber: '',  // 银行卡
        isGetingMoney: false,
        checked: false
    },

    onLoad(parmas) {
        console.log(parmas);
        const { balance = '0', income_pending = '0', code } = parmas;
        const isIphoneX = app.systemInfo.isIphoneX;
        const { themeColor } = app.globalData;
        this.setData({
            isIphoneX,
            themeColor,
            balance,
            income_pending,
            code,
            globalData: app.globalData
        });
    },

    onShow() {
        const { code } = this.data;
        const data = wx.getStorageSync('ShareUserInfo');
        let shareUseInfo = {};
        if (data && data[code]) {
            shareUseInfo = data[code];
        }
        this.setData({
            ...shareUseInfo
        });
    },

    /* radio选择改变触发 */
    radioChange(e) {
        this.setData({
            payStyle: e.detail.value
        });
        console.log('radio的value值为：', e.detail.value);
    },

    /* 验证手机 */
    check(e) {
        const { value } = e.detail;
        if (!checkPhone(value)) {
            this.setData({
                'isError.phone': true
            });
        }
    },
    reset() {
        this.setData({
            'isError.phone': false
        });
    },

    getValue(ev) {
        const { value } = ev.detail;
        const { method } = ev.currentTarget.dataset;
        this.setData({ [method]: value });
    },

    /* 银行卡提交 */
    async submitChecked() {
        const { balance, phoneNumber, wechatId, money, username, bankNumber, bankName, payStyle, checked } = this.data;
        console.log('submitChecked', balance, username, phoneNumber, bankNumber, bankName, money, wechatId, checked, payStyle);
        let error = '';

        if (!checked) { error = '请阅读并同意《用户服务协议》与《隐私政策》' }

        if (payStyle === 'weixin') {
            if (wechatId.length === 0) { error = '微信号不能为空' }
        }

        if (payStyle === 'bank') {
            if (!bankName) { error = '开户行不能为空' }
            if (!bankNumber) { error = '银行卡号不能为空' }
            if (username.length === 0) { error = '用户名不能为空' }
        }

        if (!checkPhone(phoneNumber)) { error = '请输入正确的手机号' }
        if (phoneNumber.length !== 11) { error = '手机号长度有误' }
        if (phoneNumber.length === 0) { error = '手机号不能为空' }
        if (Number(money) > Number(balance)) { error = '申请金额已超过可提现金额' }
        if (Number(balance) === 0) { error = '可提现金额为0' }
        if (!Number(money)) { error = '提现金额不能为空' }

        if (error) {
            wx.showToast({
                title: error,
                icon: 'none',
                duration: 1000
            });
            return;
        }

        this.getShareMoney();
    },

    async getShareMoney() {
        this.saveShareUserInfo();

        const { isGetingMoney } = this.data;
        if (isGetingMoney) {
            return;
        }
        try {
            const { payStyle, phoneNumber, bankName, wechatId, bankNumber, money, username } = this.data;
            this.setData({
                isGetingMoney: true
            });
            const data = await api.hei.getShareMoney({
                method: payStyle,
                phone: phoneNumber,
                bank_account_no: bankNumber,
                bank_name: bankName,
                weixin_account: wechatId,
                name: username,
                amount: new Decimal(money).mul(100).toNumber()
            });
            let subKeys = [{ key: 'withdrawal_rejected' }, { key: 'withdrawal_approved' }];
            await subscribeMessage(subKeys);
            this.setData({
                isGetingMoney: false
            });

            console.log(data);
            const { confirm }  = await showModal({
                title: '温馨提示',
                content: '申请成功，请等待商家审核',
                showCancel: false,
                mask: true
            });
            if (confirm) {
                wx.navigateBack();
            }
        } catch (e) {
            this.setData({
                isGetingMoney: false
            });
            if (e.code) {
                wx.showToast({ title: e.errMsg, icon: 'none', image: '', duration: 1000 });
            } else {
                wx.showToast({ title: '提款失败，请重试', icon: 'none', image: '', duration: 1000 });
            }
        }

    },

    saveMoneyValue(e) {
        const { value } = e.detail;
        console.log(value);
        this.setData({
            money: value
        });
    },

    saveShareUserInfo() {
        const { code, wechatId, username, phoneNumber, bankName, bankNumber } = this.data;
        try {
            const data = wx.getStorageSync('ShareUserInfo');
            if (data) {
                data[code] = {
                    wechatId, username, phoneNumber, bankName, bankNumber
                };
                wx.setStorageSync('ShareUserInfo', { ...data });
            } else {
                wx.setStorageSync('ShareUserInfo', {
                    [code]: {
                        wechatId, username, phoneNumber, bankName, bankNumber
                    }
                });
            }
        } catch (e) {
            wx.setStorageSync('ShareUserInfo', {
                [code]: {
                    wechatId, username, phoneNumber, bankName, bankNumber
                }
            });
        }
    },

    onChange(event) {
        this.setData({
            checked: event.detail
        });
        console.log('checked', this.data.checked);
    },

    go,

    // 页面分享设置
    onShareAppMessage: onDefaultShareAppMessage
});
