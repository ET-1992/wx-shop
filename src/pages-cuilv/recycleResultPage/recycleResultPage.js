import { go } from 'utils/util';
import api from 'utils/api';

Page({
    data: {
        title: 'resultPage',
        isLoading: false,
        pageId: 0,  // 结果页面id
    },

    onLoad(params) {
        let { id, orderNo = '', amount = '', weight = 0 } = params;
        this.setData({
            pageId: id,
            orderNo,
            amount,
            weight,
        });
        this.initPage();
    },

    go,

    // 初始化结果页
    initPage() {
        let { pageId, orderNo } = this.data;
        if (pageId === '1') {
            // 回购订单
            this.getOrder(orderNo);
        }
    },

    // 获取订单信息
    async getOrder(no) {
        this.setData({
            isLoading: true
        });
        let data = await api.hei.getOrder({
            repo_no: no
        });
        this.setData({
            orderData: data.order,
            isLoading: false
        });
    }
});
