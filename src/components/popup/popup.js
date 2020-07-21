const app = getApp();

Component({
    properties: {
        rechargeModal: {
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
                        amount: rechargeArray && rechargeArray[0] && rechargeArray[0].recharge || 0,
                        storeCardCode: rechargeArray && rechargeArray[0] && rechargeArray[0].code || ''
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
            type: Array,
            value: [],
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
        },
        customizePayEnable: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        rechargePrice: '',
        selectRenewal: {},
        storeCardCode: '',
        is_custom: false // 是否自定义金额
    },
    attached() {
        this.setData({
            globalData: app.globalData
        });
    },

    methods: {
        // 充值金额点击选择事件
        rechargeTap(e) {
            let { index: activeIndex } = e.currentTarget.dataset;
            console.log(activeIndex, 'index');
            const { rechargeArray } = this.data;
            rechargeArray.forEach((item, index) => {
                item.checked = index === activeIndex;
            });
            this.setData({
                rechargePrice: '',
                rechargeArray,
                amount: rechargeArray[activeIndex].recharge,
                storeCardCode: rechargeArray[activeIndex].code || ''
            });
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
        inputFocus() {
            const { rechargeArray } = this.data;
            rechargeArray.forEach(item => {
                item.checked = false;
            });
            this.setData({ rechargeArray });
        },

        // 小数点保留2位
        onInput(e) {
            const { value } = e.detail;
            let amount = value;
            if (!(/^(\d?)+(\.\d{0,2})?$/.test(value))) {
                amount = value.substring(0, value.length - 1);
            }
            this.setData({ amount, is_custom: true });
            return amount;
        },

        /* 充值确认支付按钮事件 */
        async rechargePriceEvent() {
            let { amount, storeCardCode, is_custom } = this.data;
            if (Number(amount) <= 0) {
                wx.showToast({
                    title: '请输入大于0的金额',
                    icon: 'none'
                });
                return;
            }
            this.triggerEvent('onConfirmRecharge', { amount, storeCardCode, isCustom: is_custom }, { bubbles: true });
        },

        /* 续费确认支付按钮事件 */
        async renewsPriceEvent() {
            const { selectRenewal } = this.data;
            this.triggerEvent('onConfirmRenews', { selectRenewal }, { bubbles: true });
        },

        // 关闭会员充值弹窗
        closeRechargeModal() {
            this.triggerEvent('closeRechargeModal', {}, { bubbles: true });
        },

        // 关闭续费弹窗
        closeRenewsModal() {
            this.triggerEvent('closeRenewsModal', {}, { bubbles: true });
        }
    }
});
