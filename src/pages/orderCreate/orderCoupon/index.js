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
        config: {
            type: Object,
            value: {}
        },
        fee: {
            type: Object,
            value: {},
            observer(newValue) {
                let { coupon_reduce_fee, discount_code_reduce_fee } = newValue;
                this.setData({
                    coupon_reduce_fee: this.fixedNumber(coupon_reduce_fee),
                    discount_code_reduce_fee: this.fixedNumber(discount_code_reduce_fee),
                });
            }
        },
        isHaveUseCoupon: {
            type: Boolean,
            value: true
        }
    },
    methods: {

        // 格式化浮点数金额
        fixedNumber(value) {
            return value ? Number(value).toFixed(2) : '0.00';
        },

        // 优惠券选择
        couponChange() {
            this.triggerEvent('getcouponid', {}, { bubbles: true });
        },

        // 花生米输入
        bindInput(e) {
            let { value } = e.detail;
            value = Number(value);
            const { maxUseCoin, coins } = this.data;
            if (value > maxUseCoin || value > coins) {
                value = Math.min(maxUseCoin, coins);
            }
            this.triggerEvent('setusecoin', value, { bubbles: true });
            return value;
        },

        // 优惠码输入
        bindCodeInput(e) {
            let { code } = e.detail.value;
            this.triggerEvent('code-change', { code });
        },
    }
});