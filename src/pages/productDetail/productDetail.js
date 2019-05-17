import api from 'utils/api';
import { createCurrentOrder, onDefaultShareAppMessage } from 'utils/pageShare';
import { showToast, showModal } from 'utils/wxp';
import getRemainTime from 'utils/getRemainTime';
import getSKUMap from 'utils/getSKUMap';
import { USER_KEY, CONFIG } from 'constants/index';
import { getAgainUserForInvalid, updateCart, autoNavigate } from 'utils/util';
import  templateTypeText from 'constants/templateType';
import proxy from 'utils/wxProxy';

// import login from 'utils/login';

const WxParse = require('utils/wxParse/wxParse.js');
const app = getApp();

const findSelectedSku = (skus, selectedProperties) => {
    const selectedPropertiesNames = selectedProperties.reduce(
        (propertyNames, sku) => {
            return propertyNames + sku.key + ':' + sku.value + ';';
        },
        '',
    );
    const sku = skus.find((sku) => {
        return sku.property_names === selectedPropertiesNames;
    });
    return sku || {};
};

const generateDisableSkuItem = ({ skuSplitProperties, skus, selectedProperties }) => {
    console.log('find disableSkuItems');
    const disableSkuItems = {};
    skus.forEach((sku) => {
        const { stock, properties } = sku;
        const value = properties[0].v;
        if (!stock) {
            if (skuSplitProperties.length === 1) {
                disableSkuItems[value] = true;
            }
            if (skuSplitProperties.length === 2 && selectedProperties) {
                selectedProperties.forEach((selectedProperty, selectedIndex) => {
                    if (selectedProperty.value === properties[selectedIndex].v) {
                        const anotherIndex = selectedIndex === 0 ? 1 : 0;
                        const anotherValue = properties[anotherIndex].v;
                        disableSkuItems[anotherValue] = true;
                    }
                });
            }
        }
    });
    return disableSkuItems;
};

const generateDisableSkuItemV2 = ({ properties = [], skuMap, selectedProperties }) => {
    console.log('find disableSkuItems v2');
    const disableSkuItems = {};
    properties.forEach((property = {}, propertyIndex) => {
        const { name, items } = property;
        items.forEach((item) => {
            const itemName = item.name;
            const nextSelectedPropertyNames = selectedProperties.reduce((names, selectedProperty, selectedIndex) => {
                const { key, value } = selectedProperty;
                const selectedNames = key ? `${key}:${value};` : '';
                const currentNames = selectedIndex === propertyIndex ? `${name}:${itemName};` : selectedNames;
                return names + currentNames;
            }, '');
            if (skuMap[nextSelectedPropertyNames].count === 0) {
                disableSkuItems[itemName] = true;
            }
        });

    });
    return disableSkuItems;
};


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

            this.setData({
                receivableCoupons,
                receivedCoupons,
                current_user,
                coupons
            });


        }, 300);
    },

    async initPage() {
        const { id, grouponId } = this.options;
        // const { product } = this.data;
        // if (!product.id) {
        //     this.setData({ isLoading: true });
        // }

        this.loadProductDetailExtra(id);

        this.setData({
            pendingGrouponId: '',
            selectedProperties: [],
            selectedSku: {},
            // skuSplitProperties: [],
        });

        try {
            const data = await api.hei.fetchProduct({ id });

            const { skus, coupons = [], properties: productProperties, thumbnail } = data.product;
            const skuData = {};
            skus && skus.forEach((sku) => {
                const { property_names, stock, price } = sku;
                skuData[property_names] = { price, count: stock };
            });

            const skuMap = getSKUMap.init(skuData);

            // wx.getBackgroundAudioManager({
            //     success(res) {
            //         console.log(res);
            //     },
            // });
            wx.setNavigationBarTitle({
                title: this.data.magua === 'magua' ? '服务详情' : data.page_title
            });


            let defalutSelectedProperties;
            let selectedSku = {};

            skus && skus.forEach((sku) => {
                const { stock, properties } = sku;
                // const value = properties[0].v;

                // 生成 defalutSelectedProperties 和 selectedSku
                if (stock && !defalutSelectedProperties) {
                    defalutSelectedProperties = properties.map((property) => {
                        const { k, v } = property;
                        return { key: k, value: v };
                    });
                    selectedSku = findSelectedSku(skus, defalutSelectedProperties);
                }
            });
            console.log('defalutSelectedProperties', defalutSelectedProperties);

            // const disableSkuItems = generateDisableSkuItem({
            // 	skus,
            // 	skuSplitProperties,
            // 	selectedProperties: defalutSelectedProperties || [],
            // })

            const disableSkuItems = generateDisableSkuItemV2({
                properties: productProperties,
                skuMap,
                selectedProperties: defalutSelectedProperties || [],
            });

            WxParse.wxParse(
                'contentList',
                'html',
                data.product.content,
                this,
            );

            this.setData({
                // skuSplitProperties,
                grouponId: grouponId || '',
                disableSkuItems,
                selectedProperties: defalutSelectedProperties,
                selectedSku,
                skuMap,
                isLoading: false,
                share_image: thumbnail,
                ...data,
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
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '商品过期不存在',
                showCancel: false
            });
            if (confirm) {
                wx.navigateBack({
                    delta: 1
                });
            }
        }
        // this.setData({ isLoading: false });
        console.log(this.data);
    },

    setDefinePrice() {
        const { hasEnd, hasStart, product } = this.data;
        product.definePrice = 0;

        if (product.groupon_enable === '1') {
            product.definePrice = product.groupon_commander_price ? product.groupon_commander_price : product.groupon_price;
            product.showOriginalPrice = product.groupon_price !== product.original_price;
        } else if (product.miaosha_enable === '1' && !hasEnd && hasStart) {
            product.definePrice = product.miaosha_price;
            product.showOriginalPrice = product.miaosha_price !== product.original_price;
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
            routeQuery: query,
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
            await showModal({
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
            wx.showToast({
                title: '成功添加'
            });
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
        // const token = getToken();
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

        // if (!token) {
        // 	// await login();
        // 	wx.navigateTo({ url: '/pages/login/login' });
        // 	return;
        // }

        if (selectedSku.stock === 0) {
            await showModal({
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

        // if (isGrouponBuy) {
        // 	selectedSku.price = product.groupon_price;
        // 	product.price = product.groupon_price;
        // 	wx.setStorageSync('orderCreate', {
        // 		isGroupon: 1, // 检查是用来干什么的
        // 		grouponId: grouponId || pendingGrouponId,
        // 		skuId: selectedSku.id,
        // 		quantity,
        // 	});
        // }

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

    async onSkuItem(ev) {
        const { key, value, propertyIndex, isDisabled } = ev.currentTarget.dataset;

        if (isDisabled) {
            await showModal({
                title: '温馨提示',
                content: '该商品库存为0',
            });
            return;
        }

        const {
            selectedProperties,
            // skuSplitProperties,
            product: { properties },
            skuMap
        } = this.data;
        const exValue =
			selectedProperties[propertyIndex] &&
			selectedProperties[propertyIndex].value;
        const updateData = {};
        const updatekey = `selectedProperties[${propertyIndex}]`;
        const isSameValue = exValue === value;
        const updateValue = isSameValue ? {} : { key, value };
        updateData[updatekey] = updateValue;
        this.setData(updateData);

        const {
            selectedProperties: newSelectedProperties,
            product: { skus },
        } = this.data;

        const selectedSku = findSelectedSku(skus, newSelectedProperties);


        // const disableSkuItems = generateDisableSkuItem({
        // 	skus,
        // 	skuSplitProperties,
        // 	selectedProperties: newSelectedProperties
        // });
        //
        const disableSkuItems = generateDisableSkuItemV2({
            properties,
            skuMap,
            selectedProperties: newSelectedProperties,
        });

        this.setData({
            selectedSku,
            quantity: 1,
            disableSkuItems,
        });
    },

    updateQuantity({ detail }) {
        const { value } = detail;
        this.setData({ quantity: value });
    },

    onMockCancel() {
        this.onSkuCancel();
        this.onHideCouponList();
    },

    onReady() {
        this.videoContext = wx.createVideoContext('myVideo');
    },
    onHideCouponList() {
        this.setData({
            isShowCouponList: false,
        }, () => {
            this.setData({
                isShowCouponListed: false
            });
        });
    },

    async onReceiveCoupon(id, index) {
        try {
            const data = await api.hei.receiveCoupon({
                coupon_id: id,
            });
            if (!data.errcode) {
                showToast({ title: '领取成功' });
                const updateData = {};
                const key = `receivableCoupons[${index}].status`;
                updateData[key] = 4;
                this.setData(updateData);
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

    async onCouponClick(ev) {
        const { id, index, status, title } = ev.currentTarget.dataset;
        // const token = getToken();

        // if (!token) {
        // 	const { confirm } = await showModal({
        // 		title: '未登录',
        // 		content: '请先登录，再领取优惠券',
        // 		confirmText: '前往登录',
        // 	});
        // 	if (confirm) {
        // 		this.setData({ isShowCouponList: false });
        // 		wx.navigateTo({ url: '/pages/login/login' });

        // 		// await login();
        // 		// await this.initPage();
        // 	}
        // 	return;
        // }

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
            isShowCouponList: true,
        }, () => {
            this.setData({
                isShowCouponListed: true
            });
        });
    },

    onSkuCancel() {
        this.setData({
            isShowAcitonSheet: false,
            // selectedSku: {},
            // selectedProperties: [],
            // quantity: 1,
            pendingGrouponId: '',
        }, () => {
            this.setData({
                isShowAcitonSheeted: false
            });
        });
    },

    // 覆盖wxParse中自动浏览图片的方法
    wxParseImgTap() {
        return;
    },

    onFormSubmit(ev) {
        const { formId } = ev.detail;
        this.setData({ formId });
    },

    onSkuConfirm(actionType) {
        console.log('onSkuConfirm', actionType);
        // const { actionType } = ev.detail.target.dataset;
        this.setData({
            isShowAcitonSheet: false,
        }, () => {
            this.setData({
                isShowAcitonSheeted: false
            });
        });
        // actionType [addCart, onBuy]
        this[actionType]();
    },

    async submitFormId(ev) {
        await api.hei.submitFormId({
            form_id: ev.detail.formId,
        });
    },

    async onUserInfo(ev) {
        console.log('onUserInfo', ev);
        const { encryptedData, iv } = ev.detail;
        if (iv && encryptedData) {
            const { actionType } = ev.target.dataset;
            await getAgainUserForInvalid({ encryptedData, iv });
            this.onSkuConfirm(actionType);
        }
        else {
            showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
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
            const { confirm } = await showModal({
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
            await showModal({
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
