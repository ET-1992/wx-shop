const app = getApp();
Component({
    properties: {
        showRechargeModal: {
            type: Boolean,
            value: false
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
        const { rechargeArray } = this.data;
        console.log('rechargeArray', rechargeArray);
        this.setData({
            globalData: app.globalData,
            amount: rechargeArray && rechargeArray[0] && rechargeArray[0].recharge || 0
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