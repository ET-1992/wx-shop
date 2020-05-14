import api from 'utils/api';
import { USER_KEY, CONFIG } from 'constants/index';
import { showToast } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { updateCart, parseScene, splitUserStatus, autoNavigate, go, getAgainUserForInvalid, autoNavigate_ } from 'utils/util';

// 获取应用实例
const app = getApp();

export const pageObj = {
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
        isShowButton: true, // 是否显示抢购、秒杀按钮
        isProductLast: false // 判断新首页商品列表是否在最后
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
        const { id = '' } = this.data;
        const { page_type = '' } = this;

        this.loadHomeExtra();
        this.setData({
            isLoading: true,
            isProductBottom: false
        });

        // const data = await api.hei.fetchHome();
        const { home_type = 'old', old_data = {}, modules = [], module_page = {}, share_image, share_title, page_title, config } = await api.hei.newHome({ id, key: page_type });


        if (page_title) {
            wx.setNavigationBarTitle({
                title: page_title,
            });
        }

        if (home_type === 'old') {
            const data = old_data;
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

            if (data.announcement) {
                let textLength = data.announcement.text.length * this.data.size;    // 文字长度
                let windowWidth = wx.getSystemInfoSync().windowWidth;   // 屏幕宽度
                let second = (windowWidth + textLength) / this.data.speed;
                this.setData({ second });
            }

            app.globalData.couponBackgroundColor = '';
            this.setData({
                userCoupon: coupons_home,
                home_type,
                isLoading: false,
                ...data
            }, this.addGuideSecond);
        }

        if (home_type === 'new') {
            // let timestamp = 0;
            let { products } = this.data;
            if (modules[modules.length - 1].type === 'product') {
                const { content = [] } =  modules[modules.length - 1];
                // timestamp = (content[content.length - 1] && content[content.length - 1].timestamp) || 0;
                products = content;
            }
            const couponArray = modules.filter(item => {
                return item.type === 'coupon';
            });
            console.log('Home-couponArray', couponArray);
            app.globalData.couponBackgroundColor = (couponArray && couponArray[0] && couponArray[0].setting.color) || 'orange';
            this.setData({
                products,
                module_page,
                modules,
                share_image,
                share_title,
                page_title,
                home_type,
                isLoading: false,
                // next_cursor: timestamp,
                config
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

    async onLoad({ goPath, id = '' }) {
        console.log(goPath, 'onLoad');

        if (goPath) {
            autoNavigate_({
                url: decodeURIComponent(goPath)
            });
        }
        const { themeColor, partner = {}, tabbarPages } = app.globalData;
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const userInfo = wx.getStorageSync(USER_KEY);
        this.setData({
            themeColor,
            isIphoneX,
            userInfo,
            tabbarPages,
            id,
            globalData: app.globalData
        }, this.loadHome);
    },

    async onShow() {
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        const { categoryIndex } = app.globalData;
        const { page_title } = this.data; // 兼容商品详情分享

        if (page_title) {
            wx.setNavigationBarTitle({
                title: page_title,
            });
        }

        if (categoryIndex !== -1) {
            updateCart(categoryIndex);
        }
        this.setData({
            tplStyle,
            config,
            logoObj: config.partner
        });
    },
    // 领取优惠券
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

    // 用户授权才能领取
    async bindGetUserInfo(e) {
        const { isNewUser } = this.data;
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            await getAgainUserForInvalid({ encryptedData, iv });
            if (isNewUser) {
                this.receiveCouponAll(e);
                return;
            }
            this.onCouponClick(e);
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    // 一键领取新人优惠券
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

    // 旧首页 优惠券点击跳转
    async onCouponClick(ev) {
        console.log('ev268', ev);
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
            // isRefresh: true,
            // next_cursor: 0,
            hasSliders: false,
            productListPage: 1
        });
        await this.loadHome();
        wx.stopPullDownRefresh();
    },

    async loadProducts() {
        let { products, modules, home_type, productListPage = 1 } = this.data;
        let hack = {};
        let module_id = '';
        if (modules && modules.length && modules[modules.length - 1] && modules[modules.length - 1].args && home_type === 'old') {
            hack = parseScene(modules[modules.length - 1].args);
        }
        if (home_type === 'new') {
            module_id = modules[modules.length - 1].id;
        }

        productListPage++;

        const data = await api.hei.fetchProductList({
            paged: productListPage,
            module_id,
            ...hack
        });

        const newProducts = products.concat(data.products);
        this.setData({
            productListPage,
            products: newProducts,
            productListTotalPages: data.total_pages
        }, () => {
            this.data.isProductBottom = false;
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
            this.data.isProductBottom = true; // 判断是否触底并且执行了逻辑
            const { productListTotalPages = 2, productListPage = 1 } = this.data;
            if (productListPage <= productListTotalPages) {
                this.loadProducts();
            } else {
                wx.showToast({
                    title: '到底了',
                    icon: 'none',
                    duration: 1500,
                    mask: false
                });

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
            const { modules, module_page } = this.data;
            if (modules[modules.length - 1].type === 'product' && module_page.infinite_loading) {
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

    touchmove() {
        console.log('点击穿透阻止');
        return;
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

    go,

    page_type: 'home'
};