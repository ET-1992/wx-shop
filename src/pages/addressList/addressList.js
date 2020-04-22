import { auth } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY } from 'constants/index';

Page({
    data: {

    },
    radioChange: function (event) {
        this.setData({
            radioSelected: event.detail
        });
    },

    onLoad(params) {
        console.log(params);
    },

    // 编辑或添加地址
    onAddressEdit(e) {
        let { type } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../addressEdit/addressEdit?type=${type}`,
        });
    },

    // 微信导入地址
    async onImportAddress() {
        const res = await auth({
            scope: 'scope.address',
            ctx: this
        });
        if (res) {
            const addressRes = await chooseAddress();
            wx.setStorageSync(ADDRESS_KEY, addressRes);
        }
    },
});