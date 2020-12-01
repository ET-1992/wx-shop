import { CONFIG } from 'constants/index';
import { wxPay, onDefaultShareAppMessage } from 'utils/pageShare';
import api from 'utils/api';
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
        codes: [],
        available: [],
        unavailable: [],
        isShowTimer: false,
        count: 0
    },

    onLoad(params) {
        console.log(params);
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
        try {
            const { codes } = api.hei.checkExchangeNumber({
                code,
                password
            });
            wx.setNavigationBarTitle({
                title: '我的兑换券'
            });
            console.log('data', codes);
            if (codes && codes.length > 0) {

                let available = codes.filter(item => {
                    return item.status === 1;
                });

                let unavailable = codes.filter(item => {
                    return item.status !== 1;
                });

                this.setData({
                    available,
                    unavailable
                });
            }

            this.setData({
                codes
            });
        } catch (e) {
            console.log('e.errMsg', e.errMsg);
            wx.showToast({
                title: e.errMsg || '登录失败，请重试',
                icon: 'none'
            });
        }
    },

    // 验证码登录
    onSubmitSms() {
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
        try {
            const { codes: { available = [], unavailable = [] }} = api.hei.checkExchangeNumber({
                phone: `${countryCode}${phone}`,
                code: sms
            });
            console.log('data', available, unavailable);
            wx.setNavigationBarTitle({
                title: '我的兑换券'
            });
            this.setData({
                available,
                unavailable
            });
        } catch (e) {
            console.log('e.errMsg', e.errMsg);
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
    async onRecharge(e) {
        const { password, code } = e.currentTarget.dataset;
        console.log('password, code', password, code);
        try {
            // 充值
            // const { pay_sign } = await api.hei.xxx({
            //     amount,
            //     pay_method: 'WEIXIN',
            // });
            // if (pay_sign) {
            //     await wxPay(pay_sign);
            // }

            // 兑换
            await api.hei.useExchangeNumber({
                code,
                password
            });
        } catch (e) {
            console.log('e.errMsg', e.errMsg);
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

    detached() {
        clearInterval(this.timer);
    }
});
