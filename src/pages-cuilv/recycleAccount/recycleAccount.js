import proxy from 'utils/wxProxy';
import { go } from 'utils/util';
import api from 'utils/api';

Page({
    data: {
        title: 'account',
        weight: '',  // 提取重量
        loss: '',  // 金价损耗率
        goldRule: '',  // 回收金价说明
        isLoading: true
    },

    onLoad(params) {
        console.log(params);
        this.getAccount();
    },

    go,

    // 获取账号数据
    async getAccount() {
        let data = await api.hei.getAccount({});
        this.setData({
            goldPrice: data.base_gold_price,
            goldWeight: data.account.deposit_balance,
            goldRule: data.prepare_evaluate_setting.recycle_method_explanation || '',
            loss: data.deposit_lost_rate,
            isLoading: false
        });
    },

    // 展示回收说明
    showRule() {
        let { goldRule } = this.data;
        wx.showModal({
            content: goldRule || '无相关说明',
            showCancel: false
        });
    },

    // 立即提取
    async onPickUp() {
        let { weight } = this.data;
        try {
            if (!weight) {
                throw new Error('请输入提取重量');
            }
            const { cancel } = await proxy.showModal({
                title: '温馨提示',
                content: `申请黄金提取${weight}克`,
                cancelColor: '#999999',
                confirmColor: '#38B82E',
            });
            if (cancel) { return }
            // 重量单位为毫克
            let newWeight = Number(weight * 1000);
            const data = await api.hei.postGoldToWallet({
                weight: newWeight,
            });
            wx.redirectTo({
                url: `/pages-cuilv/recycleResultPage/recycleResultPage?id=3&weight=${weight}`
            });
        } catch (e) {
            await proxy.showModal({
                title: '温馨提示',
                content: e.message || e.errMsg,
                showCancel: false,
            });
        }
    },

    // 监听输入框
    onInput(e) {
        let name = e.currentTarget.dataset.name;
        let value = e.detail.value;
        if (name === 'weight') {
            value = this.formatWeight(value);
        }
        this.setData({
            [name]: value,
        });
    },

    // 过滤重量格式
    formatWeight(value) {
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
    }
});
