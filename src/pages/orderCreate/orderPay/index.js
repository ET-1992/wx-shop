const app = getApp();

Component({
    properties: {
        finalPay: {
            type: null,
            value: 0.00
        },
        isIphoneX: {
            type: Boolean,
            value: false
        },
        isPeanutPay: {
            type: Boolean,
            value: false
        },
        isDisablePay: {
            type: Boolean,
            value: true
        },
        crowd: {
            type: Boolean,
            value: false
        },
        themeColor: {
            type: Object,
            value: {}
        },
        // 免邮金额
        shippingDebt: {
            type: Number,
            value: 0
        },
        config: {
            type: Object,
            value: {}
        },
        // 底部包邮提示
        postageTip: {
            type: String,
            value: '',
        },
        fee: {
            type: Object,
            value: {},
        },
        // 自提门店
        liftInfo: {
            type: Object,
            value: {},
        },
    },
    data: {
        globalData: app.globalData,
        templateRemainer: '',  // 运费模板提示
        shippingRemainer: '',  // 包邮金额提示
        liftingRemainer: '',  // 包邮金额提示
    },
    observers: {
        // 邮费相关提示
        'shippingDebt, postageTip, fee': function(...params) {
            let [shippingDebt, postageTip, fee] = params,
                { globalData, templateRemainer, shippingRemainer } = this.data;

            if (fee.postage <= 0) { return }
            if (shippingDebt) {
                let price = globalData.CURRENCY[globalData.currency] + shippingDebt;
                shippingRemainer = `满${price}免邮`;
            } else if (postageTip) {
                templateRemainer = postageTip;
            }
            this.setData({
                shippingRemainer,
                templateRemainer,
            });
        },

        // 自提门槛提示
        'finalPay, liftInfo': function(...params) {
            let [finalPay, liftInfo] = params,
                { sl_least_fee } = liftInfo,
                liftingRemainer = '';

            if (finalPay < sl_least_fee) {
                liftingRemainer = sl_least_fee;
                liftingRemainer += '元起可使用自提';
            }
            this.setData({ liftingRemainer });
        },
    },
    methods: {
        onPay(e) {
            const { crowdtype } = e.currentTarget.dataset;
            const { crowd, finalPay } = this.data;
            if (crowd) {
                finalPay > 0
                    ?
                    this.triggerEvent('onpay', { crowd, crowdtype }, { bubbles: true })
                    :
                    wx.showModal({
                        title: '温馨提示',
                        content: '订单金额为0元',
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#3CC51F',
                    });
            } else {
                this.triggerEvent('onpay', {}, { bubbles: true });
            }
        },
        onJumpPage() {
            wx.switchTab({
                url: '/pages/home/home'
            });
        },
    }
});