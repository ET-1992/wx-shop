import { USER_KEY, CONFIG } from 'constants/index';
import api from 'utils/api';
import { showToast, showModal, getSystemInfo } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { updateCart, parseScene, splitUserStatus, autoNavigate } from 'utils/util';
import { clearInterval } from 'timers';

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
        share_title: '',
        page_title: '',
        type: '',
        isProductBottom: false,
        isShowConsole: false,
        swiperCurrent: 0,
        hasSliders: false,

        size: 11,
        speed: 50,
        second: 0,
        guide_status: false // 添加到小程序指引是否消失
    },

    swiperChange(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },

    onBannerClick(ev) {
        const { path } = ev.currentTarget.dataset;
        if (path) {
            autoNavigate(path);
        }
    },
    async submitFormId(e) {
        const data = await api.hei.submitFormId({
            form_id: e.detail.formId,
        });
        console.log(data);
    },

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
        this.loadHomeExtra();
        this.setData({
            isLoading: true,
            isProductBottom: false
        });

        const data = await api.hei.fetchHome();
        console.log('home data:', data);
        const { current_user = {}, coupons = [], coupons_home = [], coupons_newbie = [] } = data;

        if (data.modules && data.modules.length) {
            for (let i = 0; i < data.modules.length; i++) {
                if (data.modules[i].key === 'sliders') {
                    this.setData({
                        hasSliders: true
                    });
                }
            }
        }

        /**
		*	target_user_type 1:所有人可领取, 2:新人专属
		*	status 2 可使用
        */

        if (data.page_title) {
            wx.setNavigationBarTitle({
                title: data.page_title,
            });
        }

        if (data.announcement) {
            let textLength = data.announcement.text.length * this.data.size;    // 文字长度
            let windowWidth = wx.getSystemInfoSync().windowWidth;   // 屏幕宽度
            let second = (windowWidth + textLength) / this.data.speed;
            this.setData({ second });
        }

        this.setData({
            userCoupon: coupons_home,
            isLoading: false,
            ...data
        }, this.addGuideSecond);

        let products = this.data.products;
        if (products && products[products.length - 1]) {
            let next_cursor = products[products.length - 1].timestamp;
            this.setData({
                next_cursor: next_cursor
            });
        } else {
            this.setData({
                next_cursor: 0
            });
        }
    },

    // 计时 当second为5时，指引消失
    addGuideSecond() {
        const isShowGuide = wx.getStorageSync('ISSHOWGUIDE');
        if (!isShowGuide) {
            this.setData({
                guide_status: true
            });
            setTimeout(() => {
                this.setData({
                    guide_status: false
                });
                wx.setStorageSync('ISSHOWGUIDE', true);
            }, 5000);
        }
    },

    async onLoad(options) {
        app.log(options, 'onLoad');

        const { themeColor, partner = {}} = app.globalData;
        this.loadHome();
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const userInfo = wx.getStorageSync(USER_KEY);
        this.setData({
            themeColor,
            isIphoneX,
            userInfo,
            logoObj: partner,
            globalData: app.globalData
        });
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
            config
        });
    },

    async onReceiveCoupon(id, index) {
        const { userCoupon } = this.data;
        console.log('第' + index + '个');
        console.log('qty:' + userCoupon[index].stock_qty);
        console.log(userCoupon[index]);
        if (!userCoupon[index].stock_qty) {
            return;
        }

        api.hei.receiveCoupon({
            coupon_id: id,
        });

        showToast({ title: '领取成功' });
        const updateData = {};
        const key = `userCoupon[${index}].status`;
        updateData[key] = 4;
        this.setData(updateData);
    },
    async receiveCouponAll(e) {
        const { id } = e.currentTarget.dataset;
        let result = [];
        id.map(({ id, target_user_type }, index) => {
            if (target_user_type === '2') result.push(id);
        });
        const allResult = result.join(',');
        await api.hei.receiveCouponAll({ coupon_ids: allResult, });
        showToast({ title: '领取成功' });
        this.setData({
            isNewUser: false
        });
    },
    async onCouponClick(ev) {
        const { id, index, status, title } = ev.currentTarget.dataset;
        if (Number(status) === 2) {
            await this.onReceiveCoupon(id, index);
        } else if (Number(status) === 4) {
            wx.navigateTo({
                url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
            });
        } else { return }
    },

    closeCoupon() {
        this.setData({
            isNewUser: false
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
        const { next_cursor, products, modules } = this.data;
        let hack = {};
        if (modules && modules.length && modules[modules.length - 1] && modules[modules.length - 1].args) {
            hack = parseScene(modules[modules.length - 1].args);
        }
        const data = await api.hei.fetchProductList({
            cursor: next_cursor,
            ...hack
        });
        this.data.isProductBottom = false;
        const newProducts = products.concat(data.products);
        this.setData({
            products: newProducts,
            next_cursor: data.next_cursor,
            last_coursor: this.data.next_cursor
        });
        console.log(this.data);
        return data;
    },

    /* 触底加载 */
    // async onReachBottom() {
    // 	let modules = this.data.modules;
    // 	if (modules[modules.length - 1].key === 'products') {
    // 		const { next_cursor } = this.data;
    // 		if (!next_cursor) {
    // 			console.log(next_cursor);
    // 			return;
    // 		}
    // 		this.loadProducts();
    // 		console.log('products在底部');
    // 	} else {
    // 		console.log('products不在底部');
    // 	}
    // },

    /* 无限加载 */
    async showProducts() {
        const { windowHeight } = app.systemInfo;
        const rect = await this.getDomRect('loadProducts');
        if (rect.top && (rect.top <= windowHeight - 30) && !this.data.isProductBottom) {
            const { next_cursor } = this.data;
            this.data.isProductBottom = true; // 判断是否触底并且执行了逻辑
            if (next_cursor !== 0) {
                this.loadProducts();
            }
        }
    },
    onPageScroll() {
        let modules = this.data.modules;
        if (modules && modules.length && modules[modules.length - 1].key === 'products') {
            this.showProducts();
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

    touchmove() {
        console.log('点击穿透阻止');
        return;
    }
});
