const app = getApp();

import { USER_KEY, CONFIG } from 'constants/index';
Component({
    properties: {
        item: {
            type: Object,
            value: {},
        },
        // 是否向父组件抛出事件让父组件自行处理
        eventHandlingWithOuter: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        config: {},
        tabbarPages: {}
    },
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },
    ready() {
        const userInfo = wx.getStorageSync(USER_KEY);
        const config = wx.getStorageSync(CONFIG);
        const { tabbarPages } = app.globalData;
        this.setData({
            tabbarPages,
            userInfo,
            config
        });
    },
    methods: {
        // 展示企业微信联系方式
        onCustomService(e) {
            const { config, eventHandlingWithOuter } = this.data;
            const { tips } = e.currentTarget.dataset;
            if (eventHandlingWithOuter) {
                this.triggerEvent('onCustomService', { tips });
                return;
            }


            if (config.contact && config.contact.type === 'work_weixin') {
                let customServiceModal = true;
                this.setData({
                    customServiceModal,
                });
            } else {
                this.setData({
                    contactModal: {
                        isFatherControl: false,
                        title: '温馨提示',
                        isShowModal: true,
                        body: tips,
                        type: 'button',
                        userInfo: this.data.userInfo,
                        buttonData: {
                            opentype: 'contact'
                        }
                    }
                });
            }
        },
        call(e) {
            const { phone } = e.currentTarget.dataset;
            wx.makePhoneCall({
                phoneNumber: phone
            });
        }
    }
});

