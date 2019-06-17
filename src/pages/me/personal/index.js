import { getAgainUserForInvalid, getUserInfo } from 'utils/util';
import { CONFIG } from 'constants/index';
const app = getApp();
import api from 'utils/api';
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
        },

        async onShow() {
            app.log('页面onShow');
            const config = wx.getStorageSync(CONFIG);
            const user = getUserInfo();
            this.setData({ user, config });
            console.log('页面onShow this.data.user:', this.data.user);
        }
    }
});