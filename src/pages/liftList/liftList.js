import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import proxy from 'utils/wxProxy';

const app = getApp();

Page({
    data: {
        isLoading: true,
        type: ''
    },

    onLoad(params) {
        console.log(params.type);
        console.log(typeof (params.type));
        this.setData({ type: params.type });
    },

    async onShow() {
        const { platform, locationAuthorized, locationEnabled } = wx.getSystemInfoSync();
        console.log(platform, 'platform');
        console.log(locationAuthorized, 'locationAuthorized');
        console.log(locationEnabled, 'locationEnabled');
        if (platform !== 'devtools' && !locationEnabled) {
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '请打开手机地理位置开关',
                showCancel: false
            });
            if (confirm) {
                wx.navigateBack({
                    delta: 1
                });
            }
            return;
        }
        this.getLocationData(this.data.type);
    },

    async getLocationData(type) {
        const res = await auth({
            scope: 'scope.userLocation',
            ctx: this
        });
        if (res) {
            const data = await proxy.getLocation();
            console.log(data, 'data');
            const { latitude, longitude } = data;
            try {
                if (type === '2') {
                    const { address_list } = await api.hei.liftList();
                    this.computeDistance(address_list, latitude, longitude);
                } else if (type === '4') {
                    wx.setNavigationBarTitle({
                        title: '门店列表'
                    });
                    const { address_list } = await api.hei.orderHomeDelivery({ type: 'home_delivery' });
                    this.computeDistance(address_list, latitude, longitude);
                }

                this.setData({
                    isLoading: false
                });
            } catch (e) {
                console.log(e);
            }
        }
    },

    async computeDistance(address_list, latitude, longitude) {
        address_list.forEach((item) => {
            let distance = getDistance(latitude, longitude, Number(item.latitude), Number(item.longtitude));
            item.distance = Number(distance).toFixed(2);
            item.isoutofrange = Number(item.distance) >= item.distance_limit;
        });

        address_list.sort((a, b) => {
            return Number(a.distance) - Number(b.distance);
        });

        this.setData({ address_list });
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
            time: item.time // 营业时间
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
    }
});
