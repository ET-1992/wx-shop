import proxy from 'utils/wxProxy';
import { go } from 'utils/util';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        title: 'account',
        money: '',  // 提取重量
        bankName: '',  // 开户行
        person: '',  // 开户人
        number: '',  // 银行卡号
        isLoading: true,
        payStyles: [
            { name: '微信', value: 'weixin', checked: 'true' },
            { name: '银行卡', value: 'bank' }
        ],
        payStyle: 'weixin',
        phone: '',  // 手机号
        weixinNum: '',  // 微信号
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
        this.getAccount();
    },

    go,

    // 获取账号数据
    async getAccount() {
        let data = await api.hei.getAccount({});
        let { current_user, account } = data;
        this.setData({
            user: current_user,
            account,
            isLoading: false
        });
    },

    // radio选择改变触发
    radioChange(e) {
        this.setData({
            payStyle: e.detail.value
        });
        console.log('radio的value值为：', e.detail.value);
    },

    // 立即提取
    async onPickUp() {
        let { money } = this.data;
        try {
            this.validataForm();
            const { cancel } = await proxy.showModal({
                title: '温馨提示',
                content: `提取钱包余额 ${money}元 至银行卡`,
                cancelColor: '#999999',
                confirmColor: '#38B82E',
            });
            if (cancel) { return }
            await this.sendForm();
            this.resetForm();
            wx.navigateTo({
                url: `/pages-cuilv/recycleResultPage/recycleResultPage?id=4&amount=${money}`
            });
        } catch (e) {
            await proxy.showModal({
                title: '温馨提示',
                content: e.errMsg || e.message || '提取失败，请重试！',
                showCancel: false,
            });
        }
    },

    // 验证提现表单
    validataForm() {
        let { money, phone, bankName, person, number, weixinNum, payStyle } = this.data;
        if (!money) {
            throw new Error('请输入您的提取金额');
        } else if (!phone) {
            throw new Error('请输入您的手机号码');
        } else if (payStyle === 'bank' && (!(money && bankName && person && number))) {
            throw new Error('请核实您的银行卡信息');
        } else if (payStyle === 'weixin' && (!weixinNum)) {
            throw new Error('请核实您的微信号');
        }
    },

    // 发送表单请求
    async sendForm() {
        let { money, phone, bankName, person, number, weixinNum, payStyle } = this.data;
        // 以分为单位发送
        let newMoney = Number(money * 100);
        const TYPEID = 4;
        await api.hei.postAccount({
            method: payStyle,
            type: TYPEID,
            phone,
            amount: newMoney,
            name: person,
            bank_name: bankName,
            bank_account_no: number,
            weixin_account: weixinNum,
        });

    },

    // 监听输入框
    onInput(e) {
        let name = e.currentTarget.dataset.name;
        let value = e.detail.value;
        if (name === 'money') {
            value = this.formatMoney(value);
        }
        this.setData({
            [name]: value
        });
    },

    // 过滤金额格式
    formatMoney(value) {
        let res = value;
        let regStrs = [
            ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
            ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
            ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
        ];
        for (let i = 0; i < regStrs.length; i++) {
            let reg = new RegExp(regStrs[i][0]);
            res = value.replace(reg, regStrs[i][1]);
        }
        return res;
    },

    // 清空表单数据
    resetForm() {
        this.setData({
            money: '',
            phone: '',
            person: '',
            bankName: '',
            number: '',
        });
    },
});
