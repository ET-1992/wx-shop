import { OVERSEA_ADDRESS_KEY, ADDRESS_KEY } from 'constants/index';

const app = getApp();

Page({
    data: {
        overseaObj: {},
        error: {}
    },

    onLoad(parmas) {
        console.log(parmas);
        const overseaObj = wx.getStorageSync(ADDRESS_KEY) || {};
        this.setData({
            overseaObj
        });
    },

    check(e) {
        console.log(e);
        const { error, overseaObj } = this.data;
        const value = e.detail;
        const { key } = e.currentTarget.dataset;
        if (!value) {
            error[key] = true;
            this.setData({
                error
            });
        } else {
            error[key] = false;
            overseaObj[key] = value;
            this.setData({
                overseaObj
            });
        }
    },

    saveOversea() {
        const { overseaObj, error } = this.data;
        if (error.userName || error.telNumber || error.detailInfo) {
            wx.showToast({
                title: '请检查您的信息',
                icon: 'none'
            });
            return;
        }
        wx.removeStorageSync(ADDRESS_KEY);
        wx.setStorageSync(ADDRESS_KEY, overseaObj);
        wx.showToast({
            title: '填写成功',
            icon: 'success'
        });
        app.event.emit('setOverseeAdressEvent', overseaObj);

        wx.navigateBack({
            delta: 1
        });
    }
});
