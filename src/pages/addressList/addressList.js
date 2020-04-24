import { auth, wxTransformReceiver } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY } from 'constants/index';
import api from 'utils/api';

Page({
    data: {
        addressList: [],
        isLoading: true,
    },
    radioChange: function (event) {
        this.setData({
            radioSelected: event.detail
        });
    },

    onLoad(params) {
        console.log(params);
    },

    onShow() {
        this.getAddressList();
    },

    // 获取地址列表
    async getAddressList() {
        let data = await api.hei.getReceiverList();
        let { receivers } = data;
        this.setData({
            addressList: receivers,
            isLoading: false,
        });
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
            wx.setStorageSync(ADDRESS_KEY, getData);
            let tranData = wxTransformReceiver(getData);
            await api.hei.addReceiverInfo(tranData);
            wx.showToast({
                title: '添加地址成功',
                duration: 1000,
            });
            this.getAddressList();
        }
    },
});