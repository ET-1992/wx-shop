import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import proxy from 'utils/wxProxy';

const app = getApp();

Component({
    properties: {
        storeName: {
            type: String,
            value: '',
        },
    },
    data: {
        latitude: '', // 纬度
        longitude: '', // 经度
        originStoreList: [],  // 原始门店列表
        storeList: [],  // 门店列表
    },
    lifetimes: {
        attached: function () {
            this.updateStore();
        },
    },
    methods: {
        // 切换门店
        onChangeStore(e) {
            wx.navigateTo({
                url: '/pages/multiStoreList/multiStoreList'
            });
        },

        // 更新最新门店
        async updateStore() {
            let { storeName } = this.data;
            if (storeName) { return }
            let newStoreName = '获取门店失败';
            let currentStore = app.globalData.currentStore;
            if (currentStore.name) {
                newStoreName = currentStore.name;
            } else {
                // 主动接口更新
                let res = await this.getCurrentStore();
                if (res && res.name) {
                    newStoreName = res.name;
                    app.globalData.currentStore = res;
                }
            }
            this.setData({
                storeName: newStoreName,
            });
        },

        // 获取最近门店
        async getCurrentStore() {
            let { currentStore } = app.globalData;
            let store = {};
            // APP_GLOBAL获取当前门店
            if (currentStore.name) {
                store = currentStore;
            } else {
                await this.getStoreList();
                let { storeList = [] } = this.data;
                store = storeList[0] || {};
            }
            return store;
        },

        // 获取排序后的门店列表
        async getStoreList() {
            let { storeList } = app.globalData;
            let originStoreList = [];
            // APP_GLOBAL获取门店列表
            if (storeList && storeList.length) {
                originStoreList = storeList;
            } else {
                // 接口获取门店列表
                let { stores = [] } = await api.hei.getMultiStoreList();
                originStoreList = stores;
            }
            this.setData({
                originStoreList,
            });
            await this.getLocationData();
            this.computeDistance();
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

        // 计算距离获取地址
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
            console.log('storeList', originStoreList);
            this.setData({
                storeList: originStoreList,
            });
        },

        // 授权取消
        onAuthModalCancel() {
            console.log('取消授权');
            this.setData({
                'authModal.isShowModal': false
            });
        },

        // 授权确认
        onAuthModalConfirm() {
            this.setData({
                'authModal.isShowModal': false
            });
        }
    },

});

