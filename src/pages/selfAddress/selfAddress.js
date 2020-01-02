import { ADDRESS_KEY } from 'constants/index';
import { api } from 'peanut-all';

const app = getApp();

Page({
    data: {
        isLoading: true,
        selfAddressObj: {},
        error: {},
        isShowAreaModal: false
    },

    async onLoad() {
        const selfAddressObj = wx.getStorageSync(ADDRESS_KEY) || {};
        const { themeColor } = app.globalData;
        const { areaList } = await api.hei.fetchRegionList();

        this.setData({
            areaList,
            selfAddressObj,
            themeColor,
            isLoading: false
        });
    },

    showAreaModal() {
        this.setData({
            isShowAreaModal: true
        });
    },
    closeAreaModal() {
        const { selfAddressObj, error } = this.data;
        if (!selfAddressObj.area) {
            error.area = true;
        }
        this.setData({
            error,
            isShowAreaModal: false
        });
    },
    onConfirmArea(ev) {
        const { selfAddressObj, isShowAreaModal, error } = this.data;
        const { values } = ev.detail;
        error.area = false;

        selfAddressObj.provinceName = values[0].name;
        selfAddressObj.cityName = values[1].name;
        selfAddressObj.countyName = values[2].name;
        selfAddressObj.areaCode = values[2].code;
        selfAddressObj.area = `${values[0].name !== values[1].name ? values[0].name + '/' : ''}${values[1].name}/${values[2].name}`;
        this.setData({
            error,
            selfAddressObj,
            isShowAreaModal: !isShowAreaModal
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
                error,
                selfAddressObj
            });
        }
    },

    saveSelfAddress() {
        const { selfAddressObj, error } = this.data;
        if (error.userName || error.telNumber || error.area || error.detailInfo) {
            wx.showToast({
                title: '请检查您的信息',
                icon: 'none'
            });
            return;
        }
        if (!selfAddressObj.userName || !selfAddressObj.telNumber || !selfAddressObj.detailInfo || !selfAddressObj.area) {
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
        app.event.emit('setOverseeAddressEvent', selfAddressObj);

        wx.navigateBack({
            delta: 1
        });
    }
});
