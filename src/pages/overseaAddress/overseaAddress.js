import { OVERSEA_ADDRESS_KEY, ADDRESS_KEY } from 'constants/index';

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
        const { error, overseaObj } = this.data;
        const { value } = e.detail.detail;
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
        const { overseaObj } = this.data;
        wx.setStorageSync(ADDRESS_KEY, overseaObj);
        wx.showToast({
            title: '填写成功',
            icon: 'success'
        });
        wx.navigateBack({
            delta: 1
        });
    }
});
