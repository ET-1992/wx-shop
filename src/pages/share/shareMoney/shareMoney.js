import { checkPhone, bankCardAttribution } from 'utils/util';
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
        },

        cardType: '',   // 卡类型
        username: '',   // 用户名
        phoneNumber: '',    // 手机号
        bankName: '',   // 银行
        bankNumber: ''  // 银行卡
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

    /* radio选择改变触发 */
    radioChange(e) {
        this.setData({
            payStyle: e.detail.value
        });
        console.log('radio的value值为：', e.detail.value);
    },

    /* 验证手机 */
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

    getUserIdCardPhoneNumber(e) {
        this.setData({ phoneNumber: e.detail.value });
    },

    getUserIdCardName(e) {
        this.setData({ username: e.detail.value });
    },

    getUserIdCardNumber(e) {
        this.setData({
            bankNumber: e.detail.value
        });
        let temp = bankCardAttribution(e.detail.value);
        console.log(temp);
        if (temp === Error) {
            temp.bankName = '';
        } else {
            this.setData({ bankName: temp.bankName });
        }
    },

    getUserIdCardBankType(e) {
        this.setData({ bankName: e.detail.value });
    },

    /* 提交 */
    submitInfos() {
        let compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        let that = this;
        if (that.data.username.length === 0) {
            wx.showToast({ title: '用户名不能为空', icon: 'none', image: '', duration: 1000 });
        } else if (that.data.phoneNumber.length === 0) {
            wx.showToast({ title: '手机号不能为空', icon: 'none', image: '', duration: 1000 });
        } else if (that.data.phoneNumber.length !== 11) {
            wx.showToast({ title: '手机号长度有误', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!compare.test(this.data.phoneNumber)) {
            wx.showToast({
                title: '请输入正确的手机号', icon: 'none', image: '', duration: 1000
            });
            return false;
        } else if (!that.data.bankNumber) {
            wx.showToast({ title: '银行卡号不能为空', icon: 'none', image: '', duration: 1000 });
        } else if (!that.data.bankName) {
            wx.showToast({ title: '支行名称不能为空', icon: 'none', image: '', duration: 1000 });
        } else if (!that.data.bankName) {
            wx.showToast({ title: '不支持该类型的银行卡，请更换', icon: 'none', image: '', duration: 1000 });
        } else {
            // TODO post data to sever
        }
    },
});
