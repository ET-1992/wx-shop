/* eslint-disable no-loop-func */
import api from 'utils/api';
import { parseScene, go, autoNavigate_, valueToText, updateTabbar } from 'utils/util';
import { showModal } from 'utils/wxp';
import { CONFIG } from 'constants/index';
// 获取应用实例
const app = getApp();

Component({
    properties: {
        productsList: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title, type, id } = newVal;
                this.content = content;
                setting.style = 'per_2';
                this.setData({
                    scrollLeft: 0,
                    setting,
                    title,
                    type,
                    id,
                });
            }
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
        products: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal) {
                console.log(newVal, oldVal, '000');
                if (!newVal || !newVal.length) { return }
                this.content = this.content && this.content.concat(newVal.slice(oldVal.length, newVal.length));
                // console.log(this._readyData, 'this._readyData');
                // 仅在追加时或数据异步时执行这个render
                if (oldVal.length > 0 || this._isReadyRender) {
                    this._render();
                }
            }
        },
        isLastModule: {
            type: Boolean,
            value: false,
        },
        isShowAddCart: { // 购物车为你推荐是否加车
            type: Boolean,
            value: true,
        }
    },

    data: {
        isMasonry: true,
        _readyData: [],
        content: [],
        setting: {
            margin: 0,
            title_display: false,
            title_position: 'left',
            style: 'per_2',
            orderby: 'post_date'
        },
        // 分流后数据
        itemArray: [[], []],
        // 流数（当前只支持两条流）
        fallNum: 2
    },

    lifetimes: {
        attached: function() {
            const config = wx.getStorageSync(CONFIG) || app.globalData.config;
            this.setData({ config });
        },
        ready: function() {
            // 待渲染数据
            this._readyData = [];
            // 当前激活流
            this._activeFall = 0;
            // 首次渲染数据
            this._render();
            // 主要用于处理异步数据
            this._isReadyRender = true;
            // 添加监听器（需要写在ready里，否则基础库2.7.1（含）以下不生效）
            // https://developers.weixin.qq.com/community/develop/doc/000e20e79ecf789290399941a51000
            this._addOberver();
        },
        detached: function () {
            for (const o of this._obervers) {
                o.disconnect();
            }
        },
    },

    methods: {
        /**
     * 添加触达监听
     */
        _addOberver() {
        // 存储监听器
            this._obervers = [];
            // 首排标识
            let flag = 1;

            for (let i = 0; i < this.data.fallNum; i++) {
                const o = this.createIntersectionObserver();
                o.relativeTo('.f-detector').observe(`.f-l${i}`, res => {
                    // console.log(res.intersectionRatio, this._activeFall, i, 'res');
                    // 判断渲染流
                    if (flag < this.data.fallNum) {
                        this._activeFall++;
                        this._render();
                        flag++;
                    } else if (res.intersectionRatio === 0) {
                        this._activeFall = i;
                        this._render();
                    } else {
                        this._activeFall = 0;
                    }

                });
                this._obervers.push(o);
            }
        },

        /**
       * 数据分流渲染
       */
        _render() {
            // console.log(this.content, 'this._readyData');
            if (this.content.length > 0) {
                const i = this.data.itemArray[this._activeFall].length;
                // console.log(i , 'i')
                this.setData({
                    [`itemArray[${this._activeFall}][${i}]`]: this.content.shift()
                }, () => {
                    // console.log(this.data.itemArray);
                    // 超时处理
                    clearTimeout(this._renderTimeout);
                    this._renderTimeout = setTimeout(() => {
                        this._render();
                    }, 100);
                });
            }
        },
        goMore() {
            const { setting = {}, id } = this.data;
            const { orderby = '', product_category_id = '', promotion_type = '' } = setting;
            let promotionUrl = '/pages/miaoshaList/miaoshaList',
                originalPath = '/pages/productList/productList',
                paramsStr = `?module_id=${id}&orderby=${orderby}&categoryId=${product_category_id}`;

            promotionUrl += paramsStr;
            originalPath += paramsStr;

            let pathUrl = '';
            let pagePath = {
                'groupon_enable': () => { pathUrl = promotionUrl + '&type=groupon' },
                'bargain_enable': () => { pathUrl = promotionUrl + '&type=bargain' },
                'seckill_enable': () => { pathUrl = promotionUrl + '&type=seckill' },
                'miaosha_enable': () => { pathUrl = promotionUrl + '&type=miaosha' },
                'membership_dedicated_enable': () => { pathUrl = originalPath + '&memberExclusive=true&promotionType=membership_dedicated_enable' },
                'membership_price_enable': () => { pathUrl = originalPath + '&promotionType=membership_price_enable' },
            };
            if (promotion_type) {
                pagePath[promotion_type].call(this);
            }
            let finalUrl = pathUrl || originalPath;
            console.log('跳转finalUrl', finalUrl);
            autoNavigate_({ url: finalUrl });
        },

        // 加入购物车
        async singleAddCart(e) {
            let product = {};
            product = e.currentTarget.dataset.product ? e.currentTarget.dataset.product : e.detail.product;
            // 不能加车商品
            let { individual_buy, id } = product;
            if (individual_buy) {
                wx.navigateTo({ url: `/pages/productDetail/productDetail?id=${id}` });
                return;
            }
            this.triggerEvent('add-cart', { product }, { bubbles: true, composed: true });
        },

        go
    }
});