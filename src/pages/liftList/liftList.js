import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import proxy from 'utils/wxProxy';

const app = getApp();
const QQMapWX = require('qqmap-wx-jssdk');
let qqmapsdk = new QQMapWX({
    key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H'
});

Page({
    data: {
        isLoading: true,
        type: '',
        target_latitude: 0,  // 收货地址维度
        target_longitude: 0 // 收货地址经度
    },

    onLoad(params) {
        console.log(params.type);
        console.log(typeof (params.type));
        const { themeColor } = app.globalData;
        const user_address = wx.getStorageSync('address');
        this.setData({
            type: params.type,
            themeColor,
            globalData: app.globalData,
            user_address
        });
    },

    async onShow() {
        this.getLocationData(this.data.type);
    },

    async getLocationData(type) {
        try {
            const res = await auth({
                scope: 'scope.userLocation',
                ctx: this,
                isFatherControl: true
            });
            if (res) {
                const data = await proxy.getLocation();
                console.log(data, 'data');
                const { latitude, longitude } = data;
                if (type === '2') {
                    const { address_list } = await api.hei.liftList();
                    this.computeDistance(address_list, latitude, longitude);
                } else if (type === '4') {
                    wx.setNavigationBarTitle({ title: '门店列表' });
                    const { address_list } = await api.hei.orderHomeDelivery({ type: 'home_delivery' });
                    this.setData({ address_list }, () => {
                        this.computeGeocoder();
                    });
                }

                this.setData({
                    isLoading: false
                });
            }
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
                return;
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

    computeGeocoder() {
        const { user_address } = this.data;
        const addressDetail = `${user_address.provinceName}${user_address.cityName}${user_address.countyName}${user_address.detailInfo}`;
        console.log('addressDetail', addressDetail);
        let _this = this;
        qqmapsdk.geocoder({
            // 获取表单传入地址
            address: addressDetail, // 地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
            success(res) {
                console.log('res', res);
                const { lat: latitude, lng: longitude } = res.result.location;
                // 根据地址解析在地图上标记解析地址位置
                _this.setData({
                    target_latitude: latitude,
                    target_longitude: longitude
                }, () => {
                    console.log('target_latitude', _this.data.target_latitude, 'target_longitude', _this.data.target_longitude);
                    _this.computeDistance(_this.data.address_list, _this.data.target_latitude, _this.data.target_longitude);
                });
            },
            fail(err) {
                console.log('err', err);
            }
        });
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
    }
});
