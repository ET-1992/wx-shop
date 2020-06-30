import api from 'utils/api';
import { parseScene, go, autoNavigate_ } from 'utils/util';
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
                this.setData({
                    scrollLeft: 0,
                    content,
                    setting,
                    title,
                    type,
                    id
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
            observer(newVal) {
                if (!newVal || !newVal.length) { return }
                const { products, isLastModule, content = [] } = this.data;
                // const newContent = content.concat(products);
                if (isLastModule) {
                    this.setData({
                        content: products
                    });
                }
            }
        },
        isLastModule: {
            type: Boolean,
            value: false,
        }
    },

    data: {
        content: [],
        setting: {
            margin: 0,
            title_display: false,
            title_position: 'left',
            style: 'per_2',
            orderby: 'post_date'
        },
    },

    methods: {
        goMore() {
            const { setting = {}, id } = this.data;
            const { orderby = '', product_category_id = '', promotion_type = '' } = setting;
            let promotionUrl = '/pages/miaoshaList/miaoshaList',
                paramsStr = `?module_id=${id}&orderby=${orderby}&categoryId=${product_category_id}`;
            // 最终传递URL
            let finalUrl = '';
            promotionUrl += paramsStr;
            if (promotion_type === 'groupon_enable') {
                // 拼团
                finalUrl = promotionUrl + '&type=groupon';
            } else if (promotion_type === 'bargain_enable') {
                // 砍价
                finalUrl = promotionUrl + '&type=bargain';
            } else if (promotion_type === 'seckill_enable') {
                // 秒杀
                finalUrl = promotionUrl + '&type=seckill';
            } else if (promotion_type === 'miaosha_enable') {
                // 限时购
                finalUrl = promotionUrl + '&type=miaosha';
            } else {
                // 会员/普通
                finalUrl = '/pages/productList/productList' + paramsStr;
                if (promotion_type) {
                    finalUrl += `&promotionType=${promotion_type}`;
                }
            }
            autoNavigate_({ url: finalUrl });
        }
    }
});