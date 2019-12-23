const app = getApp();
Component({
    properties: {
        showRechargeModal: {
            type: Boolean,
            value: false,
            observer(newValue) {
                if (newValue) {
                    const { rechargeArray } = this.data;
                    rechargeArray.forEach(item => {
                        item.checked = false;
                    });
                    rechargeArray[0].checked = true;
                    this.setData({
                        rechargePrice: '',
                        rechargeArray,
                        amount: rechargeArray && rechargeArray[0] && rechargeArray[0].recharge || 0
                    });
                }
            }
        },
        rechargeArray: {
            type: Object,
            value: []
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
        rechargePrice: ''
    },
    attached() {
        console.log('attached');
        this.setData({
            globalData: app.globalData
        });
    },
    methods: {
        // 关闭会员充值弹窗
        closeRechargeModal() {
            this.triggerEvent('closeRechargeModal', {}, { bubbles: true });
        },
        // 充值金额点击选择事件
        rechargeTap(e) {
            let { index: activeIndex } = e.currentTarget.dataset;
            const { rechargeArray } = this.data;
            rechargeArray.forEach((item, index) => {
                item.checked = (index === activeIndex);
            });
            this.setData({
                rechargePrice: '',
                rechargeArray,
                amount: rechargeArray[activeIndex].recharge
            });
            console.log('rechargeArray', rechargeArray);
            console.log('amount', this.data.amount);
        },

        /* 输入框聚焦时，取消金额选择框的选中状态 */
        inputFocus(e) {
            const { rechargeArray } = this.data;
            rechargeArray.forEach(item => {
                item.checked = false;
            });
            this.setData({ rechargeArray });
        },

        /* 其他充值金额 */
        inputRechargePrice(e) {
            const { value } = e.detail;
            this.setData({ amount: value });
        },

        /* 有储值卡的店铺确认支付按钮事件 */
        async rechargePriceEvent() {
            const { amount } = this.data;
            console.log('amount', amount);
            if (Number(amount) <= 0) {
                wx.showToast({
                    title: '请输入大于0的金额',
                    icon: 'none'
                });
                return;
            }
            this.triggerEvent('onConfirmRecharge', { amount }, { bubbles: true });
        }
    }
});