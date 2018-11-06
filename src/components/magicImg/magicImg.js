import { USER_KEY } from 'constants/index';
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
    attached() {
        const userInfo = wx.getStorageSync(USER_KEY);
        this.setData({
            userInfo
        });
    },
    methods: {
        onModal(e) {
            this.setData({
                contactModal: {
                    isFatherControl: false,
                    title: '温馨提示',
                    isShowModal: true,
                    body: e.currentTarget.dataset.tips,
                    type: 'button',
                    userInfo: this.data.userInfo,
                    buttonData: {
                        opentype: 'contact'
                    }
                }
            });
            console.log(this.data.contactModal);
        },
        miniFail(e) {
            console.log(e);
            const { errMsg } = e.detail;
            wx.showModal({
                title: '温馨提示',
                content: errMsg,
            });
        }
    }
});

