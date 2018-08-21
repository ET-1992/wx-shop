import { USER_KEY } from 'constants/index';
import api from 'utils/api';
import { showToast, showModal, getSystemInfo } from 'utils/wxp';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import getToken from 'utils/getToken';
import autoRedirect from 'utils/autoRedirect';
import { updateCart } from 'utils/util';

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
        hasMask: false,
        isShowConsole: false,
        swiperCurrent: 0,

        /* marqueePace: 1, // 滚动速度
        marqueeDistance: 0, // 初始滚动距离
        orientation: 'left', // 滚动方向
        interval: 20 // 时间间隔 */

        size: 22,
        speed: 50,
    },

    swiperChange(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },

    onBannerClick(ev) {
        const { path } = ev.currentTarget.dataset;
        const type = 'navigate';
        if ((path, type)) {
            autoRedirect({ url: path, type: type });
        }
    },
    async submitFormId(e) {
        const data = await api.hei.submitFormId({
            form_id: e.detail.formId,
        });
        console.log(data);
    },

    async loadHome() {

        this.setData({
            isLoading: true,
            hasMask: false,
            isProductBottom: false
        });

        const data = await api.hei.fetchHome();
        // console.log('home data:', data);
        const { current_user = {}, coupons = [], coupons_home = [], coupons_newbie = [] } = data;

        if (data.modules) {
            for (let i = 0; i < data.modules.length; i++) {
                if (data.modules[i].key === 'sliders') {
                    this.setData({
                        hasSliders: true
                    });
                }
            }
        }
        // if (current_user) {
        // 	this.setData({
        // 		newUser: current_user.new_user,
        // 	});
        // }
        // else {
        // 	this.setData({
        // 		newUser: 1,
        // 	});
        // }

        /**
		*	target_user_type 1:所有人可领取, 2:新人专属
		*	status 2 可使用
        */

        // const newUserCouponIndex = coupons.findIndex(({ status, target_user_type, stock_qty }) => target_user_type === '2' && status === 2 && stock_qty !== 0);
        // const userCoupon = coupons.filter(({ status, target_user_type, stock_qty }) => target_user_type !== '2');

        const newUserCouponIndex = coupons_newbie.findIndex(({ status, target_user_type, stock_qty }) => target_user_type === '2' && status === 2 && stock_qty !== 0);
        const userCoupon = coupons_home.filter(({ status, target_user_type, stock_qty }) => target_user_type !== '2');

        const hasNewUserCoupons = newUserCouponIndex >= 0;

        if (data.page_title) {
            wx.setNavigationBarTitle({
                title: data.page_title,
            });
        }
        let width;
        if (userCoupon && userCoupon.length) {
            width = userCoupon.length * 250 + 20 * userCoupon.length;
        }

        // delete data.coupons;

        // const { shop_setting: { category_style, product_list_style } } = data;
        // data.productListStyle = PRODUCT_LIST_STYLE[+product_list_style - 1];
        // data.categoryListStyle = CATEGORY_LIST_STYLE[+category_style - 1];
        // const newUser = data.current_user ? data.current_user.new_user : null;

        let textLength = data.announcement.text.length * this.data.size; // 文字长度
        let second = textLength / this.data.speed;
        console.log(second);
        console.log(textLength);

        this.setData({
            userCoupon,
            isLoading: false,
            conWidth: width || '',
            hasNewUserCoupons,
            newUser: current_user ? current_user.new_user : 1,
            ...data,
            second
        });
        console.log(this.data);
        if (this.data.newUser === 1 && this.data.hasNewUserCoupons) {
            this.setData({
                hasMask: true
            });
        }

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

        /* // 滚动公告
        let that = this;
        let length = that.data.announcement.text.length * that.data.size;// 文字长度
        let windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
        that.setData({
            length: length,
            windowWidth: windowWidth
        });
        that.run(); */
    },

    async onLoad(options) {
        app.log(options, 'onLoad');

        const { themeColor, tplStyle } = app.globalData;
        this.loadHome();
        const systemInfo = wx.getSystemInfoSync();
        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const userInfo = wx.getStorageSync(USER_KEY);
        this.setData({
            themeColor,
            isIphoneX,
            userInfo,
            tplStyle
        });
    },

    async onShow() {
        app.log('onShow');

        this.setData({ isShowConsole: app.openConsole });

        const { categoryIndex } = app.globalData;
        updateCart(categoryIndex.categoryIndex);
    },

    async onReceiveCoupon(id, index) {
        const { userCoupon } = this.data;
        console.log('第' + index + '个');
        console.log('qty:' + userCoupon[index].stock_qty);
        console.log(userCoupon[index]);
        if (!userCoupon[index].stock_qty) {
            return;
        }
        try {
            const data = await api.hei.receiveCoupon({
                coupon_id: id,
            });
            const { errcode } = data;
            if (!errcode) {
                showToast({ title: '领取成功' });
                const updateData = {};
                const key = `userCoupon[${index}].status`;
                updateData[key] = 4;
                this.setData(updateData);
                await this.loadHome();
            }
        }
        catch (err) {
            await showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },
    async receiveCouponAll(e) {
        const token = getToken();

        // if (!token) {
        // 	const { confirm } = await showModal({
        // 		title: '未登录',
        // 		content: '请先登录，再领取优惠券',
        // 		confirmText: '登录',
        // 	});
        // 	if (confirm) {
        // 		// await login();
        // 		wx.navigateTo({ url: '/pages/login/login' });
        // 	}
        // 	return;
        // }

        const { id } = e.currentTarget.dataset;
        let result = [];
        id.map(({ id, target_user_type }, index) => {
            if (target_user_type === '2') result.push(id);
        });
        const allResult = result.join(',');
        const data = await api.hei.receiveCouponAll({
            coupon_ids: allResult,
        });
        showToast({ title: '领取成功' });
        this.setData({
            newUser: 2,
            hasMask: false
        });
    },
    async onCouponClick(ev) {
        const { id, index, status, title } = ev.currentTarget.dataset;
        // const token = getToken();

        // if (!token) {
        // 	const { confirm } = await showModal({
        // 		title: '未登录',
        // 		content: '请先登录，再领取优惠券',
        // 		confirmText: '登录',
        // 	});
        // 	if (confirm) {
        // 		// await login();
        // 		wx.navigateTo({ url: '/pages/login/login' });
        // 	}
        // 	return;
        // }

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
            newUser: 2,
            hasMask: false
        });
    },
    async onPullDownRefresh() {
        this.setData({
            isRefresh: true,
            next_cursor: 0,
        });
        await this.loadHome();
        wx.stopPullDownRefresh();
    },

    // async needAuth(e) {
    // 	const user = await login();
    // 	console.log(user);
    // 	this.setData({
    // 		user: user,
    // 	});
    // },

    async loadProducts() {
        const { next_cursor, products } = this.data;
        const data = await api.hei.fetchProductList({
            cursor: next_cursor,
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
        if (modules[modules.length - 1].key === 'products') {
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

    /* run() {
        let that = this;
        let interval = setInterval(function () {
            if (-that.data.marqueeDistance < that.data.length) {
                that.setData({
                    marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
                });
            } else {
                clearInterval(interval);
                that.setData({
                    marqueeDistance: that.data.windowWidth
                });
                that.run();
            }
        }, that.data.interval);
    }, */
});
