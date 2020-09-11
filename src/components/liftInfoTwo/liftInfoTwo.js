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
        config: {}
    },
    async attached() {
        let config = wx.getStorageSync(CONFIG);
        if (!config) {
            let data = await api.hei.config();
            ({ config } = data);
        }
    },
    methods: {
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
        }
    }
});

