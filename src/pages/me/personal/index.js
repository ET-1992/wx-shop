import { getAgainUserForInvalid, getUserInfo } from 'utils/util';
import { USER_KEY, CONFIG, USER_INFO_CREATE_TIME } from 'constants/index';
import api from 'utils/api';
const app = getApp();

Component({
    properties: {
        personalComponentData: {
            type: Object,
            value: {},
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
    observers: {
        'personalComponentData': function(personData) {
            if (!personData) { return }
            let config = wx.getStorageSync(CONFIG),
                createTime = wx.getStorageSync(USER_INFO_CREATE_TIME),
                updateAvatar = false;
            const twoDay = 60 * 60 * 24 * 1000 * 2;
            // 此处config.active_time等待后端开发
            let activeTime = config.active_time || twoDay,
                currentTime = Date.now();
            let { themeColor, user, wallet, coupons } = personData;
            // 提示用户主动获取头像信息
            if (createTime && (currentTime - createTime > activeTime)) {
                updateAvatar = true;
            }
            this.setData({
                themeColor,
                user,
                wallet,
                coupons,
                updateAvatar,
            });
        }
    },
    methods: {
        async bindGetUserInfo(e) {
            let time = Date.now();
            wx.setStorageSync(USER_INFO_CREATE_TIME, time);
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({ user, updateAvatar: false });
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