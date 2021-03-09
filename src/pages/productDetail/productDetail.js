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
        scrollEnable: true,  // 页面是否可以垂直滚动
        tabList: [],  // 页面导航标签列表
        // 餐饮商品展示信息
        selectedOptions: {},  // 简约模式的规格内容/价格
        showBgColor: false,
        miaoShaStatus: 'notStart'
    },

    go,

    // 触发右下角按钮
    async onShowSku(e) {
        let { product, user } = this.data,
            { status, individual_buy, product_style_type } = product,
            { actions, isGrouponBuy = false, isCrowd = false, isBargainBuy = false } = e.currentTarget.dataset;
        // 售罄
        if (status === 'unpublished' || status === 'sold_out') {
            return;
        }
        // 单独设置商品留言去掉sku加车按钮
        if (individual_buy) {
            actions = actions.filter(({ type }) => type !== 'addCart');
        }
        // 专属商品
        if (user.membership && !user.membership.is_member && product.membership_dedicated_enable) {
            this.linktoOpenMemberModal();
            return;
        }

        // 简约模式
        if (product_style_type === 2) {
            let component = this.selectComponent('#orderOptions');
            // 购买/加车
            await component.onQuickCreate(actions);
            return;
        }

        // 普通模式
        let isShowActionSheet = true;
        this.handleCloseVideo();
        this.setData({
            isShowActionSheet,
            actions,
            isGrouponBuy,
            isCrowd,
            isBargainBuy,
        });
    },

    // 检查秒杀或限时购的状态
    checkMiaoShaStatus(startTime, endTime) {
        const now = Math.round(Date.now() / 1000);
        let status,
            timeLimit;
        if (startTime <= now && endTime >= now) {
            status = 'active';
            timeLimit = endTime - now;
        } else if (startTime > now) {
            status = 'notStart';
            timeLimit = startTime - now;
        } else {
            status = 'end';
            timeLimit = 0;
        }
        this.setData({
            timeLimit,
            miaoShaStatus: status
        });
        return {
            timeLimit,
            status
        };
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
            let { posterType } = this.data;
            const { config, product, share_title, share_image } = data;
            this.config = config;
            this.product = product;
            wx.setNavigationBarTitle({
                title: this.data.magua === 'magua' ? '服务详情' : data.page_title
            });

            WxParse.wxParse(
                'contentList',
                'html',
                data.product.content,
                this,
            );

            if (product.miaosha_enable) {
                posterType = 'miaosha';
                const { miaosha_end_timestamp, miaosha_start_timestamp } = product;
                await this.checkMiaoShaStatus(
                    miaosha_start_timestamp,
                    miaosha_end_timestamp
                );
                /* await this.todayTimeLimit(); */
            }

            if (product.seckill_enable) {
                // 秒杀初始化
                const { seckill_end_timestamp, seckill_start_timestamp } = product;
                await this.checkMiaoShaStatus(
                    seckill_start_timestamp,
                    seckill_end_timestamp,
                );
                /* await this.todayTimeLimit(); */
            }

            if (product.groupon_enable) {
                posterType = 'groupon';
            }

            if (product.bargain_enable) {
                posterType = 'bargain';
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
            // 设置价格
            this.setDefinePrice();

            // 获取缓存地址的邮费信息
            const areaObj = this.getAddressInfo();

            this.setData({
                share_title,
                share_image,
                tabList,
                grouponId: grouponId || '',
                product,
                isLoading: false,
                areaObj,
                posterType
            }, async () => {
                this.handleScrollMethods();
                await this.calculatePostage();
            });
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
    getAddressInfo() {
        // 获取缓存地址的邮费信息
        const { config, product } = this;
        if (config && !config.self_address && config.shipment_template_enable && product.product_type !== 1) {
            let { areaObj } = this.data;
            if (!areaObj.userName) {
                areaObj = wx.getStorageSync(ADDRESS_KEY);
            }
            return areaObj;
        }
    },
    setDefinePrice() {
        const { product } = this;
        const { miaoShaStatus } = this.data;
        /* product.definePrice = 0; */

        if (product.groupon_enable) {
            product.definePrice = product.groupon_commander_price ? product.groupon_commander_price : product.groupon_price;
            product.showOriginalPrice = product.groupon_price !== product.original_price;
        } else if (product.miaosha_enable && miaoShaStatus === 'active') {
            product.definePrice = product.miaosha_price;
            product.showOriginalPrice = product.miaosha_price !== product.original_price;
        } else if (product.seckill_enable && miaoShaStatus === 'active') {
            // 秒杀相关价格显示
            product.definePrice = product.seckill_price;
            product.showOriginalPrice = product.seckill_price !== product.original_price;
        } else {
            product.definePrice = product.price;
            product.showOriginalPrice = product.price !== product.original_price;
        }
        return product;
        /* this.setData({
            'product.definePrice': product.definePrice,
            'product.showOriginalPrice': product.showOriginalPrice,
        }); */
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

    onUnload() {
        // 卸载运费地区监听
        app.event.off('setAddressListEvent', this);
    },

    // 去参团 拼团商品 非团长
    grouponListener({ detail }) {
        const { grouponId } = detail;
        this.setData({
            pendingGrouponId: grouponId,
            actions: [{ type: 'onBuy', text: '立即购买' }],
            isGrouponBuy: true,
            isShowActionSheet: true,
        });
    },

    // 加入购物车
    async addCart(data) {
        let { product: { id, is_faved }} = this.data;

        // 更新红点
        wx.setStorageSync('CART_NUM', data.count);
        this.showCartNumber(data);

        // 收藏商品
        if (!is_faved) {
            const res = await api.hei.favProduct({ post_id: id });
            if (!res.errcode) {
                is_faved = 1;
                this.setData({
                    'product.is_faved': is_faved,
                });
            }
        }
    },

    // 收藏商品
    async toggleFavProduct() {
        let { is_faved, id } = this.data.product,
            method = is_faved ? 'unFavProduct' : 'favProduct',
            title = is_faved ? '取消收藏' : '收藏成功',
            icon = 'success';

        try {
            this.setData({ 'product.is_faved': !is_faved });
            await api.hei[method]({ post_id: id });
        } catch (e) {
            title = '收藏操作失败';
            icon = 'none';
            this.setData({ 'product.is_faved': is_faved });
        }
        wx.showToast({ title, icon });
    },
    // 立即购买
    async onBuy() {
        console.log('onBuy');
        const {
            product,
            quantity,
            selectedSku,
            grouponId,
            pendingGrouponId,
            isGrouponBuy,
            isBargainBuy,
            isCrowd,
            shipping_type,
            bargain_mission,
            currentSpecial,
            currentRelation,
        } = this.data;

        console.log('shipping_type393', shipping_type);

        let url = `/pages/orderCreate/orderCreate?shipping_type=${shipping_type}`;
        let { product_type } = product;
        url += `&product_type=${product_type}`;

        let isMiaoshaBuy;

        if (product.miaosha_enable) {
            const { miaosha_start_timestamp, miaosha_end_timestamp } = product;
            const { status } = this.checkMiaoShaStatus(miaosha_start_timestamp, miaosha_end_timestamp);
            isMiaoshaBuy = (status === 'active');
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
            isBargainBuy,
            currentSpecial,
            currentRelation,
            selectedOptions: this._selectedOptions,
            remarks: this._remarks,
        });

        app.globalData.currentOrder = currentOrder;

        wx.navigateTo({ url });
    },

    // SKU确认 立即赠送
    onGivingGift() {
        let { selectedSku, quantity, product, isGrouponBuy, isBargainBuy, currentSpecial, currentRelation } = this.data,
            url = '/pages/giveGift/giveGift';
        let isMiaoshaBuy;

        if (product.miaosha_enable) {
            const { miaosha_start_timestamp, miaosha_end_timestamp } = product;
            const { status } = this.checkMiaoShaStatus(miaosha_start_timestamp, miaosha_end_timestamp);
            isMiaoshaBuy = (status === 'active');
        }
        const currentOrder = createCurrentOrder({
            selectedSku,
            quantity,
            product,
            isGrouponBuy,
            isMiaoshaBuy,
            isBargainBuy,
            currentSpecial,
            currentRelation,
            selectedOptions: this._selectedOptions,
            remarks: this._remarks,
        });
        let success = (res) => {
            res.eventChannel.emit('productDetail', { currentOrder });
        };
        wx.navigateTo({
            url,
            success,
        });
    },

    // 简约模式选择数量
    onProductQuantity(e) {
        let { detail: productQuantity } = e;
        this.setData({ productQuantity });
    },

    // 简约模式选择规格
    onOptionChange(e) {
        let { detail: selectedOptions } = e;
        this.setData({ selectedOptions });
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

    // SKU确认 组件回调
    async onSkuConfirm({ detail }) {
        let { actionType, queryData } = detail;
        if (actionType === 'addCart') {
            this.addCart(queryData);
        } else {
            const {
                selectedSku,
                quantity,
                currentSpecial,
                currentRelation,
                selectedOptions,
                remarks,
            } = queryData;
            this.setData({
                selectedSku,
                quantity,
                currentSpecial,
                currentRelation,
            });
            this._selectedOptions = selectedOptions;
            this._remarks = remarks;
            // onBuy/onGivingGift
            this[actionType]();
            this.onSkuCancel();
        }
    },

    // 更新购物车数量红点
    async showCartNumber(e) {
        let data = e.detail || e;
        let { count } = data;
        this.setData({
            cartNumber: Number(count)
        });
    },

    async reload() {
        await this.initPage();
    },
    // 分享按钮
    onShareAppMessage() {
        return onDefaultShareAppMessage.call(this, {}, '', { key: '/pages/home/home' });
    },

    // 分享按钮
    onShareTimeline() {
        return onDefaultShareAppTimeline.call(this);
    },

    // 关闭视频
    handleCloseVideo() {
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

    // 调起分享弹窗
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
        });
    },
    // 关闭分享弹窗
    closeShareModal() {
        this.setData({
            isShowShareModal: false
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
        let isMiaoshaBuy;

        if (product.miaosha_enable) {
            const { miaosha_start_timestamp, miaosha_end_timestamp } = product;
            const { status } = this.checkMiaoShaStatus(miaosha_start_timestamp, miaosha_end_timestamp);
            isMiaoshaBuy = (status === 'active');
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
            isMiaoshaBuy,
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

    // 物流选项组件回调
    getShippingType(e) {
        let { shipping_type } = e.detail;
        // console.log('shipping_type696', shipping_type);
        this.setData({ shipping_type });
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

    // 触发分享面板按钮
    onShareSheet(e) {
        let { index, openType } = e.detail;
        this.closeShareModal();
        if (openType) { return }
        switch (index) {
            case 1:
                this.onShowPoster();
                break;
            case 2:
                this.onShowImgText();
                break;
            default:
                console.warn('There is no method');
                break;
        }
    },

    // 分享海报
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
            const { timeLimit, miaoShaStatus } = this.data;
            posterData = {
                id,
                banner: thumbnail,
                title,
                excerpt,
                price,
                miaosha_price,
                highest_price,
                timeLimit,
                miaoShaStatus
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
            posterData
        });
    },
    // 分享图文
    /* onShowImgText() {
        let { product: { id }} = this.data;
        const data = api.hei.getShareImgText({ post_id: id });
        console.log(data);
    }, */
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

    // 留言表单聚焦/失焦
    onChangeFormFocus(e) {
        let { isFocused } = e.detail;
        let scrollEnable = !isFocused;
        this.setData({ scrollEnable });
    },

});
