import { CONFIG } from 'constants/index';
import { wxPay, onDefaultShareAppMessage } from 'utils/pageShare';
import api from 'utils/api';
import proxy from 'utils/wxProxy';
const app = getApp();
const TIME_COUNT = 60;
Page({
    data: {
        title: 'exchangeCard',
        themeColor: {},
        config: {},
        activeIndex: 0,
        next_cursor: 0,
        tabList: [
            {
                idx: 0,
                title: '卡密兑换',
            },
            {
                idx: 1,
                title: '手机验证',
            }
        ],
        code: '',
        password: '',
        phone: '',
        sms: '',
        countryCode: '+86',
        codes: {},
        available: [],
        unavailable: [],
        isShowTimer: false,
        isCanShowPassword: false,
        isShowCodes: false,
        count: 0
    },

    onLoad(params) {
        console.log(params);
        const { code = '', password = '' } = params;
        if (code || password) {
            this.setData({
                code,
                password
            });
        }
    },

    async onShow() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ themeColor, config });
    },

    // 改变导航标签
    changeNavbarList(e) {
        const { index } = e.detail;
        this.setData({
            activeIndex: index
        });
    },

    // 密码登录
    async onSubmitPassword() {
        const { code, password } = this.data;
        if (!code) {
            wx.showToast({
                title: '请输入卡号',
                icon: 'none'
            });
            return;
        }
        if (!password) {
            wx.showToast({
                title: '请输入密码',
                icon: 'none'
            });
            return;
        }
        wx.showLoading({
            title: '加载中',
        });
        try {
            const { codes: { available = [], unavailable = [] }} = await api.hei.checkExchangeNumber({
                code,
                password
            });
            wx.setNavigationBarTitle({
                title: '我的兑换券'
            });

            this.setData({
                available,
                unavailable,
                isShowCodes: true
            });
            wx.hideLoading();
        } catch (e) {
            wx.hideLoading();
            console.log('e.errMsg', e);
            wx.showToast({
                title: e.errMsg || '登录失败，请重试',
                icon: 'none'
            });
        }
    },

    // 验证码登录
    async onSubmitSms() {
        const { countryCode, phone, sms } = this.data;
        if (!phone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            });
            return;
        }
        if (!sms) {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none'
            });
            return;
        }
        wx.showLoading({
            title: '加载中',
        });
        try {
            const { codes: { available = [], unavailable = [] }} = await api.hei.checkPhoneNumber({
                phone: `${countryCode}${phone}`,
                code: sms
            });
            console.log('data', available, unavailable);
            wx.setNavigationBarTitle({
                title: '我的兑换券'
            });

            const NOW_TIME = Math.round(Date.now() / 1000);
            console.log('NOW_TIME', NOW_TIME);
            unavailable.forEach(item => {
                const EXPIRED_TIME = item.expired_time;
                const NOW_TIME = item.time;
                const isExpired = EXPIRED_TIME - NOW_TIME;
                item.isExpired = isExpired < 0 ? true : false;
                return item;
            });
            this.setData({
                available,
                unavailable,
                isShowCodes: true
            });
            wx.hideLoading();
        } catch (e) {
            wx.hideLoading();
            console.log('e.errMsg', e);
            wx.showToast({
                title: e.errMsg || '登录失败，请重试',
                icon: 'none'
            });
        }
    },

    // 获取验证码
    async onClickGetSms() {
        const { countryCode, phone } = this.data;
        if (!phone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none'
            });
            return;
        }
        wx.showToast({
            title: '已发送验证码，请注意查收',
            icon: 'none'
        });
        this.setData({ isShowTimer: true, count: TIME_COUNT });
        this.timer = setInterval(() => {
            let { count } = this.data;
            if (count > 0 && count <= 60) {
                --count;
                this.setData({ count });
            } else {
                this.setData({ isShowTimer: false });
                clearInterval(this.timer);
            }
        }, 1000);
        await api.hei.getCode({ phone: `${countryCode}${phone}` });
    },

    // 使用
    async onUseExchangeCard(e) {
        const { available } = this.data;
        wx.showLoading({
            title: '使用中',
        });
        const { password, code, index } = e.currentTarget.dataset;
        console.log(password, code, index, 'password, code, index');

        try {
            await api.hei.useExchangeNumber({
                code,
                password
            });
            wx.hideLoading();

            available[index].isUsed = true;
            this.setData({ available });

            let { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '兑换券已使用，点击确认查看'
            });

            if (confirm) {
                wx.navigateTo({ url: '/pages/me/wallet/wallet' });
            }
        } catch (e) {
            wx.hideLoading();
            console.log('e.errMsg', e);
            wx.showToast({
                title: e.errMsg || '使用失败，请重试',
                icon: 'none'
            });
        }
    },

    onChangeCardNumber(event) {
        const { value } = event.detail;
        this.setData({ code: value });
    },
    onChangePassword(event) {
        const { value } = event.detail;
        this.setData({ password: value });
    },
    onChangePhone(event) {
        const { value } = event.detail;
        this.setData({ phone: value });
    },
    onChangeSms(event) {
        const { value } = event.detail;
        this.setData({ sms: value });
    },
    isShowPassword() {
        console.log('isShowPassword');
        const { isCanShowPassword } = this.data;
        this.setData({ isCanShowPassword: !isCanShowPassword });
    },
    clearNumberInput() {
        console.log('clearNumberInput');
        this.setData({ code: '', isShowClearIcon: false });
    },

    clearPhoneInput() {
        console.log('clearNumberInput');
        this.setData({ phone: '', isShowClearIcon: false });
    },

    clickShowClearIcon() {
        this.setData({ isShowClearIcon: true });
    },

    detached() {
        clearInterval(this.timer);
    }
});
