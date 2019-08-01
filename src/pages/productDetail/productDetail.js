import api from 'utils/api';
import { createCurrentOrder, onDefaultShareAppMessage } from 'utils/pageShare';
import { USER_KEY, CONFIG } from 'constants/index';
import { getAgainUserForInvalid, updateCart, autoNavigate, go } from 'utils/util';
import  templateTypeText from 'constants/templateType';
import proxy from 'utils/wxProxy';

const WxParse = require('utils/wxParse/wxParse.js');
const app = getApp();

Page({
    data: {
        user: {},
        title: 'productDetail',
        autoplay: false,
        product: {
            skus: [],
        },
        current: 0,

        output: 'product',
        page_title: '',
        share_title: '',
        activeIndex: 0,
        isLoading: true,
        headerType: 'images',
        grouponId: '',
        remainTime: {
            hour: '00',
            minute: '00',
            second: '00',
        },
        contentList: {},
        hasStart: true,
        hasEnd: false,
        timeLimit: 0,
        isShowAcitonSheet: false,
        isShowCouponList: false,
        selectedProperties: [],
        selectedSku: {},
        // skuSplitProperties: [],
        disableSkuItems: {},
        quantity: 1,
        actions: [
            {
                type: 'onBuy',
                text: '立即购买',
            },
        ],
        isGrouponBuy: false,
        receivableCoupons: [],
        receivedCoupons: [],
        isShowProductDetailShareModal: false,
        showShareModal: false,

        templateTypeText,

        expiredGroupon: []
    },

    go,

    onShowSku(ev) {
        const { status } = this.data.product;
        if (status === 'unpublished' || status === 'sold_out') {
            return;
        }
        const updateData = { isShowAcitonSheet: true };
        if (ev) {
            const { actions, isGrouponBuy = false, isCrowd = false } = ev.currentTarget.dataset;
            console.log(actions);
            console.log('onShowSku isGrouponBuy: ', isGrouponBuy);
            console.log('onShowSku isCrowd: ', isCrowd);
            updateData.actions = actions;
            updateData.isGrouponBuy = isGrouponBuy;
            updateData.isCrowd = isCrowd;

        }
        this.setData(updateData, () => {
            this.setSwiperVideoImg();
            this.setData({
                isShowAcitonSheeted: true
            });
        });
    },

    countDown() {
        return new Promise((resolve) => {
            const {
                miaosha_end_timestamp,
                miaosha_start_timestamp,
            } = this.data.product;
            const now = Math.round(Date.now() / 1000);
            let timeLimit = miaosha_end_timestamp - now;
            let hasStart = true;
            let hasEnd = false;
            if (now < miaosha_start_timestamp) {
                hasStart = false;
                timeLimit = miaosha_start_timestamp - now;
            }

            if (now > miaosha_end_timestamp) {
                hasEnd = true;
                timeLimit = 0;
            }
            this.setData({
                timeLimit,
                hasStart,
                hasEnd,
            }, resolve());
        });
    },

    loadProductDetailExtra(id) {
        setTimeout(async () => {
            const { coupons, current_user } = await api.hei.fetchShopExtra({
                weapp_page: 'productDetail',
                id
            });

            const { receivableCoupons, receivedCoupons } = coupons && coupons.reduce(
                (classifyCoupons, coupon) => {
                    const { receivableCoupons, receivedCoupons } = classifyCoupons;

                    // coupon.fomatedTitle = coupon.title.split('-')[1];
                    if (Number(coupon.status) === 2) {
                        receivableCoupons.push(coupon);
                    }
                    else if (Number(coupon.status) === 4) {
                        receivedCoupons.push(coupon);
                    }
                    return classifyCoupons;
                },
                { receivableCoupons: [], receivedCoupons: [] },
            );

            let routeQuery = {
                id,
                afcode: current_user.afcode
            };

            this.setData({
                receivableCoupons,
                receivedCoupons,
                current_user,
                coupons,
                routeQuery
            });


        }, 300);
    },

    async initPage() {
        const { id, grouponId } = this.options;
        this.loadProductDetailExtra(id);
        this.setData({
            pendingGrouponId: ''
        });
        try {
            const data = await api.hei.fetchProduct({ id });
            const { thumbnail, miaosha_enable = false, groupon_enable = false } = data.product;
            wx.setNavigationBarTitle({
                title: this.data.magua === 'magua' ? '服务详情' : data.page_title
            });

            WxParse.wxParse(
                'contentList',
                'html',
                data.product.content,
                this,
            );
            this.setData({
                grouponId: grouponId || '',
                share_image: thumbnail,
                ...data,
                isLoading: false
            });

            const { product } = this.data;
            if (product.miaosha_enable) {
                await this.countDown();
            }
            // --------------------
            this.setDefinePrice();
            // ---------------
        }
        catch (err) {
            if (err && (err.code === 'empty_query')) {
                const { confirm } = await proxy.showModal({
                    title: '温馨提示',
                    content: '商品过期不存在',
                    showCancel: false
                });
                if (confirm) {
                    wx.switchTab({
                        url: '/pages/home/home'
                    });
                }
            }
        }
        console.log(this.data);
    },

    setDefinePrice() {
        const { hasEnd, hasStart, product } = this.data;
        product.definePrice = 0;

        if (product.groupon_enable) {
            product.definePrice = product.groupon_commander_price ? product.groupon_commander_price : product.groupon_price;
            product.showOriginalPrice = product.groupon_price !== product.original_price;
        } else if (product.miaosha_enable && !hasEnd && hasStart) {
            product.definePrice = product.miaosha_price;
            product.showOriginalPrice = product.miaosha_price !== product.original_price;
        } else if (product.seckill_enable && !hasEnd && hasStart) {
            product.definePrice = product.seckill_price;
            product.showOriginalPrice = product.seckill_price !== product.original_price;
        } else {
            product.definePrice = product.price;
            product.showOriginalPrice = product.price !== product.original_price;
        }
        this.setData({
            product,
        });
    },

    currentIndex(e) {
        this.setData({ current: e.detail.current });
    },

    wxParseTagATap(e) {
        wx.navigateTo({ url: '/' + e.currentTarget.dataset.src });
    },

    onLoad(query) {
        // -----------------------
        const systemInfo = wx.getSystemInfoSync();
        const user = wx.getStorageSync(USER_KEY);
        // -------------------------  TODO

        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const { themeColor, defineTypeGlobal } = app.globalData;
        const CART_NUM  = wx.getStorageSync('CART_NUM');
        this.setData({
            isIphoneX,
            user,
            themeColor,
            defineTypeGlobal,
            isGrouponBuy: !!query.grouponId,
            routePath: this.route,
            cartNumber: CART_NUM,
            globalData: app.globalData
        });
    },

    onShow() {
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default' } = config;
        this.setData({ config, tplStyle });
        this.initPage();
    },

    onUnload() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },

    grouponListener({ detail }) {
        const { grouponId } = detail;
        this.setData({
            pendingGrouponId: grouponId,
            actions: [
                {
                    type: 'onBuy',
                    text: '立即购买',
                },
            ],
            isGrouponBuy: true,
        });
        this.onShowSku();
    },

    async addCart() {
        console.log('addCart');
        const { vendor } = app.globalData;
        const { product, product: { id, is_faved }, selectedSku, quantity, formId } = this.data;

        if (selectedSku.stock === 0) {
            await proxy.showModal({
                title: '温馨提示',
                content: '无法购买库存为0的商品',
            });
            return;
        }

        const data = await api.hei.addCart({
            post_id: id,
            sku_id: selectedSku.id || 0,
            quantity,
            vendor,
            form_id: formId,
        });
        if (!data.errcode) {
            await proxy.showToast({ title: '成功添加' });
            // 更新红点
            this.showCartNumber(data.count);

            // 收藏商品
            if (!is_faved) {
                const res = await api.hei.favProduct({ post_id: id });
                if (!res.errcode) {
                    product.is_faved = 1;
                    this.setData({
                        product
                    });
                }
            }
        }
    },

    async onBuy() {
        console.log('onBuy');
        const {
            product,
            quantity,
            selectedSku,
            grouponId,
            pendingGrouponId,
            isGrouponBuy,
            isCrowd
        } = this.data;

        let url = '/pages/orderCreate/orderCreate';
        let isMiaoshaBuy = false;

        if (product.miaosha_enable === '1') {
            const now = Date.now() / 1000;
            const hasStart = now >= product.miaosha_start_timestamp;
            const hasEnd = now >= product.miaosha_end_timestamp;
            isMiaoshaBuy = hasStart && !hasEnd;
        }

        if (selectedSku.stock === 0) {
            await proxy.showModal({
                title: '温馨提示',
                content: '无法购买库存为0的商品',
            });
            return;
        }

        if (isGrouponBuy) {
            url = url + '?isGrouponBuy=true';

            // 参团，跳转到orderCreate需要带上grouponId
            if (grouponId) {
                console.log('grouponId');
                url = url + `&grouponId=${grouponId}`;
            }
            else if (pendingGrouponId) {
                console.log('pendingGrouponId');
                url = url + `&grouponId=${pendingGrouponId}`;
            } else {
                url = url + '&groupon_commander_price=true';
            }
        }
        if (isCrowd) {
            url = url + '?crowd=true';
        }

        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
            isGrouponBuy,
            isMiaoshaBuy,
        });

        app.globalData.currentOrder = currentOrder;

        wx.navigateTo({ url });
    },

    onReady() {
        this.videoContext = wx.createVideoContext('myVideo');
    },

    onHideCouponList() {
        this.setData({
            isShowCouponList: false
        });
    },

    async onReceiveCoupon(id, index) {
        try {
            const data = await api.hei.receiveCoupon({
                coupon_id: id,
            });
            if (!data.errcode) {
                await proxy.showToast({ title: '领取成功' });
                const updateData = {};
                const key = `receivableCoupons[${index}].status`;
                updateData[key] = 4;
                this.setData(updateData);
            }
        }
        catch (err) {
            await proxy.showModal({
                title: '温馨提示',
                content: err.errMsg,
                showCancel: false,
            });
        }
    },

    async onCouponClick(ev) {
        const { id, index, status, title } = ev.currentTarget.dataset;
        if (Number(status) === 2) {
            await this.onReceiveCoupon(id, index);
        }
        else {
            wx.navigateTo({
                url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
            });
        }
    },

    onShowCouponList() {
        console.log('onShowCoupons');
        this.setData({
            isShowCouponList: true
        });
    },

    onSkuCancel() {
        this.setData({
            isShowAcitonSheet: false,
            pendingGrouponId: ''
        });
    },

    // 覆盖wxParse中自动浏览图片的方法
    wxParseImgTap() {
        return;
    },

    onSkuConfirm(e) {
        console.log(e);
        const { actionType, selectedSku, quantity, formId } = e.detail;
        this.setData({
            selectedSku,
            quantity,
            formId
        });
        this[actionType]();
        this.onSkuCancel();
    },

    async submitFormId(ev) {
        await api.hei.submitFormId({
            form_id: ev.detail.formId,
        });
    },

    async showCartNumber(e) {
        wx.setStorageSync('CART_NUM', e.toString());
        this.setData({
            cartNumber: e.toString()
        });
    },

    async reload() {
        await this.initPage();
    },

    onShareAppMessage() {
        this.closeShareModal();
        const { current_user = {}, product } = this.data;
        let opts = {};
        if (product.affiliate_enable && current_user.is_affiliate_member) {
            opts = {
                afcode: current_user.afcode || ''
            };
        }
        return onDefaultShareAppMessage.call(this, opts);
    },

    setSwiperVideoImg() { // 调起面板时 关闭组件视频
        const swiperVideoImg = this.selectComponent('#swiperVideoImg');
        if (swiperVideoImg && swiperVideoImg.data.type === 'video') {
            swiperVideoImg.setData({
                type: 'poster',
                videoTime: 0
            });
        }
    },

    shareProductDetail() {
        const { product } = this.data;
        wx.navigateTo({
            url: `/pages/share/sharePoster/sharePoster?productTitle=${product.title}&productImg=${product.images && product.images[0]}`
        });
    },

    async isShowProductDetailShareModal() {
        this.setSwiperVideoImg();
        this.setData({
            isShowProductDetailShareModal: true,
            showShareModal: false
        }, () => {
            this.setData({
                showShareModaled: false
            });
        });
    },

    onCloseProductDetailShareModal() {
        this.setData({
            isShowProductDetailShareModal: false
        });
    },

    /* 调起底部弹窗 */
    async openShareModal() {
        const { product, current_user = {}, config } = this.data;
        if (config.affiliate_enable && current_user && !current_user.is_affiliate_member && config.affiliate_public) {
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '希望获取这件商品的佣金吗? 赶紧申请成为分享家吧！',
                mask: true
            });
            if (confirm) {
                wx.navigateTo({
                    url: '/pages/affiliate/affiliateApply/affiliateApply'
                });
                return;
            }
        }
        this.setData({
            showShareModal: true
        }, () => {
            this.setData({
                showShareModaled: true
            });
        });
    },
    closeShareModal() {
        this.setData({
            showShareModal: false
        }, () => {
            this.setData({
                showShareModaled: false
            });
        });
    },

    async addCrowd() {
        const {
            product,
            quantity,
            selectedSku,
            grouponId,
            pendingGrouponId,
            isGrouponBuy,
        } = this.data;
        let url = `/pages/orderCreate/orderCreate?crowd=${true}`;
        let isMiaoshaBuy = false;
        if (product.miaosha_enable === '1') {
            const now = Date.now() / 1000;
            const hasStart = now >= product.miaosha_start_timestamp;
            const hasEnd = now >= product.miaosha_end_timestamp;
            isMiaoshaBuy = hasStart && !hasEnd;
        }
        if (selectedSku.stock === 0) {
            await proxy.showModal({
                title: '温馨提示',
                content: '无法购买库存为0的商品',
            });
            return;
        }
        if (isGrouponBuy) {
            url = url + '?isGrouponBuy=true';
            // 参团，跳转到orderCreate需要带上grouponId
            if (grouponId) {
                url = url + `&grouponId=${grouponId}`;
            }
            else if (pendingGrouponId) {
                url = url + `&grouponId=${pendingGrouponId}`;
            }
        } else {
            const { groupon_commander_price } = product;
            groupon_commander_price && (url = url + '&groupon_commander_price=true');
            console.log('dddd');
        }
        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
            isGrouponBuy,
            isMiaoshaBuy,
        });
        app.globalData.currentOrder = currentOrder;
        wx.navigateTo({ url });
    },

    navigateToCart() {
        autoNavigate('/pages/cart/cart');
    },
    navigateToHome() {
        autoNavigate('/pages/home/home');
    },

    onExpiredGroupon(e) {
        console.log(e);
        const { expiredGroupon } = this.data;
        const { id } = e.detail;
        expiredGroupon.push(id);
        this.setData({
            expiredGroupon
        });
    }
});
