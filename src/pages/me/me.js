import api from 'utils/api';
import { getUserInfo, updateCart, getAgainUserForInvalid } from 'utils/util';
import { USER_KEY, CONFIG, PLATFFORM_ENV } from 'constants/index';
import { updateTabbar } from '../../utils/util';
const app = getApp();

Page({
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
        infoModalTime: 0,
        PLATFFORM_ENV,
    },

    async loadOrderCount() {
        const { current_user: user, config, wallet, affiliate, phone_number, about_us, shop_phone, order_counts, coupons, affiliate_enable, membership_banner } = await api.hei.myFare();
        const { themeColor, defineTypeGlobal } = this.data;

        const infosComponentData = {
            defineTypeGlobal,
            config,
            user,
            wallet,
            affiliate,
            phone_number,
            about_us,
            shop_phone,
            crowd_pay_enable: config.crowd_pay_enable
        };
        const ordersComponentData = {
            order_counts
        };
        const personalComponentData = {
            themeColor,
            user,
            wallet,
            coupons
        };
        const managerComponentData = {
            themeColor,
            user,
            phoneNumber: phone_number,
        };

        this.setData({
            affiliate_enable,
            affiliate,
            isLoading: false,
            infosComponentData,
            ordersComponentData,
            personalComponentData,
            managerComponentData,
            membership_banner: membership_banner || '',
            user,
            wallet,
            logoObj: config.partner,
            config
        });
    },

    onLoad() {
        // user用户客服对接
        const { themeColor, partner = {}, defineTypeGlobal, vip } = app.globalData;
        this.setData({ themeColor, isShowConsole: app.openConsole, logoObj: partner, defineTypeGlobal, vip });
    },

    async onShow() {
        updateTabbar({ pageKey: 'me' });

        this.loadOrderCount();
    },

    onLogin() {
        wx.navigateTo({ url: '/pages/login/login' });
    },

    getDeviceInfo() {
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

    consoleOpen() {
        this.data.consoleTime++;
        setTimeout(() => {
            this.data.consoleTime = 0;
        }, 1000);

        if (this.data.consoleTime >= 5) {
            wx.setEnableDebug({
                enableDebug: true
            });
            this.onLoad();
        }
    },

    // 签到改变花生米字段
    changeWalletData(e) {
        this.setData({ wallet: e.detail });
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            if (user) {
                this.toMembersPage();
            }
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    toMembersPage() {
        wx.navigateTo({
            url: '/pages/membership/members/members'
        });
    }
});
