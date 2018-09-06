import { login as wxLogin, checkSession } from 'utils/wxp';
import api from 'utils/api';
import getToken from 'utils/getToken';
import { USER_KEY, TOKEN_KEY, EXPIRED_KEY } from 'constants/index';
import Event from 'utils/event';
import { parseScene } from 'utils/util';

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
        console.log(extConfig, 'extConfig');
        let { primaryColor, secondaryColor, categoryIndex = 2, partner = {}, styleType = 'default', templateType = 'default' } = extConfig;

        const templateTypeTest  = ['magua'];
        if (templateTypeTest.indexOf(templateType) === -1) {
            templateType = 'default';
        }
        const styleTypeTest = ['vip_tpl_two', 'vip_tpl_three', 'vip_tpl_four'];
        if (styleTypeTest.indexOf(templateType) === -1) {
            styleType = 'default';
        }

        this.globalData = Object.assign(this.globalData, {
            themeColor: { primaryColor, secondaryColor },
            categoryIndex: { categoryIndex },
            partner: partner,
            tplStyle: styleType,
            defineTypeGlobal: templateType
        });

        this.logData = [];
        this.openConsole = false;
        this.openConsoleResData = false;
    },

    onHide() {
        this.logData = [];
        this.openConsole = false;
        this.openConsoleResData = false;
    },

    async silentLogin() {
        const { code } = await wxLogin();
        const { user, access_token, expired_in } = await api.hei.silentLogin({ code });
        const expiredTime = expired_in * 1000 + Date.now();
        wx.setStorageSync(USER_KEY, user);
        wx.setStorageSync(TOKEN_KEY, access_token);
        wx.setStorageSync(EXPIRED_KEY, expiredTime);
    },

    async bindShare(afcode) {
        setTimeout(() => {
            api.hei.bindShare({ code: afcode }).then((res) => {
                console.log(res);
            });
        }, 500);
    },

    async onShow(options) {
        this.logData = [];
        this.openConsole = false;
        this.openConsoleResData = false;
        console.log(options, 'options');
        this.logData.push(options);

        const { query = {}} = options;
        if (query.vendor) {
            this.globalData.vendor = query.vendor;
        }
        if (options.referrerInfo) {
            this.globalData.extraData = options.referrerInfo.extraData;
        }

        if (query.afcode) {
            this.globalData.afcode = query.afcode;
            this.bindShare(query.afcode);
        }

        if (query.scene) {
            let scene = decodeURIComponent(query.scene);
            let query_ = parseScene(scene);
            if (query_.afcode) {
                this.globalData.afcode = query.afcode;
                this.bindShare(query_.afcode);
            }
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

    consoleShowRes: false,

    openConsoleResData: false
});
