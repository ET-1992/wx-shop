import api from 'utils/api';
import { updateCart, go } from 'utils/util';
import { USER_KEY, CONFIG } from 'constants/index';
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
        infoModalTime: 0
    },

    async loadOrderCount() {
        const data = await api.hei.myFare();
        const { themeColor, defineTypeGlobal, vip, user, config, cart_no } = this.data;

        const infosComponentData = {
            defineTypeGlobal,
            config,
            user,
            wallet: data.wallet,
            affiliate: data.affiliate,
            phone_number: data.phone_number,
            about_us: data.about_us,
            shop_phone: data.shop_phone,
            crowd_pay_enable: config.crowd_pay_enable,
            share_image: data.share_image,
            share_title: data.share_title
        };
        const ordersComponentData = {
            order_counts: data.order_counts,
            cart_no
        };
        const personalComponentData = {
            themeColor,
            user,
            wallet: data.wallet,
            coupons: data.coupons
        };
        const managerComponentData = {
            themeColor,
            user,
            phoneNumber: data.phone_number,
        };

        this.setData({
            affiliate_enable: data.affiliate_enable,
            affiliate: data.affiliate,
            isLoading: false,
            infosComponentData,
            ordersComponentData,
            personalComponentData,
            managerComponentData,
            membership_banner: data.membership_banner || ''
        });
    },

    onLoad() {
        // user用户客服对接
        const { themeColor, partner = {}, defineTypeGlobal, vip } = app.globalData;
        this.setData({ themeColor, isShowConsole: app.openConsole, defineTypeGlobal, vip });
        wx.hideShareMenu();
    },

    async onShow() {
        const config = wx.getStorageSync(CONFIG);
        const CART_NUM  = wx.getStorageSync('CART_NUM');
        const user = wx.getStorageSync(USER_KEY);
        this.setData({
            user,
            config,
            logoObj: config.partner,
            cart_no: Number(CART_NUM)
        });
        this.loadOrderCount();

        updateTabbar({ pageKey: 'me' });
    },

    onLogin() {
        wx.navigateTo({ url: '/pages/login/login' });
    },

    go,     // 跳转

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

    onShareAppMessage(e) {
        console.log(e);
        const { shareMethods, shareTitle, shareImage } = e.target.dataset;
        if (shareMethods === 'componentShare') {
            return {
                title: shareTitle,
                path: '/pages/home/home',
                imageUrl: shareImage
            };
        }
    }
});
