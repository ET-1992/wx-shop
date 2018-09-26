import api from 'utils/api';
import { getUserInfo, getAgainUserForInvalid, updateCart, auth  } from 'utils/util';
import { chooseAddress, getSetting, authorize, showToast, showModal } from 'utils/wxp';
import { ADDRESS_KEY, USER_KEY } from 'constants/index';
const app = getApp();

// 创建页面实例对象
Page({

    // 页面的初始数据
    data: {
        user: {},
        orderCount: {
            1: 0,
            2: 0,
            3: 0,
            10: 0,
        },
        consoleTime: 0,
        isLoading: true,
        isShowConsole: false,
        infoModalTime: 0
    },

    async loadOrderCount() {

        const data = await api.hei.myFare();

        this.setData({
            ...data,
            isLoading: false
        });

        console.log(this.data);
    },

    onLoad() {
        app.log('页面onLoad');
        // user用户客服对接
        const { themeColor, partner = {}, defineTypeGlobal, vip } = app.globalData;
        this.setData({ themeColor, isShowConsole: app.openConsole, logoObj: partner, defineTypeGlobal, vip });
    },

    async onShow() {
        app.log('页面onShow');

        const user = getUserInfo();
        this.setData({ user });
        this.loadOrderCount();

        const { categoryIndex } = app.globalData;
        updateCart(categoryIndex.categoryIndex);
    },

    onLogin() {
        wx.navigateTo({ url: '/pages/login/login' });
    },

    async onAddress() {
        const res = await auth({
            scope: 'scope.address',
            ctx: this
        });
        if (res) {
            const addressRes = await chooseAddress();
            wx.setStorageSync(ADDRESS_KEY, addressRes);
        }
    },

    async bindGetUserInfo(e) {
        console.log('90');
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        this.setData({
            isAuthUser: user
        });
    },

    consoleOpen() {
        this.data.consoleTime++;
        console.log(this.data.consoleTime);
        setTimeout(() => {
            this.data.consoleTime = 0;
        }, 1000);

        if (this.data.consoleTime >= 7) {
            console.log('six six six');
            app.openConsole = true;
            app.event.emit('showConsole');
            this.onLoad();
        }

        if (app.openConsole) {
            this.data.openConsoleResDataTime++;
            setTimeout(() => {
                this.data.openConsoleResDataTime = 0;
            }, 1000);
            if (this.data.openConsoleResDataTime >= 3) {
                console.log('openConsoleResData');
                app.openConsoleResData = true;
            }
        }
    },

    getDeviceInfo() {
        console.log('9');
        this.data.infoModalTime++;
        setTimeout(() => {
            this.data.infoModalTime = 0;
        }, 1000);
        if (this.data.infoModalTime >= 2) {
            const { brand, model, version, system, platform, SDKVersion, benchmarkLevel }  = wx.getSystemInfoSync();
            const { appid, openid } = wx.getStorageSync(USER_KEY);
            this.setData({
                infoModal: {
                    title: '设备信息', // 弹窗标题
                    body: `Appid：${appid} \n\n 手机品牌：${brand} \n\n 手机型号：${model}  \n\n 微信版本：${version} \n\n 操作版本：${system} \n\n 基础库版本：${SDKVersion} \n\n 设备性能：${benchmarkLevel}  \n\n Openid: ${openid} `, // 弹窗身体
                    isShowCanel: false, // 是否有取消按钮
                    type: 'button', // 按钮 button 或者 跳转 navigator
                    navigateData: {}, // type = navigator 时生效
                    buttonData: {}, // type = button 时生效
                    confirmText: '一键复制',
                    isShowModal: true, // 控制弹窗展示
                    isFatherControl: true, // 是否由父组件控制
                    bodyStyle: 'text-align: left'
                }
            });
        }
    },

    onInfoConfirm() {
        wx.setClipboardData({
            data: this.data.infoModal.body || '',
            success: (res) => {
                wx.showToast({
                    title: '复制成功！',
                    icon: 'success',
                    duration: 2400
                });
            }
        });
        this.setData({
            infoModal: {
                isShowModal: false
            }
        });
    },

    showToast() {
        showToast({
            title: '审核中',
            icon: 'none'
        });
    },

    redirectToShareCenter() {
        const user = getUserInfo();
        if (user) {
            wx.navigateTo({ url: '/pages/affiliate/affiliateCenter/affiliateCenter' });
        }
    },

    /* 我的管家 */
    async openManager() {
        const address  = wx.getStorageSync('address');
        if (!address) {
            const res = await auth({
                scope: 'scope.address',
                ctx: this
            });
            if (res) {
                const addressRes = await chooseAddress();
                wx.setStorageSync(ADDRESS_KEY, addressRes);
            }
        } else {
            this.setData({
                openManager: true
            });
        }
    }
});
