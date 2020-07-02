import api from 'utils/api';
import { LOGISTICS_STATUS_TEXT } from 'constants/index';
import { valueToText } from 'utils/util';
import proxy from 'utils/wxProxy';
const app = getApp();

// 创建页面实例对象
Page({
    // 页面的初始数据
    data: {
        logistics: {
            company: '--',
            no: '--',
            list: [],
            status: '',
        },
        order: {}
    },

    async onLoad({ orderNo, logisticId = '' }) {
        try {
            wx.showLoading({ title: '加载中...', mask: true });
            const { order } = await api.hei.fetchOrder({ order_no: orderNo });
            const { logistics } = await api.hei.fetchLogistic({ order_no: orderNo, logistic_id: logisticId });
            const updateData = { order };
            if (logistics) {
                logistics.list = logistics.list || [];
                logistics.logisticsText = valueToText(LOGISTICS_STATUS_TEXT, logistics.status);
                updateData.logistics = logistics;
            }
            this.setData({
                ...updateData,
                globalData: app.globalData
            });
            wx.hideLoading();
        } catch (err) {
            wx.hideLoading();
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false
            });
            if (confirm) {
                wx.navigateBack({ delta: 1 });
            }
        }
    },
    async setClipboard(ev) {
        try {
            const { data } = ev.currentTarget.dataset;
            await proxy.setClipboardData({ data: String(data) });
            wx.showToast({ title: '复制成功！', icon: 'success' });
        } catch (err) {
            console.log(err);
        }
    },
    navigateToMiniProgram(ev) {
        const { no } = ev.currentTarget.dataset;
        wx.navigateToMiniProgram({
            appId: 'wx6885acbedba59c14',
            path: `pages/result/result?nu=${no}&com=&querysource=third_xcx`,
            envVersion: 'release'
        });
    }
});
