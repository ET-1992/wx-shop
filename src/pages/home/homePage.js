import api from 'utils/api';
import { USER_KEY, CONFIG } from 'constants/index';
import { showToast } from 'utils/wxp';
import { onDefaultShareAppMessage, onDefaultShareAppTimeline } from 'utils/pageShare';
import { updateTabbar, parseScene, splitUserStatus, autoNavigate, go, getUserProfile, autoNavigate_, subscribeMessage } from 'utils/util';

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
        isProductLast: false, // 判断新首页商品列表是否在最后
        isStoreFinish: false,  // 判断店铺多门店ID是否已获取
        showBgColor: false,
        selectedProduct: {},  // 加车商品
        subKeys: [{ key: 'coupon_expiring' }]
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
            try {
                const { coupons_home, coupons_newbie, current_user } = await api.hei.fetchShopExtra({
                    weapp_page: 'home'
                });
                const { subKeys } = this.data;
                await subscribeMessage(subKeys);
                /* 判断是否新人 */
                const { isUserGetRedPacket }  = splitUserStatus(current_user && current_user.user_status);

                this.setData({
                    isNewUser: !isUserGetRedPacket,
                    coupons_newbie,
                    userCoupon: coupons_home
                });
            } catch (e) {
                console.log(e);
            }
        }, 300);
    },

    async loadHome(e = {}) {
        const { id = '', isStoreFinish } = this.data;
        const { pageKey = '' } = this;
        // 默认展示加载条
        let { isLoading = true } = e;

        this.loadHomeExtra();
        this.setData({
            isLoading: isLoading,
            isProductBottom: false
        });

        // const data = await api.hei.fetchHome();
        const newHomeData = await api.hei.newHome({ id, key: pageKey });
        let { home_type = 'old', old_data = {}, modules = [], module_page = {}, share_image, share_title, page_title, config = {}} = newHomeData;

        let multiStoreEnable = Boolean(config.offline_store_enable);

        this.setData({
            multiStoreEnable
        });

        // 多门店模式，未获取门店ID
        if (multiStoreEnable && !isStoreFinish) {
            return;
        }


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
            if (modules[modules.length - 1].type === 'product' || modules[modules.length - 1].type === 'masonry-product') {
                const { content = [] } =  modules[modules.length - 1];
                // timestamp = (content[content.length - 1] && content[content.length - 1].timestamp) || 0;
                products = content;
            }
            const couponArray = modules.filter(item => {
                return item.type === 'coupon';
            });
            console.log('Home-couponArray', couponArray);
            app.globalData.couponBackgroundColor = (couponArray && couponArray[0] && couponArray[0].setting.color) || 'orange';

            console.log(module_page, 'odule_page');
            this.setData({
                products,
                module_page,
                modules,
                share_image,
                share_title,
                page_title,
                home_type,
                isLoading: false,
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
        console.log(systemInfo, 'systemInfo');
        const { statusBarHeight } = systemInfo;
        const userInfo = wx.getStorageSync(USER_KEY);
        this.setData({
            themeColor,
            isIphoneX,
            userInfo,
            tabbarPages,
            id,
            globalData: app.globalData,
            statusBarHeight,
        }, this.loadHome);
    },

    async onShow() {
        updateTabbar({ pageKey: this.pageKey });

        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        const { page_title } = this.data; // 兼容商品详情分享
        if (page_title) {
            wx.setNavigationBarTitle({
                title: page_title,
            });
        }
        this.setData({
            tplStyle,
            config,
            logoObj: config.partner
        });
    },
    // 领取优惠券
    async onReceiveCoupon(id, index) {
        const { userCoupon, subKeys } = this.data;
        console.log('第' + index + '个');
        console.log('qty:' + userCoupon[index].stock_qty);
        console.log(userCoupon[index]);
        if (!userCoupon[index].stock_qty) {
            return;
        }

        await api.hei.receiveCoupon({
            coupon_id: id,
        });
        await subscribeMessage(subKeys);
        showToast({ title: '领取成功' });
        const updateData = {};
        const key = `userCoupon[${index}].status`;
        updateData[key] = 4;
        this.setData(updateData);
    },

    // 用户授权才能领取
    async bindGetUserInfo(e) {
        await getUserProfile();
        this.onCouponClick(e);
    },

    async receiveNewUserCoupon(e) {

        await getUserProfile();
        this.receiveCouponAll(e);
    },

    // 一键领取新人优惠券
    async receiveCouponAll(e) {
        const { subKeys } = this.data;
        const { couponsNewbie = [] } = e.currentTarget.dataset;
        let result = [];
        couponsNewbie.map(({ id, target_user_type }, index) => {
            if (target_user_type === '2') result.push(id);
        });
        const allResult = result.join(',');
        await api.hei.receiveCouponAll({ coupon_ids: allResult, });
        await subscribeMessage(subKeys);
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
            productListPage: 1,
            productListTotalPages: 2
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
            productListTotalPages: data.total_pages === 0 ? 2 : data.total_pages // 防止后端传0回来
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
        if (rect && rect.top && (rect.top <= windowHeight - 30) && !this.data.isProductBottom) {
            this.data.isProductBottom = true; // 判断是否触底并且执行了逻辑
            const { productListTotalPages = 2, productListPage = 1 } = this.data;
            if (productListPage < productListTotalPages) {
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
    /* 提交表单 */
    async submitFormData(e) {
        const { form } = e.detail;
        console.log(form);
        const { module_page: { id }, modules } = this.data;
        const { content: { id: form_id }} = modules.find((module) => {
            return module.type === 'form';
        });
        const index = modules.findIndex((module) => {
            return module.type === 'form';
        });
        try {
            wx.showLoading();
            const { times, count, submission } = await api.hei.submitFormData({ source_data: id, data: form, source_type: 'module', form_id });
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: '提交成功',
                showCancel: false
            });
            this.setData({
                ['modules[' + index + '].content.times']: times,
                ['modules[' + index + '].content.count']: count,
                ['modules[' + index + '].content.fields']: submission.content
            });
        } catch (e) {
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false
            });
        }
    },
    onPageScroll(e) {
        const { home_type, showBgColor = false } = this.data;
        let { scrollTop } = e;
        if (scrollTop > 400 && !showBgColor) {
            this.setData({
                showBgColor: true
            });
        }

        if (scrollTop < 400 && showBgColor) {
            this.setData({
                showBgColor: false
            });
        }


        if (home_type === 'old') {
            let modules = this.data.modules;
            if (modules && modules.length && modules[modules.length - 1].key === 'products') {
                this.showProducts();
            }
        }

        if (home_type === 'new') {
            const { modules, module_page } = this.data;
            if ((modules[modules.length - 1].type === 'product' || modules[modules.length - 1].type === 'masonry-product') && module_page.infinite_loading) {
                this.showProducts();
            }
        }
    },

    // 分享按钮
    onShareAppMessage() {
        let { config: { tabbar: { list = [] }}} = this.data,
            redirectObj = '';
        const tabbarIndex = list.findIndex(item => item.pagePath === this.pageKey);
        if (tabbarIndex === -1) {
            // 自定义页面支持返回首页
            redirectObj = { key: '/pages/home/home' };
        }
        return onDefaultShareAppMessage.call(this, {}, '', redirectObj);
    },


    // 分享朋友圈按钮
    onShareTimeline() {
        return onDefaultShareAppTimeline.call(this);
    },

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
        const { config, userInfo } = this.data;
        const { tips } = e.detail.detail;

        if (config.contact && config.contact.type === 'work_weixin') {
            let customServiceModal = true;
            this.setData({
                customServiceModal,
            });
        } else {
            this.setData({
                contactModal: {
                    isFatherControl: false,
                    title: '温馨提示',
                    isShowModal: true,
                    body: tips,
                    type: 'button',
                    userInfo,
                    buttonData: {
                        opentype: 'contact'
                    }
                }
            });
        }
    },

    // 选择门店刷新页面
    async updatestore() {
        wx.showLoading({
            title: '加载中'
        });
        let globalData = app.globalData;
        this.setData({
            globalData,
            isStoreFinish: true
        });
        let obj = { isLoading: false };
        await this.loadHome(obj);
        wx.hideLoading();
    },

    go,

    // 商品加车
    onAddProductCart(e) {
        let { product } = e.detail;
        this.setData({
            selectedProduct: product,
            showOrderOptions: true,
        });
    },

    // 隐藏商品加车
    onHideOrderOptions() {
        this.setData({
            showOrderOptions: false
        });
    },
};