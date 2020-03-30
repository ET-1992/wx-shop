import api from 'utils/api';
import { USER_KEY, CONFIG } from 'constants/index';
import { showToast } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { updateCart, parseScene, splitUserStatus, autoNavigate, go, getAgainUserForInvalid } from 'utils/util';

// 获取应用实例
const app = getApp(); // eslint-disable-line no-undef

Page({
    data: {
        pageName: 'home',
        products: [],
        product_categories: [],
        home_sliders: {
            home_sliders: [],
        },
        miaoshas: [],
        groupons: [],
        featured_products: [],
        coupons: [],
        coupons_home: [],
        coupons_newbie: [],
        hasNewUserCoupons: false,

        isRefresh: false,
        isLoading: false,

        post_type_title: '',
        taxonomy_title: '',
        page_title: '',
        type: '',
        isProductBottom: false,
        isShowConsole: false,
        swiperCurrent: 0,
        hasSliders: false,

        size: 11,
        speed: 50,
        second: 0,
        guide_status: false, // 添加到小程序指引是否显示
        isProductLast: false // 判断新首页商品列表是否在最后
    },

    async submitFormId(e) {
        const data = await api.hei.submitFormId({
            form_id: e.detail.formId,
        });
        console.log(data);
    },
    // 新用户优惠券 coupons_newbie
    async loadHomeExtra() {
        setTimeout(async () => {
            const { coupons_home, coupons_newbie, current_user } = await api.hei.fetchShopExtra({
                weapp_page: 'home'
            });

            /* 判断是否新人 */
            const { isUserGetRedPacket }  = splitUserStatus(current_user && current_user.user_status);
            console.log(isUserGetRedPacket, 'i');

            this.setData({
                isNewUser: !isUserGetRedPacket,
                coupons_newbie,
                userCoupon: coupons_home
            });
        }, 300);
    },

    async loadHome() {
        const { id } = this.data;
        this.loadHomeExtra();
        this.setData({
            isLoading: true,
            isProductBottom: false
        });

        // const data = await api.hei.fetchHome();
        const { home_type = 'old', old_data = {}, modules = [], module_page = {}, share_image, share_title, page_title } = await api.hei.newHome({ id });


        if (page_title) {
            wx.setNavigationBarTitle({
                title: page_title,
            });
        }
        app.globalData.couponBackgroundColor = '';

        if (home_type === 'new') {
            let timestamp = 0;
            let { products } = this.data;
            if (modules[modules.length - 1].type === 'product') {
                const { content = [] } =  modules[modules.length - 1];
                timestamp = content[content.length - 1].timestamp;
                products = content;
            }
            const couponArray = modules.filter(item => {
                return item.type === 'coupon';
            });
            console.log('Home-couponArray', couponArray);
            app.globalData.couponBackgroundColor = couponArray && couponArray[0] && couponArray[0].setting.color;
            this.setData({
                products,
                module_page,
                modules,
                share_image,
                share_title,
                page_title,
                home_type,
                isLoading: false,
                next_cursor: timestamp
            });
        }
    },


    async onLoad({ id }) {
        console.log('onLoad');
        const { themeColor, partner = {}} = app.globalData;
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const userInfo = wx.getStorageSync(USER_KEY);
        this.setData({
            themeColor,
            isIphoneX,
            userInfo,
            globalData: app.globalData,
            id
        }, this.loadHome);
    },

    async onShow() {
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        const { categoryIndex } = app.globalData;
        if (categoryIndex !== -1) {
            updateCart(categoryIndex);
        }
        this.setData({
            tplStyle,
            config,
            logoObj: config.partner
        });
    },

    async onPullDownRefresh() {
        this.setData({
            isRefresh: true,
            next_cursor: 0,
            hasSliders: false
        });
        await this.loadHome();
        wx.stopPullDownRefresh();
    },

    async loadProducts() {
        const { next_cursor, products, modules, home_type } = this.data;
        let hack = {};
        let module_id = '';
        if (modules && modules.length && modules[modules.length - 1] && modules[modules.length - 1].args && home_type === 'old') {
            hack = parseScene(modules[modules.length - 1].args);
        }
        if (home_type === 'new') {
            module_id = modules[modules.length - 1].id;
        }

        const data = await api.hei.fetchProductList({
            cursor: next_cursor,
            module_id,
            ...hack
        });
        const newProducts = products.concat(data.products);
        this.setData({
            products: newProducts,
            next_cursor: data.next_cursor,
            last_coursor: this.data.next_cursor
        }, () => {
            this.data.isProductBottom = false;
        });
        console.log(this.data);
        return data;
    },

    /* 无限加载 */
    async showProducts() {
        const { windowHeight } = app.systemInfo;
        const rect = await this.getDomRect('loadProducts');
        if (rect.top && (rect.top <= windowHeight - 30) && !this.data.isProductBottom) {
            this.data.isProductBottom = true; // 判断是否触底并且执行了逻辑
            const { next_cursor } = this.data;
            if (next_cursor) {
                this.loadProducts();
            }
        }
    },

    onPageScroll() {
        const { home_type } = this.data;
        if (home_type === 'old') {
            let modules = this.data.modules;
            if (modules && modules.length && modules[modules.length - 1].key === 'products') {
                this.showProducts();
            }
        }

        if (home_type === 'new') {
            const { modules } = this.data;
            if (modules[modules.length - 1].type === 'product' && modules[modules.length - 1].setting.orderby === 'post_date') {
                this.showProducts();
            }
        }
    },

    onShareAppMessage: onDefaultShareAppMessage,

    reLoad() {
        this.loadHome();
    },

    getDomRect(id) {
        return new Promise((resolve, reject) => {
            wx.createSelectorQuery().select(`#${id}`).boundingClientRect((rect) => {
                resolve(rect);
            }).exec();
        });
    },

    onModal(e) {
        console.log('e218', e);
        this.setData({
            contactModal: {
                isFatherControl: false,
                title: '温馨提示',
                isShowModal: true,
                body: e.currentTarget.dataset.tips,
                type: 'button',
                userInfo: this.data.userInfo,
                buttonData: {
                    opentype: 'contact'
                }
            }
        });
        console.log(this.data.contactModal);
    },

    //  新首页 快捷导航 与 幻灯片 客服对话框显示
    showContactModal(e) {
        console.log('e218', e);
        this.setData({
            contactModal: {
                isFatherControl: false,
                title: '温馨提示',
                isShowModal: true,
                body: e.detail.currentTarget.dataset.tips,
                type: 'button',
                userInfo: this.data.userInfo,
                buttonData: {
                    opentype: 'contact'
                }
            }
        });
        console.log(this.data.contactModal);
    },

    go
});
