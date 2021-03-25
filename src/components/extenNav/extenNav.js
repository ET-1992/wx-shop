const app = getApp();

import { USER_KEY } from 'constants/index';
Component({
    properties: {
        item: {
            type: Object,
            value: {},
        },
        config: {
            type: Object,
            value: {}
        }
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    attached() {
        const userInfo = wx.getStorageSync(USER_KEY);
        const { tabbarPages } = app.globalData;
        this.setData({
            tabbarPages,
            userInfo
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

