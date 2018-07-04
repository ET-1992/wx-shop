import { checkPhone } from 'utils/util';
// import { USER_KEY } from 'constants/index';
const app = getApp();
Page({
    data: {
        payStyles: [
            { name: '微信', value: '1', checked: 'true' },
            { name: '银行卡', value: '2' }
        ],

        payStyle: 1,

        isError: {
            phone: false,
            card: false
        }
    },

    onLoad(parmas) {
        console.log(parmas);
        const systemInfo = wx.getSystemInfoSync();
        // const user = wx.getStorageSync(USER_KEY);
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const { themeColor } = app.globalData;
        this.setData({
            // user,
            isIphoneX,
            themeColor
        });
    },

    check(e) {
        const { value } = e.detail;
        if (!checkPhone(value)) {
            this.setData({
                'isError.phone': true
            });
        }
    },

    reset() {
        this.setData({
            'isError.phone': false
        });
    },

    radioChange(e) {
        this.setData({
            payStyle: e.detail.value
        });
        console.log('radio的value值为：', e.detail.value);
    }
});
