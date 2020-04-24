import { auth, wxReceriverPairs } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY } from 'constants/index';
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
        const res = await auth({
            scope: 'scope.address',
            ctx: this
        });
        if (res) {
            const getData = await chooseAddress();
            let tranData = wxReceriverPairs(getData);
            await api.hei.addReceiverInfo(tranData);
            wx.showToast({
                title: '添加地址成功',
                duration: 1000,
            });
            this.getAddressList();
        }
    },
});