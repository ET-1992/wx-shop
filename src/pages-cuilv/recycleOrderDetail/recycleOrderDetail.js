
import { CHECKPRODUCT, CHECKPPRICE } from 'constants/index';
import api from 'utils/api';
const app = getApp();
import { go } from 'utils/util';
import proxy from 'utils/wxProxy';

Page({
    data: {
        title: 'orderDetail',
        isLoading: true,
        checkProduct: CHECKPRODUCT,
        checkPrice: CHECKPPRICE,
        orderData: {},
        reportData: {},
    },

    onLoad({ orderId }) {
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
        this.getStorageData();
        this.setData({ orderId });
        this.getOrder();
    },

    go,

    // 获取用户信息
    getStorageData() {
        let user = wx.getStorageSync('user');
        console.log(user);
        this.setData({
            user,
            isIphoneX: app.systemInfo.isIphoneX,
        });
    },

    // 获取订单信息
    async getOrder() {
        this.setData({ isLoading: true });
        let { orderId } = this.data;
        let data = await api.hei.getOrder({
            repo_no: orderId
        });
        this.setData({
            orderData: data.order,
            reportData: data.report,
            isLoading: false
        });
        wx.stopPullDownRefresh();
    },

    // 下拉涮新
    onPullDownRefresh() {
        this.getOrder();
    },

    // 取消或确定订单
    async onHandleOrder(e) {
        let { order, handle } = e.target.dataset;
        let methodArr = ['getOrderConfirm', 'getOrdercancel'];
        let method,
            methodTip;
        if (handle === 1) {
            // 确定订单
            method = methodArr[0];
            methodTip = '确认订单';
        } else if (handle === 2) {
            // 取消订单
            method = methodArr[1];
            methodTip = '取消订单';
        } else {
            return;
        }
        let { confirm } = await proxy.showModal({
            title: '温馨提示',
            content: `您确定要${methodTip}吗？`,
        });
        if (!confirm) { return }
        try {
            let data = await api.hei[method]({
                repo_no: order
            });
        } catch (e) {
            console.log(e);
            wx.showToast({ title: '后台出错了', icon: 'none' });
        }
        this.onLoad({ orderId: order });
    },

});
