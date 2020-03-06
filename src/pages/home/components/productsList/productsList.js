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
                if (!newVal || !newVal.length) { return };
                const { products, isLastModule, content = [] } = this.data;
                const newContent = content.concat(products);
                if (isLastModule) {
                    this.setData({
                        content: newContent
                    })
                }
            }
        },
        isLastModule: {
            type: Boolean,
            value: false,
        }
    },

    methods: {
        goMore() {
            const { setting, id } = this.data;
            if (setting.promotion_type === 'groupon_enable') {
                autoNavigate_({ url: '/pages/miaoshaList/miaoshaList?type=groupon&module_id=' + id });
            }
            if (setting.promotion_type === 'bargain_enable') {
                autoNavigate_({ url: '/pages/miaoshaList/miaoshaList?type=bargain&module_id=' + id });
            }
            if (setting.promotion_type === 'miaosha_enable') {
                autoNavigate_({ url: '/pages/miaoshaList/miaoshaList?type=miaosha&module_id=' + id });
            }
            if (!setting.promotion_type) {
                autoNavigate_({ url: '/pages/loadProduct/loadProduct?module_id=' + id });
            }
        }
    }
});