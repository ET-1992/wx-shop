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
    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({ user });
            console.log('this.data.user', this.data.user);
        },
        consoleOpen() {
            this.triggerEvent('consoleOpen', {}, { bubbles: true });
        },
        // 用户签到
        async tapSignIn() {
            const result = await api.hei.signIn(); // 签到
            this.setData({
                user: result.current_user
            });
            console.log('签到this.data.user', this.data.user);
            wx.showToast({
                title: '签到成功',
                icon: 'success'
            });
            wx.setStorageSync(USER_KEY, result.current_user);
        }
    }
});