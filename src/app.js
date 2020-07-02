import wxProxy from 'utils/wxProxy';
import api from 'utils/api';
import { USER_KEY, TOKEN_KEY, EXPIRED_KEY, CURRENCY, CONFIG } from 'constants/index';
import Event from 'utils/event';
import { parseScene } from 'utils/util';

App({
    onLaunch() {

        this.updateApp();

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
        console.log(extConfig, 'extConfig');
        // vip已去掉  styleType  templateType partner authorizer走config
        let {
            primaryColor = '#729153',
            secondaryColor = '#B1CA50',
            categoryIndex = -1,
            partner = {},
            styleType = 'default',
            templateType = 'default',
            vip = {},
            authorizer,
            currency = 'CNY',
            backgroundColor,
            tabbarPages = {}
        } = extConfig;
        console.log('extConfig2', extConfig);

        const templateTypeTest = ['magua'];
        if (templateTypeTest.indexOf(templateType) < 0) {
            templateType = 'default';
        }
        const styleTypeTest = ['vip_tpl_two', 'vip_tpl_three', 'vip_tpl_four', 'vip_tpl_five', 'vip_tpl_six'];
        if (styleTypeTest.indexOf(styleType) < 0) {
            styleType = 'default';
        }

        let storeObj = {
            currentStore: {},  // 当前门店
            storeList: [],  // 门店列表
        };

        this.globalData = Object.assign(this.globalData, {
            themeColor: { primaryColor, secondaryColor, backgroundColor },
            categoryIndex,
            partner: partner,
            tplStyle: styleType,
            defineTypeGlobal: templateType,
            vip,
            authorizer,
            currency,
            currency_sign: '￥',
            CURRENCY,
            tabbarPages,
            ...storeObj,
        });

        this.vip = vip;
    },

    onHide() {
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
            console.log('afcode触发bindShare');
            api.hei.bindShare({ code: afcode }).then((res) => {
                console.log(res);
            });
        }, 500);
    },

    // 获取多门店列表
    async updateStoreList() {
        setTimeout(() => {
            console.log('APPJS更新STORELIST');
            api.hei.getMultiStoreList().then((res) => {
                let list = [];
                if (res && res.stores && res.stores.length) {
                    list = res.stores;
                }
                this.globalData.storeList = list;
            });
        }, 0);
    },

    async bindWebConfirm(config) {
        if (!(config.web && config.web.confirm)) {
            setTimeout(() => {
                console.log('触发confirm');
                api.hei.bindWebConfirm().then((res) => {
                    console.log(res);
                });
            }, 500);
        }
    },

    async recordAffiliate(afcode) {
        setTimeout(() => {
            console.log('afcode触发recordAffiliateBrowse');
            api.hei.recordAffiliateBrowse({ code: afcode });
        });
    },

    updateConfig() {
        setTimeout(() => {
            api.hei.config().then((res) => {
                console.log(res, 'appConfig');
                const { config, current_user } = res;

                if (!config.affiliate_bind_after_order && this.globalData.afcode) {
                    this.bindShare(this.globalData.afcode);
                }
                if (config.offline_store_enable) {
                    this.updateStoreList();
                }
                this.bindWebConfirm(config);
                wx.setStorageSync(CONFIG, config);
                wx.setStorageSync(USER_KEY, current_user || '');
                // wx.showTabBar();
            });
        }, 500);
    },

    checkBind() {
        setTimeout(async () => {
            await api.hei.checkUserBind();
        }, 500);
    },

    async onShow(options) {
        console.log(options, 'options');
        // this.checkBind();
        this.updateConfig();

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

        if (query.storeId) {
            // 重置当前门店
            let currentStore = {
                id: query.storeId,
            };
            this.globalData.currentStore = currentStore;
        }

        try {
            await wxProxy.checkSession();
        }
        catch (err) {
            await this.silentLogin();
        }
    },

    onError(err) {
        console.error('[APP ERROR]', err);
    },

    // 启动时应用更新版本
    updateApp() {
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log('hasUpdate', res.hasUpdate);
        });

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，重启后立刻应用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            });
        });

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            console.log('新版本下载失败');
        });
    },

    globalData: {
        vendor: '',
        currentOrder: {
            items: [],
        },
        orderDetail: {
            items: []
        },
        bindWebApiWhite: [
            'api/mag.shop.extra.json',
            'api/module/page.json',
            'api/mag.product.list.json',
            'api/mag.product.get.json',
            'api/mag.article.get.json',
            'api/mag.article.list.json',
            'api/mag.affiliate.bind.json',
            'api/mag.affiliate.browse.record.json'
        ]
    },

    systemInfo: {},

    event: new Event()
});
