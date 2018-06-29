const app = getApp();

Component({
    properties: {
        shouldGoinDisplay: {
            type: Boolean,
            value: false
        },
        isGrouponBuy: {
            type: Boolean,
            value: false
        },
        coins: {
            type: Number,
            value: 0
        },
        maxUseCoin: {
            type: Number,
            value: 0
        },
        useCoin: {
            type: Number,
            value: 0
        },
        fee: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    couponFeeDispaly: newValue.coupon_reduce_fee ? Number(newValue.coupon_reduce_fee).toFixed(2) : '0.00'
                });
            }
        },
        isHaveUseCoupon: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        couponChange() {
            this.triggerEvent('getcouponid', {}, { bubbles: true });
        },
        bindInput(e) {
            let { value } = e.detail;
            value = Number(value);
            const { maxUseCoin, coins } = this.data;
            if (value > maxUseCoin || value > coins) {
                value = Math.min(maxUseCoin, coins);
            }
            this.triggerEvent('setusecoin', value, { bubbles: true });
            return value;
        }
    }
});