
import api from 'utils/api';
import { go, auth, autoTransformAddress } from 'utils/util';
import { chooseAddress } from 'utils/wxp';

Page({
    data: {
        title: 'coinRecordDetail',
        activity: {},  // 商品信息
        codes: [],  // 幸运码数组
        address: {},  // 收货地址
        haveAddress: false,  // 是否填写地址
        isLoading: true,
    },

    onLoad(params) {
        console.log(params);
        let { id } = params;
        this.setData({ id });
        this.getDetailData();
    },

    go,

    // 获取详情信息
    async getDetailData() {
        let { id } = this.data;
        const data = await api.hei.fetchDrawPersonOrder({ id });
        let { activity, codes, is_win, receiver } = data;
        console.log('receiver', receiver);
        let newAddress = autoTransformAddress(receiver);
        this.setData({
            activity,
            isWinner: is_win,
            address: newAddress,
            codes,
            isLoading: false,
        });
        await this.checkHaveAddress();
    },

    // 填写地址
    async onAddress() {
        const res = await auth({
            scope: 'scope.address',
            ctx: this,
            isFatherControl: true
        });
        if (!res) { return }
        try {
            const addressRes = await chooseAddress();
            this.setData({ address: addressRes });
        } catch (e) {
            console.log('e', e);
        }
        this.checkHaveAddress();
    },

    // 检查是否填写地址
    checkHaveAddress() {
        let { activity: { status }, address } = this.data;
        let haveAddress = false;
        if (status === 5 || (address && address.userName)) {
            haveAddress = true;
        }
        this.setData({ haveAddress });
    },

    // 请求上传地址
    async commitAddress() {
        let { address, activity, haveAddress } = this.data;
        let newAddress = autoTransformAddress(address);
        try {
            if (!haveAddress) {
                throw new Error('请先填写地址');
            }
            const data = await api.hei.postDrawAddress({
                activity_id: activity.id,
                ...newAddress,
            });
            wx.showToast({
                title: '成功提交地址',
                icon: 'success',
                duration: 2000
            });
            this.getDetailData();
        } catch (e) {
            console.log('e', e);
            wx.showModal({
                title: '温馨提示',
                content: e.message || e.errMsg,
                showCancel: false,
            });
        }
    },
});
