const app = getApp();
Component({
    properties: {
        product: {
            type: Object,
            value: {},
            observer(newValue, oldValue) {
                if (newValue.id === oldValue.id) { return }
                this.firstInit();
            }
        },
        config: {
            type: Object,
            value: {},
        },
        actions: {
            type: Array,
            value: []
        },
    },
    lifetimes: {
        attached() {
            const { themeColor } = app.globalData;
            this.setData({ themeColor });
        }
    },
    methods: {
        // 初始化配送方式
        firstInit() {
            const cashedType = wx.getStorageSync('shippingType'),
                {
                    product: { shipping_types: types = [] },  // 商品物流方式
                    config: { shipping_type_name = [], }  // 店铺物流名称字典
                } = this.data;

            console.log('types', types);

            // 选中物流对应对象数组 添加checked属性
            let liftStyles = [];
            for (let lift of shipping_type_name) {
                let type = Number(lift.value),
                    productShippingType = types.indexOf(type) > -1;
                if (productShippingType) {
                    Object.assign(lift, { checked: false });
                    liftStyles.push(lift);
                }
            }

            // 设置当前选中物流
            let shipping_type = '';
            for (let lift of liftStyles) {
                if (lift.value === Number(cashedType)) {
                    lift.checked = true;
                    shipping_type = Number(cashedType);
                }
            }
            if (!shipping_type && liftStyles[0]) {
                // 不存在缓存则选第一个
                liftStyles[0].checked = true;
                shipping_type = liftStyles[0].value;
            }

            this.setData({
                liftStyles,
                shipping_type,
            });
            this.triggerEvent(
                'getShippingType',
                { shipping_type },
                { bubbles: true }
            );
            wx.setStorage({
                key: 'shippingType',
                data: shipping_type
            });
        },

        // 选择物流
        radioChange(e) {
            const { liftStyles } = this.data;
            const { value } = e.detail;
            let shipping_type = Number(value);
            liftStyles.forEach((item) => {
                if (item.value === shipping_type) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            });
            this.setData({ liftStyles, shipping_type });
            this.triggerEvent('change', { shipping_type });
            wx.setStorage({
                key: 'shippingType',
                data: shipping_type
            });
        }
    }
});

