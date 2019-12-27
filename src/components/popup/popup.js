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
                    console.log('rechargeArray', rechargeArray);
                    this.setData({
                        rechargePrice: '',
                        rechargeArray,
                        amount: rechargeArray && rechargeArray[0] && rechargeArray[0].recharge || 0
                    });
                }
            }
        },
        showRenewsModal: {
            type: Boolean,
            value: false,
            observer(newValue) {
                if (newValue) {
                    const { renews } = this.data;
                    renews.forEach(item => {
                        item.checked = false;
                    });
                    renews[0].checked = true;
                    this.setData({
                        renews,
                        selectRenewal: renews && renews[0]
                    });
                    console.log('renews40', this.data.renews);
                    console.log('selectRenewal', this.data.selectRenewal);
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
        },
        tip: {
            type: String,
            value: ''
        },
        renews: {
            type: Object,
            value: []
        }
    },
    data: {
        rechargePrice: '',
        selectRenewal: {}
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
        // 关闭续费弹窗
        closeRenewsModal() {
            this.triggerEvent('closeRenewsModal', {}, { bubbles: true });
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

        // 续费金额点击选择事件
        renewsTap(e) {
            let { index: activeIndex } = e.currentTarget.dataset;
            const { renews } = this.data;
            renews.forEach((item, index) => {
                item.checked = (index === activeIndex);
            });
            this.setData({
                renews,
                selectRenewal: renews[activeIndex]
            });
            console.log('renews110', renews);
            console.log('selectRenewal', this.data.selectRenewal);
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

        /* 充值确认支付按钮事件 */
        async rechargePriceEvent() {
            const { amount } = this.data;
            console.log('amount129', amount);
            if (Number(amount) <= 0) {
                wx.showToast({
                    title: '请输入大于0的金额',
                    icon: 'none'
                });
                return;
            }
            this.triggerEvent('onConfirmRecharge', { amount }, { bubbles: true });
        },

        /* 续费确认支付按钮事件 */
        async renewsPriceEvent() {
            const { selectRenewal } = this.data;
            this.triggerEvent('onConfirmRenews', { selectRenewal }, { bubbles: true });
        }
    }
});