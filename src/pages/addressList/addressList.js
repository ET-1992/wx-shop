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

    // 进入页面查找选中项
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
        console.log('index', index);
        if (index > -1) {
            this.setData({
                radioSelected: index,
            });
        }
    },

    // 地址单选框选中
    radioChange: function (event) {
        let { addressList } = this.data;
        let index = event.detail;
        let address = addressList[index];
        // 选中地址对象
        let selectedAddress = wxReceriverPairs(address);
        wx.removeStorageSync(ADDRESS_KEY);
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
        if (res) {
            const getData = await chooseAddress();
            let res = await this.parseAddress(getData) || {};
            let tranData = wxReceriverPairs(getData);
            tranData = Object.assign(tranData, res);
            await api.hei.addReceiverInfo(tranData);
            wx.hideLoading();
            wx.showToast({
                title: '添加地址成功',
                duration: 1000,
            });
            this.getAddressList();
        }
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
                latitude: lat,
                longtitude: lng,
            };
        } catch (error) {
            console.log('地址解析错误', error);
        }
    },
});