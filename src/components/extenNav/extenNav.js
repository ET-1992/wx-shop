const app = getApp();

import { USER_KEY, CONFIG } from 'constants/index';
Component({
    properties: {
        item: {
            type: Object,
            value: {},
        }
    },
    data: {
        config: {},
        tabbarPages: {}
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    ready() {
        const userInfo = wx.getStorageSync(USER_KEY);
        const config = wx.getStorageSync(CONFIG);
        // console.log(config, 'configconfigconfigconfigconfigconfig');
        const { tabbarPages } = app.globalData;
        this.setData({
            tabbarPages,
            userInfo,
            config
        });
    },
    methods: {
        // 展示企业微信联系方式
        onCustomService() {
            let customServiceModal = true;
            this.setData({
                customServiceModal,
            });
        },

        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        }
    }
});

