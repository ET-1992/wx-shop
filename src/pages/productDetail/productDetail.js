import api from 'utils/api';
import { createCurrentOrder, onDefaultShareAppMessage, onDefaultShareAppTimeline } from 'utils/pageShare';
import { USER_KEY, CONFIG, ADDRESS_KEY, PLATFFORM_ENV } from 'constants/index';
import { autoNavigate, go, getAgainUserForInvalid, auth, throttle } from 'utils/util';
import  templateTypeText from 'constants/templateType';
import proxy from 'utils/wxProxy';
import getRemainTime from 'utils/getRemainTime';
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
        isShowActionSheet: false,
        isShowCouponList: false,
        isShowPostageRule: false,  // 展示邮费规则
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
        isBargainBuy: false,
        receivableCoupons: [],
        receivedCoupons: [],

        isShowShareModal: false,
        showPosterModal: false,
        templateTypeText,
        expiredGroupon: [],

        posterType: 'product',

        areaObj: {},
        isShowAreaModal: false,
        PLATFFORM_ENV,
        bargain_mission: {},
        multiStoreEnable: false,
        productQuantity: 1,
        currentTabIndex: 0,  // 当前选中标签
        scrollTop: 0,  // 当前视图的scrollTop
        toScrollTop: 0,  // 跳转的scrollTop
        tabList: [],  // 页面导航标签列表
        // 餐饮商品展示信息
        cateringProduct: {
            selectedPrice: '',
            selectedString: '',
        },
        showBgColor: false
    },

    go, // 跳转到规则详情页面

    onShowSku(ev) {
        const { status, individual_buy, product_style_type = 1 } = this.data.product;
        if (status === 'unpublished' || status === 'sold_out') {
            return;
        }
        const updateData = { isShowActionSheet: true };
        if (ev) {
            let { actions, isGrouponBuy = false, isCrowd = false, isBargainBuy = false } = ev.currentTarget.dataset;

            console.log('actions:', actions);
            console.log('onShowSku isGrouponBuy: ', isGrouponBuy);
            console.log('onShowSku isCrowd: ', isCrowd);
            console.log('onShowSku isBargainBuy: ', isBargainBuy);

            // 餐饮商品
            if (product_style_type === 2) {
                this.createCateringProduct(actions);
                return;
            }

            // 单独设置商品留言去掉sku加车按钮
            if (individual_buy) {
                actions = actions.filter(({ type }) => type !== 'addCart');
            }
            updateData.actions = actions;
            updateData.isGrouponBuy = isGrouponBuy;
            updateData.isCrowd = isCrowd;
            updateData.isBargainBuy = isBargainBuy;
        }
        this.setData(updateData, () => {
            this.setSwiperVideoImg();
            this.setData({
                isShowActionSheeted: true
            });
        });
    },

    // 倒计时初始化
    countDown(end, start) {
        return new Promise((resolve) => {
            const now = Math.round(Date.now() / 1000);
            let timeLimit = end - now;
            let hasStart = true;
            let hasEnd = false;
            if (now < start) {
                hasStart = false;
                timeLimit = start - now;
            }

            if (now > end) {
                hasEnd = true;
                timeLimit = 0;
            }
            this.setData({
                timeLimit,
                hasStart,
                hasEnd
            }, resolve());
        });
    },

    // 倒计时触发
    todayTimeLimit() {
        let { timeLimit } = this.data;
        if (timeLimit && !this.intervalId) {
            this.todayTimeLimitSet();
            this.intervalId = setInterval(() => {
                this.todayTimeLimitSet();
            }, 1000);
        }
    },

    // 倒计时设置
    todayTimeLimitSet() {
        let { timeLimit } = this.data;
        const [hour, minute, second] = getRemainTime(timeLimit);
        let day = parseInt(hour / 24, 10);
        this.setData({
            'timeLimit': timeLimit - 1,
            remainTime: {
                day: day,
                hour: hour - day * 24,
                minute,
                second,
            },
        });
    },

    loadProductDetailExtra(id) {
        setTimeout(async () => {
            const { coupons, current_user, bargain_mission } = await api.hei.fetchShopExtra({
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
                coupons,
                bargain_mission
            });
        }, 300);
    },

    async initPage() {
        const { id, grouponId } = this.options;
        this.loadProductDetailExtra(id);
        this.setData({ pendingGrouponId: '' });
        try {
            const data = await api.hei.fetchProduct({ id });
            const { thumbnail } = data.product;
            wx.setNavigationBarTitle({
                title: this.data.magua === 'magua' ? '服务详情' : data.page_title
            });

            WxParse.wxParse(
                'contentList',
                'html',
                data.product.content,
                this,
            );

            const { config, product } = data;

            if (product.miaosha_enable) {
                data.posterType = 'miaosha';
                const { miaosha_end_timestamp, miaosha_start_timestamp } = product;
                await this.countDown(
                    miaosha_end_timestamp,
                    miaosha_start_timestamp
                );
            } else if (product.seckill_enable) {
                // 秒杀初始化
                const { seckill_end_timestamp, seckill_start_timestamp } = product;
                await this.countDown(
                    seckill_end_timestamp,
                    seckill_start_timestamp,
                );
            }

            if (product.groupon_enable) {
                data.posterType = 'groupon';
            }

            if (product.bargain_enable) {
                data.posterType = 'bargain';
            }


            let tabList = ['商品', '详情'];

            // 存在推荐商品
            if (product.related && product.related.length) {
                this.setData({ isShowProductRelated: true });
                tabList.push('推荐');
            }

            // 展示评论
            if (config.reply_enable && product.reply_count) {
                tabList.splice(1, 0, '评论');
            }

            this.setData({
                tabList,
                grouponId: grouponId || '',
                share_image: thumbnail,
                ...data,
                isLoading: false
            }, () => {
                this.handleScrollMethods();
            });

            // 获取缓存地址的邮费信息
            if (config && !config.self_address && config.shipment_template_enable && product.product_type !== 1) {
                let { areaObj } = this.data;
                if (!areaObj.userName) {
                    areaObj = wx.getStorageSync(ADDRESS_KEY);
                    this.setData({ areaObj });
                    await this.calculatePostage();
                }
            }

            // 限时购倒计时
            if (product.miaosha_enable) {
                await this.todayTimeLimit();
            }
            // 秒杀倒计时
            if (product.seckill_enable) {
                await this.todayTimeLimit();
            }

            // --------------------
            this.setDefinePrice();
            // ---------------

        } catch (err) {
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
        console.log(this.data, 'this.data');
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
            // 秒杀相关价格显示
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
        const config = wx.getStorageSync(CONFIG);
        const { style_type: tplStyle = 'default', offline_store_enable = false } = config;
        // -----------------------
        const systemInfo = wx.getSystemInfoSync();
        const user = wx.getStorageSync(USER_KEY);
        // -------------------------  TODO

        const isIphoneX = systemInfo.model.indexOf('iPhone X') >= 0;
        const { themeColor, defineTypeGlobal } = app.globalData;
        const CART_NUM  = wx.getStorageSync('CART_NUM');
        console.log('CART_NUM', typeof CART_NUM, CART_NUM);
        this.setData({
            isIphoneX,
            user,
            themeColor,
            defineTypeGlobal,
            isGrouponBuy: !!query.grouponId,
            routePath: this.route,
            cartNumber: Number(CART_NUM),
            globalData: app.globalData,
            config,
            tplStyle,
        });
        // 多门店阻塞默认请求
        !offline_store_enable && this.initPage();

        // 绑定运费地区监听
        app.event.on('setAddressListEvent', this.setAddressListEvent, this);
    },

    onShow() {
        let { config } = this.data,
            multiStoreEnable = Boolean(config && config.offline_store_enable);
        this.setData({
            multiStoreEnable,
        });
    },

    onHide() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },

    onUnload() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        // 卸载运费地区监听
        app.event.off('setAddressListEvent', this);
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
    // 加入购物车
    async addCart() {
        console.log('addCart');
        const { vendor } = app.globalData;
        console.log('shipping_type', this.data.shipping_type, typeof this.data.shipping_type);
        const { user, product, product: { id, is_faved }, selectedSku, quantity, formId, shipping_type } = this.data;

        // 非会员不能购买会员专属商品 加入购物车
        if (user.membership && !user.membership.is_member && product.membership_dedicated_enable) {
            this.linktoOpenMemberModal();
            return;
        }

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
            shipping_type
        });
        console.log('data348', data);
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

    // 收藏商品
    async toggleFavProduct() {
        let { product } = this.data;

        this.setData({
            'product.is_faved': Number(!product.is_faved)
        });

        if (product.is_faved) {
            await api.hei.favProduct({ post_id: product.id }); // 收藏商品
        } else {
            await api.hei.unFavProduct({ post_id: product.id }); // 取消商品收藏
        }
    },

    // 立即购买
    async onBuy() {
        console.log('onBuy');
        const {
            user,
            product,
            quantity,
            selectedSku,
            grouponId,
            pendingGrouponId,
            isGrouponBuy,
            isBargainBuy,
            isCrowd,
            shipping_type,
            bargain_mission
        } = this.data;

        console.log('shipping_type393', shipping_type);

        // 非会员不能购买会员专属商品 立即购买
        if (user.membership && !user.membership.is_member && product.membership_dedicated_enable) {
            this.linktoOpenMemberModal();
            return;
        }

        let url = `/pages/orderCreate/orderCreate?shipping_type=${shipping_type}`;
        let { product_type } = product;
        url += `&product_type=${product_type}`;

        let isMiaoshaBuy = false;

        if (product.miaosha_enable) {
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
            url = url + '&isGrouponBuy=true';

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
            url = url + '&crowd=true';
        }

        // 秒杀
        if (product.seckill_enable) {
            url = `${url}&seckill=true&seckill_product_id=${product.seckill_product_id}`;
        }

        if (product.bargain_enable && bargain_mission && isBargainBuy) {
            url = url + `&bargain_mission_code=${bargain_mission.code}`;
            console.log('url438', url);
        }

        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
            isGrouponBuy,
            isMiaoshaBuy,
            isBargainBuy
        });

        app.globalData.currentOrder = currentOrder;

        wx.navigateTo({ url });
    },

    // 餐饮商品选择数量
    onProductQuantity(e) {
        let { detail } = e;
        this.setData({
            productQuantity: detail,
        });
    },

    // 餐饮商品改变选项
    onCateringProductOption(e) {
        let { detail } = e;
        this.setData({ cateringProduct: detail });
    },

    // 创建餐饮商品订单
    async createCateringProduct(actions) {
        let actionType = (actions && actions[0] && actions[0].type) || '';
        let { currentOrderItems: items, shipping_type } = this.selectComponent('#orderOptions').data;

        try {
            if (actionType === 'addCart') {
                // 加车
                let posts = JSON.stringify(items);
                let data = await api.hei.addCart({ posts });
                if (!data.errcode) {
                    await proxy.showToast({ title: '成功添加' });
                    this.showCartNumber(data.count);
                }
            } else if (actionType === 'onBuy') {
                // 购买
                let url = `/pages/orderCreate/orderCreate?shipping_type=${shipping_type}`;
                app.globalData.currentOrder = {
                    items: items
                };
                wx.navigateTo({ url });
            } else {
                throw new Error('识别操作失败');
            }
        } catch (e) {
            let { message, errMsg } = e;
            wx.showModal({
                title: '出错提示',
                content: errMsg || message,
                showCancel: false,
            });
        }
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

    async bindGetCoupon(e) {
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            await getAgainUserForInvalid({ encryptedData, iv });
            this.onCouponClick(e);
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
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
            isShowActionSheet: false,
            pendingGrouponId: ''
        });
    },

    // 覆盖wxParse中自动浏览图片的方法
    // wxParseImgTap() {
    //     return;
    // },

    async onSkuConfirm(e) {
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

    // async submitFormId(ev) {
    //     await api.hei.submitFormId({
    //         form_id: ev.detail.formId,
    //     });
    // },

    async showCartNumber(count) {
        wx.setStorageSync('CART_NUM', count);
        this.setData({
            cartNumber: Number(count)
        });
    },

    async reload() {
        await this.initPage();
    },
    // 分享按钮
    onShareAppMessage() {
        this.closeShareModal();
        return onDefaultShareAppMessage.call(this, {}, '', { key: '/pages/home/home' });
    },

    // 分享按钮
    onShareTimeline() {
        return onDefaultShareAppTimeline.call(this);
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

    /* 调起底部弹窗 */
    async openShareModal() {
        const { current_user = {}, config } = this.data;
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
            isShowShareModal: true
        }, () => {
            this.setData({
                showShareModaled: true
            });
        });
    },
    closeShareModal() {
        this.setData({
            isShowShareModal: false
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
        if (product.miaosha_enable) {
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
        }
        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
            isGrouponBuy,
            isMiaoshaBuy
        });
        app.globalData.currentOrder = currentOrder;
        wx.navigateTo({ url });
    },

    onExpiredGroupon(e) {
        console.log(e);
        const { expiredGroupon } = this.data;
        const { id } = e.detail;
        expiredGroupon.push(id);
        this.setData({
            expiredGroupon
        });
    },

    // 非会员购买会员专属商品提示弹窗
    async linktoOpenMemberModal() {
        const { confirm } = await proxy.showModal({
            title: '温馨提示',
            content: '该商品是会员专属商品，请开通会员后购买',
            showCancel: false
        });
        if (confirm) {
            wx.navigateTo({
                url: '/pages/membership/members/members'
            });
        }
    },

    // 从 SKUModel 组件获取配送方式 shipping_type
    getShippingType(e) {
        console.log('e690', e);
        this.setData({
            shipping_type: e.detail.shipping_type
        });
        console.log('shipping_type696', this.data.shipping_type);
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        if (iv && encryptedData) {
            await getAgainUserForInvalid({ encryptedData, iv });
            this.createBargain();
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }
    },

    // 发起砍价
    async createBargain() {
        const { product: { id, bargain_enable }, selectedSku } = this.data;
        if (!bargain_enable) {
            wx.showModal({
                title: '温馨提示',
                content: '该店铺未开启砍价功能',
                showCancel: false,
            });
            return;
        }
        autoNavigate(`/pages/bargainDetail/bargainDetail?post_id=${id}&sku_id=${selectedSku.id || 0}`);
    },

    onRecommended(e) {
        console.log('onRecommended731', e);
        const { id, title, images } = e.currentTarget.dataset;
        // 微信是否更新至7.0.3及以上版本
        if (wx.openBusinessView) {
            wx.openBusinessView({
                businessType: 'friendGoodsRecommend',
                extraData: {
                    product: {
                        item_code: String(id),
                        title: title,
                        image_list: images
                    }
                },
                success: function (res) {
                    console.log('好物圈调用成功res743', res);
                    proxy.showToast({ title: '推荐成功' });
                },
                fail: function(res) {
                    console.log('好物圈调用失败747', res);
                }
            });
        } else {
            proxy.showModal({
                title: '温馨提示',
                content: '请检查当前微信版本是否更新至7.0.3及以上版本',
            });
        }
    },

    onShowPoster() {
        const {
            product: {
                id,
                thumbnail,
                title,
                excerpt,
                definePrice,
                original_price,
                miaosha_enable,
                miaosha_price,
                groupon_enable,
                groupon_price,
                groupon_member_limit,
                bargain_enable,
                bargain_price,
                price,
                highest_price
            }
        } = this.data;
        let posterData = {
            id,
            banner: thumbnail,
            title,
            excerpt,
            price: definePrice,
            highest_price,
            original_price
        };
        if (miaosha_enable) {
            const { timeLimit, hasStart, hasEnd } = this.data;
            posterData = {
                id,
                banner: thumbnail,
                title,
                excerpt,
                price,
                miaosha_price,
                highest_price,
                timeLimit,
                hasStart,
                hasEnd
            };
        }
        if (groupon_enable) {
            posterData = {
                id,
                banner: thumbnail,
                title,
                excerpt,
                groupon_price,
                member_limit: groupon_member_limit,
                price
            };
        }
        if (bargain_enable) {
            posterData = {
                id,
                banner: thumbnail,
                title,
                bargain_price,
                price
            };
        }

        this.setData({
            showPosterModal: true,
            isShowShareModal: false,
            posterData
        });
    },

    onClosePoster() {
        this.setData({
            showPosterModal: false
        });
    },

    // 选择地址
    async onAddress() {
        wx.navigateTo({
            url: `/pages/addressList/addressList`,
        });
    },

    // 设置地址列表返回的数据
    setAddressListEvent(address) {
        console.log('从地址列表返回的地址', address);
        wx.setStorageSync(ADDRESS_KEY, address);
        this.setData({ areaObj: address });
        this.calculatePostage();
    },

    // 切换地址计算邮费
    async calculatePostage() {
        let { product, areaObj = {}} = this.data;
        let { provinceName, cityName, countyName, id } = areaObj,
            shipment_writing = '';
        try {
            const data = await api.hei.postageCalculate({
                post_id: product.id,
                receiver_id: id,
                receiver_state: provinceName,
                receiver_city: cityName,
                receiver_district: countyName
            });
            ({ shipment_writing } = data);
        } catch (err) {
            shipment_writing = err.errMsg;
        }
        Object.assign(areaObj, { shipment_writing });
        this.setData({
            areaObj,
        });
    },
    // 图片放大
    previewImg(e) {
        const { product } = this.data;
        let { index } = e.currentTarget.dataset;
        wx.previewImage({
            current: product.images[index], // 当前图片地址
            urls: product.images, // 所有要预览的图片的地址集合 数组形式
            fail(res) {
                console.log('图片放大失败:', res);
            },
        });
    },
    // 展示企业微信联系方式
    onCustomService() {
        let customServiceModal = true;
        this.setData({
            customServiceModal,
        });
    },
    showParamModal() {
        this.setData({
            isShowProductParam: true
        });
    },
    hideParamModal() {
        this.setData({
            isShowProductParam: false
        });
    },
    // 更新门店信息
    updateStore() {
        this.setData({
            globalData: app.globalData,
        });
        console.log('app.globalData', app.globalData);
        this.initPage();
    },

    // 隐藏邮费规则弹窗
    onHidePostageRule() {
        this.setData({ isShowPostageRule: false });
    },

    // 展开邮费规则弹窗
    onShowPostageRule() {
        this.setData({ isShowPostageRule: true });
    },

    // 获取页面滚动需要数据
    handleScrollMethods() {
        this.getTabsBottom();
        let intervalNum = 0;
        // 第1/3/5秒获取数据
        let intervalId = setInterval(() => {
            if (intervalNum++ > 5) {
                clearInterval(intervalId);
                return;
            } else if (intervalNum % 2 > 0) {
                this.getSelectorsTop();
            }
        }, 1000);
    },

    // 页面滚动
    handlePageScroll: function(e) {
        let { scrollTop } = e.detail;
        const { showBgColor } = this.data;
        this.scrollTop = scrollTop;
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
        this.linkTabs();
    },

    // 根据标签导航到指定位置
    handlePageToView(e) {
        let { index } = e.detail,
            { _tabTopList = [] } = this;
        // console.log('index', index);
        let toScrollTop = _tabTopList[index];
        if (index > 0) {
            // 跳过外边距
            toScrollTop += (10 * index);
        }
        this.setData({
            toScrollTop,
            currentTabIndex: index,
        });
    },

    // 联动页面标签
    linkTabs() {
        let { _tabTopList = [], scrollTop } = this,
            { currentTabIndex } = this.data;
        let newTab = '';
        _tabTopList.forEach((item, index) => {
            if (scrollTop >= item) {
                newTab = index;
            }
        });
        // console.log('newTab', newTab);
        if (currentTabIndex === newTab) { return }
        this.setData({ currentTabIndex: newTab });
    },

    // 获取元素的offsetTop偏移高度
    async getSelectorsTop() {
        let { product } = this.data,
            tabTopList = [0];
        let observerTabs = wx.createSelectorQuery().selectAll('.observer-tab');
        observerTabs.boundingClientRect((rects) => {
            let { _tabsBottom, _tabTopList = [] } = this;
            // console.log('rects', rects);
            for (let i = 0; i < rects.length; i++) {
                let height = (rects[i] && rects[i].height) || 0;
                let offsetTop = tabTopList[tabTopList.length - 1] + height;
                if (i === 0) {
                    // 忽略标签固定部分高度
                    offsetTop -= _tabsBottom;
                    // 忽略餐饮商品上移高度
                    if (product.product_style_type === 2) {
                        const TRANSLATEY = 60;
                        offsetTop -= TRANSLATEY;
                    }
                }
                tabTopList.push(offsetTop);
            }
            // 页面已跳转
            if (tabTopList.length === 1) { return }
            if (_tabTopList.toString() !== tabTopList.toString()) {
                console.log('tabTopList', tabTopList);
                this._tabTopList = tabTopList;
            }
        }).exec();
    },

    // 获取Tabs组件上方距离
    async getTabsBottom() {
        let tabsComponent = this.selectComponent('#tabs');
        let { tabsBottom = 0 } = tabsComponent.data;
        this._tabsBottom = tabsBottom;
    },

});
