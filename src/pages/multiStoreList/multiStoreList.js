import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import proxy from 'utils/wxProxy';

const app = getApp();

Page({
    data: {
        title: 'multiStoreList',
        isLoading: true,
        latitude: '', // 纬度
        longitude: '', // 经度
        locationStr: '获取位置失败',  // 位置名字
        addressStr: '请选择您的收获地址',  // 收获地址名字
        addressObj: {},  // 地址全部数据
        originStoreList: [],  // 原始门店列表
        storeList: [],  // 门店列表
    },

    onLoad() {
        app.event.on('setAddressListEvent', this.setAddressListEvent, this);
    },

    onShow() {
        this.gitInitList();
    },

    onUnload() {
        app.event.off('setAddressListEvent', this);
    },

    // 首次获取列表
    async gitInitList() {
        let { latitude, longitude } = this.data;
        if (!latitude || !longitude) {
            this.getStoreList();
            await this.getLocationData();
            this.getSortList();
            this.parseLocation();
        }
    },

    // 重新定位
    async onClickLocation() {
        await this.getLocationData();
        await this.getlocationAgain();
        this.getSortList();
    },

    // 重新获取定位信息
    async getlocationAgain() {
        let { latitude, longitude } = this.data;
        let data = await proxy.chooseLocation({
            latitude,
            longitude,
        });
        let { address, name, latitude: newLatitude, longitude: newLongitude } = data;
        this.setData({
            locationStr: address + name,
            latitude: newLatitude,
            longitude: newLongitude,
        });
    },

    // 管理收获地址
    onClickAddress() {
        wx.navigateTo({
            url: '/pages/addressList/addressList'
        });
    },

    // 获取授权地址
    async getLocationData() {
        try {
            const res = await auth({
                scope: 'scope.userLocation',
                ctx: this,
                isFatherControl: true
            });
            if (res) {
                const data = await proxy.getLocation();
                console.log(data, 'data');
                let { latitude, longitude } = data;
                this.setData({
                    latitude,
                    longitude,
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

    // 获取门店列表
    async getStoreList() {
        let { stores } = await api.hei.getMultiStoreList();
        this.setData({
            originStoreList: stores,
        });
    },

    // 获取排序后的门店列表
    getSortList() {
        this.setData({ isLoading: true });
        let list = this.computeDistance();
        this.setData({
            storeList: list,
            isLoading: false,
        });
    },

    // 计算距离获取地址列表
    computeDistance() {
        let { originStoreList } = this.data;
        let { latitude, longitude } = this.data;
        originStoreList.forEach((item) => {
            let distance = getDistance(latitude, longitude, Number(item.latitude), Number(item.longtitude));
            item.distance = Number(distance).toFixed(2);
            item.isoutofrange = Number(item.distance) >= item.distance_limit;
        });

        originStoreList.sort((a, b) => {
            return Number(a.distance) - Number(b.distance);
        });

        return originStoreList;
    },

    // 接收收货地址
    async setAddressListEvent(address) {
        console.log('从地址列表返回的地址', address);
        let { provinceName = '', cityName = '', countyName = '', detailInfo = '', latitude, longtitude: longitude } = address;
        let arr = [provinceName, cityName, countyName, detailInfo];
        let addressStr = arr.join('');
        this.setData({
            addressStr,
            addressObj: address,
        });
        if (!latitude || !longitude) {
            await this.parseAddress();
        } else {
            this.setData({
                longitude,
                latitude,
            });
        }
        this.getSortList();
    },

    // 选择门店
    onSeleteStore(e) {
        let { storeList } = this.data;
        let { index } = e.currentTarget.dataset;
        let store = storeList[index];
        app.globalData.currentStore = store;
        app.event.emit('setMultiStoreEvent', store);
        wx.navigateBack();
    },

    // 微信经纬度定位解析
    async parseLocation() {
        let { latitude, longitude } = this.data;
        let data = {
            key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            location: `${latitude},${longitude}`
        };
        let url = 'https://apis.map.qq.com/ws/geocoder/v1';
        try {
            let res = await proxy.request({
                url,
                data,
            });
            console.log('逆解析结果：', res);
            if (res.data && res.data.status === 0) {
                this.setData({
                    locationStr: res.data.result.address
                });
            }
        } catch (error) {
            console.log('逆解析错误', error);
        }
    },

    // 地址解析经纬度
    async parseAddress() {
        let { addressObj, addressStr } = this.data;
        let data = {
            key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            address: addressStr,
            region: addressObj.cityName,
        };
        let url = 'https://apis.map.qq.com/ws/geocoder/v1';
        try {
            let res = await proxy.request({
                url,
                data,
            });
            console.log('收获地址解析结果：', res);
            if (res.data && res.data.status === 0) {
                let { lat, lng } = res.data.result.location;
                this.setData({
                    latitude: lat,
                    longitude: lng,
                });
            }
        } catch (error) {
            console.log('地址解析错误', error);
        }

    },

    // 授权取消
    onAuthModalCancel() {
        wx.navigateBack({
            delta: 1
        });
    },

    // 授权确认
    onAuthModalConfirm() {
        this.setData({
            'authModal.isShowModal': false
        });
    }

});
