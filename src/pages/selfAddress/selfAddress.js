import { OVERSEA_ADDRESS_KEY, ADDRESS_KEY } from 'constants/index';

const app = getApp();

Page({
    data: {
        selfAddressObj: {},
        error: {}
    },

    onLoad(parmas) {
        console.log(parmas);
        const selfAddressObj = wx.getStorageSync(ADDRESS_KEY) || {};
        this.setData({
            selfAddressObj
        });
    },

    check(e) {
        console.log(e);
        const { error, selfAddressObj } = this.data;
        const value = e.detail;
        const { key } = e.currentTarget.dataset;
        if (!value) {
            error[key] = true;
            this.setData({
                error
            });
        } else {
            error[key] = false;
            selfAddressObj[key] = value;
            this.setData({
                selfAddressObj
            });
        }
    },

    saveSelfAddress() {
        const { selfAddressObj, error } = this.data;
        if (error.userName || error.telNumber || error.detailInfo) {
            wx.showToast({
                title: '请检查您的信息',
                icon: 'none'
            });
            return;
        }
        if (!selfAddressObj.userName || !selfAddressObj.telNumber || !selfAddressObj.detailInfo) {
            wx.showToast({
                title: '请注意带*号为必填项',
                icon: 'none'
            });
            return;
        }
        wx.removeStorageSync(ADDRESS_KEY);
        wx.setStorageSync(ADDRESS_KEY, selfAddressObj);
        wx.showToast({
            title: '填写成功',
            icon: 'success'
        });
        app.event.emit('setOverseeAdressEvent', selfAddressObj);

        wx.navigateBack({
            delta: 1
        });
    }
});
