const app = getApp();
import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import { CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';

Component({
    properties: {
        title: {
            type: String,
            value: 'liftInfoTwo Component',
        },
        liftInfo: {
            type: Object,
            value: {},
            observer(newValue) {
                console.log('newValue', newValue);
                if (newValue) {
                    newValue.receiver_name = wx.getStorageSync('receiver_name') || '';
                    newValue.receiver_phone = wx.getStorageSync('receiver_phone') || '';
                    this.setData({ liftInfo: newValue });
                }
            }
        },
        homeDeliveryTimes: {
            type: Array,
            value: []
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        }
    },
    data: {
        latitude: '',  // 待计算纬度
        longitude: '',  // 待计算经度
        liftInfo: {},
        config: {}
    },
    async attached() {
        let config = wx.getStorageSync(CONFIG);
        if (!config) {
            let data = await api.hei.config();
            ({ config } = data);
        }

        const { isOrderDetail, liftInfo } = this.data;
        if (!isOrderDetail || !config.offline_store_enable) {
            this.initLiftData();
        }

        this.setData({ config, liftInfo });
        console.log('this.data.liftInfo', this.data.liftInfo);
    },
    methods: {
        async initLiftData() {
            await this.getWechatLocation();
            const { latitude, longitude } = this.data;
            const { address_list } = await api.hei.liftList();
            let item = address_list && address_list[0];
            let distance = getDistance(latitude, longitude, Number(item.latitude), Number(item.longtitude));
            item.distance = Number(distance).toFixed(2);
            const liftInfo = {
                isCanInput: true,
                isCanNav: true,
                receiver_address_phone: item.phone,
                receiver_state: item.state,
                receiver_city: item.city,
                receiver_district: item.district,
                receiver_address: item.address,
                receiver_address_name: item.name,
                receiver_name: wx.getStorageSync('receiver_name') || '',
                receiver_phone: wx.getStorageSync('receiver_phone') || '',
                distance: item.distance, // 距离
                time: item.time, // 营业时间
                remark: item.remark // 商家备注
            };

            this.setData({ liftInfo });
            this.triggerEvent('updateLiftInfo', { ...liftInfo }, { bubbles: true });
        },
        updateLiftInfoName(e) {
            const { value } = e.detail;
            console.log(value);
            wx.setStorageSync('receiver_name', value);
            this.triggerEvent('updateLiftInfo', { receiver_name: value }, { bubbles: true });
        },
        updateLiftInfoPhone(e) {
            const { value } = e.detail;
            wx.setStorageSync('receiver_phone', value);
            this.triggerEvent('updateLiftInfo', { receiver_phone: value }, { bubbles: true });
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

                this.setData({ latitude, longitude });
            } catch (e) {
                console.log(e);
                const { platform, locationAuthorized, locationEnabled } = wx.getSystemInfoSync();
                if (platform !== 'devtools' && (!locationEnabled || !locationAuthorized)) {
                    const { confirm } = await proxy.showModal({
                        title: '温馨提示',
                        content: '请检查手机定位是否开启、是否允许微信使用手机定位',
                        showCancel: false
                    });
                }
            }
        },
    }
});

