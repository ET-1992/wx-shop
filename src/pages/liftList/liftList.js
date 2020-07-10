import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import { ADDRESS_KEY } from 'constants/index';
import proxy from 'utils/wxProxy';

const app = getApp();

Page({
    data: {
        isLoading: true,
        type: '',
        latitude: '',  // 待计算纬度
        longitude: '',  // 待计算经度
    },

    onLoad(params) {
        console.log(params.type);
        console.log(typeof (params.type));
        const { themeColor } = app.globalData;
        this.setData({
            type: params.type,
            themeColor,
            globalData: app.globalData
        });
    },

    async onShow() {
        this.getLocationData();
    },

    async getLocationData() {
        let { type } = this.data,
            apiData = {};
        const dictionary = {
            '2': '自提点',
            '4': '门店列表'
        };
        wx.setNavigationBarTitle({
            title: dictionary[type]
        });
        if (type === '2') {
            // 获取自提点列表
            await this.getWechatLocation();
            apiData = await api.hei.liftList();
        } else if (type === '4') {
            // 获取送货上门门店列表
            let { latitude, longitude } = wx.getStorageSync(ADDRESS_KEY);
            if (!latitude || !longitude) {
                let { confirm } = await proxy.showModal({
                    title: '温馨提示',
                    content: '请先选择有效的收件地址',
                    showCancel: false,
                });
                if (confirm) {
                    wx.navigateBack();
                    return;
                }
            }
            this.setData({ latitude, longitude, });
            apiData = await api.hei.orderHomeDelivery({ type: 'home_delivery' });
        }
        this.setData({ address_list: apiData.address_list, });
        this.computeDistance();
    },

    // 计算门店距离
    async computeDistance() {
        let { address_list, latitude, longitude } = this.data;
        address_list.forEach((item) => {
            let distance = getDistance(latitude, longitude, Number(item.latitude), Number(item.longtitude));
            item.distance = Number(distance).toFixed(2);
            item.isoutofrange = Number(item.distance) >= item.distance_limit;
        });

        address_list.sort((a, b) => {
            return Number(a.distance) - Number(b.distance);
        });

        this.setData({ address_list, isLoading: false, });
        console.log('address_list', address_list);
    },

    getLiftInfo(e) {
        const { address_list } = this.data;
        const { value } = e.detail;
        this.setTrueLiftItem(Number(value));
        const item = address_list[Number(value)] || {};
        const liftInfo = {
            receiver_address_phone: item.phone,
            receiver_state: item.state,
            receiver_city: item.city,
            receiver_district: item.district,
            receiver_address: item.address,
            receiver_address_name: item.name,
            distance: item.distance, // 距离
            time: item.time, // 营业时间
            remark: item.remark // 商家备注
        };
        app.event.emit('getLiftInfoEvent', liftInfo);
        wx.navigateBack({
            delta: 1
        });
    },

    setTrueLiftItem(index) {
        const { address_list } = this.data;
        address_list.forEach((item) => {
            item.checked = false;
        });
        address_list[index].checked = true;
        this.setData({
            address_list
        });
    },

    goOrderCreatePage(e) {
        const { index, name } = e.currentTarget.dataset;
        const { address_list: address } = this.data;
        console.log('index', index);
        const storeAddress = address.filter(item => {
            return item.name === name;
        });
        console.log(storeAddress);
        app.event.emit('getStoreInfoEvent', storeAddress);
        wx.navigateBack({
            delta: 1
        });
    },
    // 不允许点击的区域
    warnMessage() {
        wx.showToast({
            title: '该区域超出送货范围，不能选择！',
            icon: 'none',
        });
    },

    onAuthModalCancel() {
        wx.navigateBack({
            delta: 1
        });
    },
    onAuthModalConfirm() {
        this.setData({
            'authModal.isShowModal': false
        });
    },

    // 获取微信定位
    async getWechatLocation() {
        try {
            const res = await auth({
                scope: 'scope.userLocation',
                ctx: this,
                isFatherControl: true
            });
            if (!res) { return }
            const data = await proxy.getLocation();
            const { latitude, longitude } = data;

            this.setData({
                latitude,
                longitude,
            });
        } catch (e) {
            const { platform, locationAuthorized, locationEnabled } = wx.getSystemInfoSync();
            console.log(platform, 'platform');
            console.log(locationAuthorized, 'locationAuthorized');
            console.log(locationEnabled, 'locationEnabled');
            console.log(e);
            if (platform !== 'devtools' && (!locationEnabled || !locationAuthorized)) {
                const { confirm } = await proxy.showModal({
                    title: '温馨提示',
                    content: '请检查手机定位是否开启、是否允许微信使用手机定位',
                    showCancel: false
                });
                if (confirm) {
                    wx.navigateBack({
                        delta: 1
                    });
                }
            }
        }
    },
});
