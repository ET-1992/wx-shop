import wxProxy from 'utils/wxProxy';
import api from 'utils/api';
import { USER_KEY, TOKEN_KEY, EXPIRED_KEY, CURRENCY, CONFIG } from 'constants/index';
import Event from 'utils/event';
import { parseScene } from 'utils/util';

App({
    onLaunch() {
        wx.onError((e) => {
            console.log(e, 'onError');
        });
        const { windowWidth, windowHeight, pixelRatio, screenWidth, model = '' } = wx.getSystemInfoSync();
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
        // vip已去掉  styleType  templateType partner authorizer走config
        let { primaryColor, secondaryColor, categoryIndex = -1, partner = {}, styleType = 'default', templateType = 'default', vip = {}, authorizer, currency = 'CNY', backgroundColor } = extConfig;

        const templateTypeTest = ['magua'];
        if (templateTypeTest.indexOf(templateType) < 0) {
            templateType = 'default';
        }
        const styleTypeTest = ['vip_tpl_two', 'vip_tpl_three', 'vip_tpl_four', 'vip_tpl_five', 'vip_tpl_six'];
        if (styleTypeTest.indexOf(styleType) < 0) {
            styleType = 'default';
        }

        this.globalData = Object.assign(this.globalData, {
            themeColor: { primaryColor, secondaryColor, backgroundColor },
            categoryIndex,
            partner: partner,
            tplStyle: styleType,
            defineTypeGlobal: templateType,
            vip,
            authorizer,
            currency,
            CURRENCY
        });

        this.vip = vip;

        this.logData = [];
        this.openConsole = false;
        this.openConsoleResData = false;
    },

    onHide() {
        this.logData = [];
        this.openConsole = false;
        this.openConsoleResData = false;
        this.updateConfig();
    },

    async silentLogin() {
        const { code } = await wxProxy.login();
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

    async recordAffiliate(afcode) {
        setTimeout(() => {
            api.hei.recordAffiliateBrowse({ code: afcode });
        });
    },

    updateConfig() {
        setTimeout(() => {
            api.hei.config().then((res) => {
                this.checkWebLogin(res);
                console.log(res, 'appConfig');
                const { config, current_user } = res;
                if (!config.affiliate_bind_after_order && this.globalData.afcode) {
                    this.bindShare(this.globalData.afcode);
                }
                wx.setStorageSync(CONFIG, config);
                wx.setStorageSync(USER_KEY, current_user || '');
            });
        }, 500);
    },

    checkWebLogin(configRes) {
        const { config, current_user } = configRes;
        if (config.web_enable && current_user && !current_user.platform_user_id) {
            wx.navigateTo({
                url: '/pages/bindWeb/bindWeb',
            });
        }
    },

    async onShow(options) {
        this.logData = [];
        this.openConsole = false;
        this.openConsoleResData = false;
        console.log(options, 'options');
        this.logData.push(options);

        this.updateConfig();

        // this.login();

        const { query = {}} = options;
        if (query.vendor) {
            this.globalData.vendor = query.vendor;
        }
        if (options.referrerInfo) {
            this.globalData.extraData = options.referrerInfo.extraData;
        }

        if (query.afcode) {
            this.globalData.afcode = query.afcode;
            this.recordAffiliate(query.afcode);
        }

        if (query.scene) {
            let scene = decodeURIComponent(query.scene);
            let query_ = parseScene(scene);
            if (query_.afcode) {
                this.globalData.afcode = query_.afcode;
                this.recordAffiliate(query_.afcode);
            }
        }
        // this.updateConfig();

        try {
            await wxProxy.checkSession();
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

    consoleShowRes: false,

    openConsoleResData: false
});
