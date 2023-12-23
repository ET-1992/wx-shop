
import api from 'utils/api';
import { autoTransformAddress, formatTime, valueToText } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';

const app = getApp();

Page({
    data: {
        medal: {}
    },

    onLoad(params) {
        // console.log('params',params)
        // app.event.on('getMedalData', this.getMedalData, this);
        // console.log('ssssss')
        const medal = wx.getStorageSync('medal');
        this.setData({
            medal
        });
    },
    getMedalData(data) {
        this.setData({
            medal: data
        });
    },
    async payMedal() {
        console.log('payMedal');
        try {
            let param = {
                medal_id: this.data.medal.id
            };
            console.log('param', param);
            let response = await api.hei.pvmExchangeMedal(param);
            wx.showToast({
                title: '兑换成功',
            });
            wx.navigateTo({
                url: joinUrl('/pages-pvm/myMedal/myMedal', {}),
            });
        } catch (e) {
            // console.log('requestPayment err', e);
            wx.showModal({
                content: e.errMsg || '请尽快完成兑换',
                title: '兑换取消',
                showCancel: false
            });
        }
    },

    onUnload() {
        app.event.off('getMedalData', this);
    },
});