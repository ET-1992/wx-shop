import { go, getUserProfile, getUserInfo } from 'utils/util';
import { USER_KEY, CONFIG } from 'constants/index';
import api from 'utils/api';
const app = getApp();

Component({
    properties: {
        personalComponentData: {
            type: Object,
            value: {},
            observer(newValue) {
                console.log('newValue', newValue);
                this.setData({
                    ...newValue
                });
            }
        },
        config: {
            type: Object,
            value: {}
        }
    },
    lifetimes: {
        attached() {
            let data = wx.getMenuButtonBoundingClientRect();
            let { bottom } = data;
            this.setData({ menuBottom: bottom });
        },
    },
    methods: {

        go,

        async bindGetUserInfo() {
            const user = await getUserProfile();
            this.setData({ user });
            this.consoleOpen();
        },
        consoleOpen() {
            this.triggerEvent('consoleOpen', {}, { bubbles: true });
        },
        // 用户签到
        async tapSignIn() {
            const result = await api.hei.signIn(); // 签到
            const wallet = result.current_user.wallet;
            this.setData({ user: result.current_user });
            wx.showToast({
                title: '签到成功',
                icon: 'success'
            });
            wx.setStorageSync(USER_KEY, result.current_user);
            this.setData({ wallet });
            this.triggerEvent('changeWalletData', wallet, { bubbles: true });
        }
    }
});