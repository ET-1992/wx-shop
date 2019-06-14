import { wxPay } from 'utils/pageShare';
import api from 'utils/api';

Component({
    properties: {
        title: {
            type: String,
            value: 'popup Component',
        },
        rechargeModal: {
            type: Boolean,
            value: false,
        },
        rechargeArray: {
            type: Object,
            value: [],
        },
        user: {
            type: Object,
            value: {}
        }
    },
    data: {
        amount: 0
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
            console.log(checked);
            const { rechargeArray } = this.data;
            for (let i = 0; i < rechargeArray.length; i++) {
                if (i === checked) {
                    console.log(i);
                    rechargeArray[i].checked = true; // 当前点击的位置为true即选中
                } else {
                    rechargeArray[i].checked = false; // 其他的位置为false
                }
            }
            this.setData({ rechargeArray });
            console.log(this.data.rechargeArray);
        },

        /* 其他充值金额 */
        inputRechargePrice(e) {
            const { value } = e.detail;
            this.setData({ rechargePrice: value });
            console.log(this.data.rechargePrice);
        },

        /* 选择的金额 */
        selectPrice() {
            const { rechargeArray } = this.data;
            const price = rechargeArray.filter(item => {
                return item.checked;
            });
            console.log(price);
            if (price) {
                this.setData({ amount: price[0].recharge });
            }
        },

        /* 开通会员确认支付 */
        async buyMember() {
            this.selectPrice();
            const { amount } = this.data;
            const { pay_sign } = await api.hei.joinMembership();
            console.log(pay_sign);
            if (pay_sign) {
                try {
                    await wxPay(pay_sign);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
});