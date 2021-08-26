import { USER_KEY, CONFIG } from 'constants/index';

const app = getApp();

Component({
    properties: {
        isMarginTopZero: {
            type: Boolean,
            value: false,
        },
        magicImgData: {
            type: Object,
            value: {},
            observer(newValue) {
                if (newValue.layout === '2-2') {
                    newValue.flex = [2, 1];
                }
                if (newValue.layout === '2-3') {
                    newValue.flex = [1, 2];
                }
                if (newValue.layout.charAt(newValue.layout.length - 1) === '1' || newValue.layout === '2-2' || newValue.layout === '2-3') {
                    newValue.defineType = 'oneLine';
                    newValue.eachNum = Number(newValue.layout.charAt(0));
                }
                this.setData({
                    magicImgData: newValue,
                });
            },

        },
        tplStyle: {
            type: String,
            value: 'default',
        }
    },
    ready() {
        const { tabbarPages } = app.globalData;
        const userInfo = wx.getStorageSync(USER_KEY);
        const config = wx.getStorageSync(CONFIG);

        console.log(config, 99);
        this.setData({
            userInfo,
            tabbarPages,
            config
        });
    },
    methods: {
        onModal(e) {
            const { config, userInfo } = this.data;
            const { tips } = e.currentTarget.dataset;

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
                        userInfo,
                        buttonData: {
                            opentype: 'contact'
                        }
                    }
                });
            }
        },
        miniFail(e) {
            console.log(e);
            // const { errMsg } = e.detail;
            // wx.showModal({
            //     title: '温馨提示',
            //     content: errMsg,
            // });
        },
        call(e) {
            const { phone } = e.currentTarget.dataset;
            wx.makePhoneCall({
                phoneNumber: phone
            });

        }
    }
});

