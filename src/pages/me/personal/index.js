import { getAgainUserForInvalid, getUserInfo } from 'utils/util';
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
        },
        themeColor: {
            type: Object,
            value: {}
        }
    },
    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({ user });
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