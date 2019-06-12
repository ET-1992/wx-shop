import { getAgainUserForInvalid } from 'utils/util';
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
            this.setData({
                user
            });
            console.log(this.data.user);
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
            wx.showToast({
                title: '签到成功',
                icon: 'success'
            });
        },
    }
});