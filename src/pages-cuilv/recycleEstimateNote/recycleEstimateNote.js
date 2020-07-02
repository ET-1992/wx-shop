import api from 'utils/api';

Page({
    data: {
        title: 'estimate',
        isLoading: true,
        fee: {},  // 金额数据
        rules: {},  // 规则提示
    },

    onLoad(params) {
        let { weight = 0, type } = params;
        console.log(params);
        this.getRuleData(type, weight);
    },

    // 获取展示数据
    async getRuleData(gold_type, weight) {
        let data = await api.hei.getGoldPrice({
            gold_type,
            weight,
        });
        let { fee, rules } = data;
        this.setData({
            fee,
            rules,
            isLoading: false,
        });
    },
});
