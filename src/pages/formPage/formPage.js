const app = getApp();

import api from 'utils/api';
Page({
    async onLoad(param) {
        const { id = '' } = param;
        const formData = await api.hei.getFormData({ id });

        this.setData({
            formData,
            id,
        });
    },

    async submit(e) {
        console.log(e.detail);
        const { form } = e.detail;
        const { id: form_id } = this.data;
        try {
            wx.showLoading();
            const { times, count } = await api.hei.submitFormData({ data: form, form_id });
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: '提交成功',
                showCancel: false
            });
            this.setData({
                'formData.times': times,
                'formData.count': count
            });
        } catch (e) {
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false
            });
        }
    },
});
