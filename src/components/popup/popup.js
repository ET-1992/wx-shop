import { wxPay } from 'utils/pageShare';
import api from 'utils/api';
const app = getApp();
Component({
    properties: {
        title: {
            type: String,
            value: 'popup Component',
        },
        rechargeModal: {
            type: Boolean,
            value: false,
            observer(newValue) {
                if (newValue) {
                    this.setData({ rechargePrice: '' });
                }
            }
        },
        rechargeArray: {
            type: Object,
            value: [],
        },
        user: {
            type: Object,
            value: {}
        },
        config: {
            type: Object,
            value: {}
        }
    },
    data: {
        globalData: app.globalData,
        amount: 0,
        // rechargePrice: ''
    },
    methods: {
        // 关闭会员充值弹窗
        closeRechargeModal() {
            this.setData({
                rechargeModal: false
            });
        },
        // 充值金额点击选择事件
        rechargeTap(e) {
            let checked = e.currentTarget.dataset.index;
            console.log('this.data.rechargePrice', this.data.rechargePrice);
            if (this.data.rechargePrice) {
                this.setData({
                    rechargePrice: ''
                });
            }
            console.log(checked);
            const { rechargeArray } = this.data;
            for (let i = 0; i < rechargeArray.length; i++) {
                if (i === checked) {
                    console.log('index', i);
                    rechargeArray[i].checked = true; // 当前点击的位置为true即选中
                } else {
                    rechargeArray[i].checked = false; // 其他的位置为false
                }
            }
            this.setData({ rechargeArray });
            console.log('充值金额this.data.rechargeArray', this.data.rechargeArray);
        },

        /* 选择框的金额 */
        selectPrice() {
            const { rechargeArray } = this.data;
            const price = rechargeArray.filter(item => {
                return item.checked;
            });
            console.log('price', price);
            if (price) {
                this.setData({ amount: price[0].recharge });
            }
        },

        /* 输入框聚焦时，取消金额选择框的选中状态 */
        inputFocus(e) {
            const { rechargeArray } = this.data;
            console.log('this.data.rechargeArray', rechargeArray);
            rechargeArray.forEach(item => {
                item.checked = false;
            });
            console.log('rechargeArray', rechargeArray);
            this.setData({ rechargeArray });
        },

        /* 其他充值金额 */
        inputRechargePrice(e) {
            const { value } = e.detail;
            this.setData({ rechargePrice: value });
            console.log('this.data.rechargePrice', this.data.rechargePrice);
        },

        /* 有储值卡的店铺确认支付按钮事件 */
        async rechargePriceEvent() {
            const { rechargePrice, config } = this.data;
            console.log('有储值卡的店铺rechargePrice', rechargePrice);
            if (rechargePrice) {
                const { pay_sign } = await api.hei.joinMembership({ amount: rechargePrice });
                this.setData({ pay_sign });
                console.log('其他充值金额pay_sign', pay_sign);
            } else {
                this.selectPrice();
                const { amount } = this.data;
                console.log('有储值卡的店铺amount', amount);
                const { pay_sign } = await api.hei.joinMembership({ amount });
                this.setData({ pay_sign });
                console.log('选择框金额pay_sign', pay_sign);
            }

            this.setData({ rechargeModal: false });

            // 调微信支付
            const { pay_sign } = this.data;
            if (pay_sign) {
                try {
                    await wxPay(pay_sign);
                    this.triggerEvent('setConsumptionList', {}, { bubbles: true });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
});