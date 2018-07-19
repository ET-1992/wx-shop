import { USER_KEY } from 'constants/index';
Component({
    properties: {
        userInfo: {
            type: Object,
            value: {},
        },
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
                const userInfo = wx.getStorageSync(USER_KEY);
                this.setData({
                    magicImgData: newValue,
                    userInfo
                });
                console.log(this.data.userInfo);
                console.log(this.data.magicImgData);
            }
        }
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
                    buttonData: {
                        opentype: 'contact'
                    }
                }
            });
            console.log(this.data.contactModal);
        },
    }
});

