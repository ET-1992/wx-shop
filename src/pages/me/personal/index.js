import { getUserProfile, getUserInfo } from 'utils/util';
import { USER_KEY, CONFIG, USER_INFO_CREATE_TIME } from 'constants/index';
import api from 'utils/api';
const app = getApp();

Component({
    properties: {
        personalComponentData: {
            type: Object,
            value: {},
        },
    },
    observers: {
        'personalComponentData': function(personData) {
            if (!personData) { return }
            let { themeColor, user, wallet, coupons, background_color } = personData,
                config = wx.getStorageSync(CONFIG),
                createTime = wx.getStorageSync(USER_INFO_CREATE_TIME),
                updateAvatar = false;
            const twoDay = 60 * 60 * 24 * 1000 * 2;
            // 此处config.active_time等待后端开发
            let activeTime = config.active_time || twoDay,
                currentTime = Date.now();

            // 提示用户主动获取头像信息
            if (createTime && (currentTime - createTime > activeTime)) {
                updateAvatar = true;
            }
            // 重置主题色
            if (background_color) {
                themeColor.primaryColor = background_color;
            }
            // 获取右上角胶囊距离顶部的高度
            let statusBarHeight = wx.getSystemInfoSync()['statusBarHeight'];
            this.setData({
                config,
                themeColor,
                user,
                wallet,
                coupons,
                updateAvatar,
                background_color,
                statusBarHeight
            });
        }
    },
    methods: {
        // 点击用户头像的鉴权
        async bindGetUserInfo() {
            let time = Date.now();
            wx.setStorageSync(USER_INFO_CREATE_TIME, time);

            const user = await getUserProfile();
            this.setData({ user, updateAvatar: false });
            this.consoleOpen();
        },
        // 跳转会员页的鉴权
        async getUserBeforeToMember() {
            const user = await getUserProfile();
            if (user) {
                this.toMembersPage();
            }
        },
        consoleOpen() {
            this.triggerEvent('consoleOpen', {}, { bubbles: true });
        },
        // 跳转到会员中心
        toMembersPage() {
            wx.navigateTo({
                url: '/pages/membership/members/members'
            });
        },
        // 用户签到
        async tapSignIn() {
            const { user } = this.data;
            if (user.is_checkined) {
                return;
            }
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
        },
        // 展示企业微信联系方式
        onCustomService() {
            let customServiceModal = true;
            this.setData({
                customServiceModal,
            });
        }
    }
});