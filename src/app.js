import { login as wxLogin, checkSession } from 'utils/wxp';
import api from 'utils/api';
import getToken from 'utils/getToken';
import { USER_KEY, TOKEN_KEY, EXPIRED_KEY } from 'constants/index';
import Event from 'utils/event';

App({
    onLaunch() {
        const { windowWidth, windowHeight, pixelRatio, screenWidth, model } = wx.getSystemInfoSync();
        this.systemInfo = {
            windowWidth,
            windowHeight,
            ratio: pixelRatio,
            screenWidth,
            isIphoneX: model.indexOf('iPhone X') >= 0,
            isIphone5: model.indexOf('iPhone 5') >= 0
        };

        const extConfig = wx.getExtConfigSync() || {};
        // const extConfig = { primaryColor: 'red', secondaryColor: 'blue', categoryIndex: 2 };
        const { primaryColor, secondaryColor, categoryIndex = 2 } = extConfig;
        this.globalData.themeColor = { primaryColor, secondaryColor };
        this.globalData.categoryIndex = { categoryIndex };
        this.logData = [];
        this.openConsole = false;
    },

    onHide() {
        this.logData = [];
        this.openConsole = false;
    },

    async silentLogin() {
        const { code } = await wxLogin();
        const { user, access_token, expired_in } = await api.hei.silentLogin({ code });
        const expiredTime = expired_in * 1000 + Date.now();
        wx.setStorageSync(USER_KEY, user);
        wx.setStorageSync(TOKEN_KEY, access_token);
        wx.setStorageSync(EXPIRED_KEY, expiredTime);
    },

    async onShow(options) {
        this.logData = [];
        this.openConsole = false;

        const { query = {}} = options;
        if (query.vendor) {
            this.globalData.vendor = query.vendor;
        }
        if (options.referrerInfo) {
            this.globalData.extraData = options.referrerInfo.extraData;
        }

        try {
            const token = getToken();
            if (!token) {
                throw new Error('token invalid');
            }
            await checkSession();
        }
        catch (err) {
            await this.silentLogin();
        }
    },

    onError(err) {
        console.error('[APP ERROR]', err);
        this.logData.push(err);
    },

    globalData: {
        vendor: '',
        currentOrder: {
            items: [],
        },
        orderDetail: {
            items: []
        },
    },

    systemInfo: {},

    event: new Event(),

    log(data) {
        if (this.openConsole) {
            this.logData.push(data);
            this.event.emit('log');
        }
    },

    logData: [],

    openConsole: false,

    consoleShowRes: false
});
