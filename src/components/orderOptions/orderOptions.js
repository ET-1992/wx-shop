import { createCurrentOrder } from 'utils/pageShare';
import { CONFIG } from 'constants/index';
import api from 'utils/api';
import behaviorSku from 'utils/behavior/behaviorSku';

const app = getApp();

Component({
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },
    behaviors: [behaviorSku],
    properties: {
        quantity: {
            type: Number,
            value: 1,
        },
        customBottom: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        themeColor: {},
        selectedString: '',
        selectedPrice: 0,
    },
    observers: {
    },
    lifetimes: {
        async attached() {
            let { themeColor } = app.globalData;
            let config = wx.getStorageSync(CONFIG);
            if (!config) {
                let data = await api.hei.config();
                ({ config } = data);
            }
            this.setData({ config, themeColor });
        },
    },

    methods: {
    },
});
