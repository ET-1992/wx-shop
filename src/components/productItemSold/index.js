import { CONFIG } from 'constants/index';
const app = getApp();

Component({
    properties: {
        items: {
            type: Object,
            value: {},
            observer(newValue) {
                if (!newValue) {
                    return;
                }
                const nowTime = Date.now() / 1000;
                let products = [];
                products = newValue.map((item) => {
                    return {
                        ...item,
                        imageUrl: item.thumbnail || item.image_url,
                        property: item.sku_property_names,
                        price: (item.miaosha_end_timestamp >= nowTime && nowTime >= item.miaosha_start_timestamp) ? item.miaosha_price : item.price,
                        post_id: item.post_id || item.id
                    };
                });
                this.setData({
                    products
                });
                console.log('res:', products);
            }
        },
        itemStyle: {
            type: Number,
            value: 1 // 1:非团购 2：团购类型
        },
        groupon: {
            type: Object,
            value: {}
        },
        statusCode: {
            type: Number,
            value: 0,
            observer(newValue) {
                console.log(typeof newValue, newValue, '1111');
            }
        },
        orderNo: {
            type: String,
            value: ''
        },
        vip: {
            type: Object,
            value: {}
        },
        customClass: {
            type: String,
            value: ''
        },
        showStepper: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        products: [],
        globalData: app.globalData
    },
    attached() {
        const { statusCode } = this.data;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            config
        });
    },
    methods: {
        // 展示商品留言
        onShowProductRemark(e) {
            let { index } = e.currentTarget.dataset,
                { products } = this.data;

            let { remarks } = products[index].product_annotation;
            this.setData({
                isShowRemark: true,
                currentRemark: remarks,
            });
        },

        // 关闭商品留言
        onCloseRemark() {
            this.setData({ isShowRemark: false });
        },
        // 步进器数量改变
        onStepperChange(e) {
            let { detail, currentTarget: { dataset: { index }}} = e;
            let eventDetail = { index, number: detail };
            this.triggerEvent('stepperChange', eventDetail);
        }
    }
});
