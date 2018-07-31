import { checkPhone, bankCardAttribution } from 'utils/util';
import { BANK_CARD_LIST } from 'utils/bank';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import api from 'utils/api';
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { showModal } from 'utils/wxp';

// import { USER_KEY } from 'constants/index';
const app = getApp();
Page({
    data: {
        payStyles: [
            { name: '微信', value: 'weixin', checked: 'true' },
            { name: '银行卡', value: 'bank' }
        ],

        payStyle: 'weixin',

        index: 0,

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
        isGetingMoney: false
    },

    onLoad(parmas) {
        console.log(parmas);
        const { balance = '0', income_pending = '0', code } = parmas;
        const isIphoneX = app.systemInfo.isIphoneX;
        const { themeColor } = app.globalData;
        this.setData({
            // user,
            isIphoneX,
            themeColor,
            bankNameList: BANK_CARD_LIST,
            balance,
            income_pending,
            code,
        });

        console.log(this.data.bankNameList);
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

    getUserIdCardPhoneNumber(e) {
        this.setData({ phoneNumber: e.detail.value });
    },

    getUserWechatId(e) {
        this.setData({ wechatId: e.detail.value });
    },

    getUserIdCardName(e) {
        this.setData({ username: e.detail.value });
    },

    getUserIdCardNumber(e) {
        this.setData({
            bankNumber: e.detail.value
        });
        let temp = bankCardAttribution(e.detail.value);
        console.log(temp);
        if (temp === 0) {
            this.setData({ bankName: '' });
        } else {
            this.setData({ bankName: temp.bankName });
        }
    },

    bindPickerChange(e) {
        this.setData({
            index: e.detail.value,
            bankName: this.data.bankNameList[e.detail.value].bankName
        });
    },

    /* 银行卡提交 */
    async submitBank() {
        let that = this;
        if (that.data.username.length === 0) {
            wx.showToast({ title: '用户名不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (that.data.phoneNumber.length === 0) {
            wx.showToast({ title: '手机号不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (that.data.phoneNumber.length !== 11) {
            wx.showToast({ title: '手机号长度有误', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!checkPhone(this.data.phoneNumber)) {
            wx.showToast({ title: '请输入正确的手机号', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!that.data.bankNumber) {
            wx.showToast({ title: '银行卡号不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!that.data.bankName) {
            wx.showToast({ title: '开户行不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else {
            console.log('submitBank');
        }

        this.getShareMoney();
    },

    async submitWechat() {
        let that = this;
        if (that.data.phoneNumber.length === 0) {
            wx.showToast({ title: '手机号不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!checkPhone(this.data.phoneNumber)) {
            wx.showToast({ title: '请输入正确的手机号', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (that.data.phoneNumber.length !== 11) {
            wx.showToast({ title: '手机号长度有误', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (that.data.wechatId.length === 0) {
            wx.showToast({ title: '微信号不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        }

        console.log('submitWechat');
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
                amount: Number(money) * 100
            });
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
            wx.showToast({ title: '提款失败，请重试', icon: 'none', image: '', duration: 1000 });
        }

    },

    setMoneyValue(e) {
        const { value } = e.detail;
        const { balance } = this.data;
        if (Number(value) > Number(balance)) {
            return balance;
        }
        return value;
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

    // 页面分享设置
    onShareAppMessage: onDefaultShareAppMessage
});
