import { go } from 'utils/util';
import api from 'utils/api';

Page({
    data: {
        title: 'depositIndex',
        isLoading: true,
        sliders: [],  // 幻灯片
        goldData: {},  // 金价相关数据
        articles: {},  // 文章列表
        account: {},  // 账户信息
    },

    onLoad(params) {
        console.log(params);
    },

    onShow() {
        this.getHomeData();
    },

    go,

    // 获取首页数据
    async getHomeData() {
        this.setData({ isLoading: true });
        const data = await api.hei.getDepositHome();
        let { gold_data, sliders, articles, account } = data;
        this.setData({
            goldData: gold_data,
            sliders,
            articles,
            account,
            isLoading: false
        });
        wx.stopPullDownRefresh();
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.getHomeData();
    },

    miniFail(e) {
        console.log('miniFail', e);
        // const { errMsg } = e.detail;
        // wx.showModal({
        //     title: '温馨提示',
        //     content: errMsg,
        // });
    },
});
