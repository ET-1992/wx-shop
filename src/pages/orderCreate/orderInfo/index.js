import  templateTypeText from 'constants/templateType';

const app = getApp();

Component({
    properties: {
        useCoin: {
            type: Number,
            value: 0,
            observer(newValue) {
                this.setData({
                    coinForPay: Number(newValue / 100).toFixed(2)
                });
            }
        },
        totalPrice: {
            type: null,
            value: 0,
            observer(newValue) {
                this.setData({
                    totalPriceDispaly: Number(newValue).toFixed(2)
                });
            }
        },
        fee: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    postageDispaly: newValue.postage ? Number(newValue.postage).toFixed(2) : '0.00',
                    couponFeeDispaly: newValue.coupon_reduce_fee ? Number(newValue.coupon_reduce_fee).toFixed(2) : '0.00',
                    totalPriceDispaly: newValue.item_amount ? Number(newValue.item_amount).toFixed(2) : '0.00'
                });
            }
        },
        shouldGoinDisplay: {
            type: Boolean,
            value: false
        },
        isGrouponBuy: {
            type: Boolean,
            value: false
        },
        isGrouponCommanderPrice: {
            type: Boolean,
            value: false
        },
        totalPostage: {
            type: null,
            value: '0.00',
            observer(newValue) {
                this.setData({
                    totalPostageDispaly: Number(newValue).toFixed(2)
                });
            }
        },
        defineTypeGlobal: {
            type: String,
            value: ''
        }
    },
    data: {
        coinForPay: '0.00',
        totalPriceDispaly: '0.00',
        couponFeeDispaly: '0.00',
        totalPostageDispaly: '0.00',
        templateTypeText,
        globalData: app.globalData
    }
});