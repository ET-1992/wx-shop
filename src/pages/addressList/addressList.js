import { auth, wxReceriverPairs } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY } from 'constants/index';
import proxy from 'utils/wxProxy';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        addressList: [],  // 地址列表
        isLoading: true,
        radioSelected: '',  // 地址选中项
    },

    onLoad(params) {
        console.log(params);
    },

    onShow() {
        this.getAddressList();
    },

    // 默认地址选中项
    findRadioSeleted() {
        let { radioSelected, addressList = [] } = this.data;
        if (radioSelected) {
            return;
        }
        let address = wx.getStorageSync(ADDRESS_KEY);
        let { id } = address;
        let index = addressList.findIndex(value => {
            return value.id === id;
        });
        if (index > -1) {
            this.setData({
                radioSelected: index,
            });
        }
    },

    // 地址单选框选中时
    radioChange: function (event) {
        let { addressList } = this.data;
        let index = event.detail;
        let address = addressList[index];
        // 选中地址对象
        let selectedAddress = wxReceriverPairs(address);
        // 添加经纬度
        let { latitude, longtitude: longitude } = address;
        selectedAddress = Object.assign(selectedAddress, { latitude, longitude });
        wx.setStorageSync(ADDRESS_KEY, selectedAddress);
        this.setData({
            radioSelected: index,
        });
        app.event.emit('setAddressListEvent', selectedAddress);
        wx.navigateBack();
    },

    // 获取地址列表
    async getAddressList() {
        let data = await api.hei.getReceiverList();
        let { receivers } = data;
        this.setData({
            addressList: receivers,
            isLoading: false,
        });
        this.findRadioSeleted();
    },

    // 编辑或添加地址
    onAddressEdit(e) {
        let { type, id } = e.currentTarget.dataset;
        let url = `../addressEdit/addressEdit?type=${type}`;
        if (id) {
            // 编辑地址需携带ID
            url += `&id=${id}`;
        }
        wx.navigateTo({
            url,
        });
    },

    // 微信导入地址
    async onImportAddress() {
        wx.showLoading({
            title: '加载中',
        });
        const res = await auth({
            scope: 'scope.address',
            ctx: this
        });
        if (!res) { return }
        try {
            await this.postAddress();
            wx.hideLoading();
            wx.showToast({
                title: '添加地址成功',
                duration: 1000,
            });
            this.getAddressList();
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.errMsg || '提交失败',
                showCancel: false,
            });
        }
    },

    // 发送微信地址
    async postAddress() {
        const address = await chooseAddress();
        let locationObj = await this.parseAddress(address) || {};
        let tranData = wxReceriverPairs(address);
        tranData = Object.assign(tranData, locationObj);
        await api.hei.addReceiverInfo(tranData);
    },

    // 微信地址解析
    async parseAddress(res) {
        let { provinceName, cityName, countyName, detailInfo } = res;
        let addressStr = [provinceName, cityName, countyName, detailInfo].join('');
        let data = {
            key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            address: addressStr,
            region: cityName,
        };
        let url = 'https://apis.map.qq.com/ws/geocoder/v1';
        try {
            let res = await proxy.request({
                url,
                data,
            });
            console.log('收货地址解析结果：', res);
            let lat = '',
                lng = '';
            if (res.data && res.data.status === 0) {
                ({ lat, lng } = res.data.result.location);
            }
            return {
                // 后端适配字段
                latitude: lat,
                longtitude: lng,
            };
        } catch (error) {
            console.log('地址解析错误', error);
        }
    },
});