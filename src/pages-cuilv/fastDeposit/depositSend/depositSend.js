import { auth, checkPhone, autoTransformAddress } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY, CONFIG } from 'constants/index';
import api from 'utils/api';
const app = getApp();
Page({
    data: {
        title: 'depositSend',
        order: {},
        deposit_order_no: '',
        isLoading: true,
        address: {
            userName: '',
        }
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG) || {};
        const address = wx.getStorageSync(ADDRESS_KEY) || {};
        app.event.on('setOverseeAddressEvent', this.setOverseeAddressEvent, this);
        this.setData({
            config,
            address,
            deposit_order_no: params.no
        });
        this.loadOrder();
    },

    onUnload() {
        app.event.off('setOverseeAddressEvent', this);
    },

    // 加载订单详情
    async loadOrder() {
        const data = await api.hei.getDepositOrder({
            deposit_order_no: this.data.deposit_order_no
        });
        console.log('data', data);
        this.setData({
            order: data.data.product,
            isLoading: false
        });
    },

    // 修改地址
    async onAddress() {
        // 官方地址
        const res = await auth({
            scope: 'scope.address',
            ctx: this,
            isFatherControl: true
        });
        if (res) {
            const addressRes = await chooseAddress();
            this.setData({ address: addressRes });
            wx.setStorageSync(ADDRESS_KEY, addressRes);
        }
    },

    // 接收自填地址
    setOverseeAddressEvent(selfAddressObj) {
        this.setData({ address: selfAddressObj });
    },

    // 确定提交和表单验证
    submitForm() {
        let { userName, telNumber, detailInfo } = this.data.address;
        console.log('点击确定提交');
        let errorMsg = '';
        if (!userName) {
            errorMsg = '姓名不能为空';
        } else if (!telNumber) {
            errorMsg = '手机号码不能为空';
        } else if (!detailInfo) {
            errorMsg = '地址不能为空';
        } else {
            this.postForm();
        }
        if (errorMsg !== '') {
            wx.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 1000
            });
        }
    },

    // 数据转换和提交表单
    async postForm() {
        let { deposit_order_no, address } = this.data;
        // 微信地址字段转成后端地址字段
        address = autoTransformAddress(address);

        try {
            const data = await api.hei.postDepositDelivery({ deposit_order_no, ...address });
            wx.showToast({ title: '成功', icon: 'success' });
            wx.navigateBack();
        } catch (err) {
            wx.showToast({ title: err.errMsg, icon: 'none' });
        }
    }
});
