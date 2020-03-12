// const app = getApp();

Component({
    properties: {
        value: {
            type: Number,
            value: 0,
        },
        postId: {
            type: Number,
            value: 0,
        },
        skuId: {
            type: Number,
            value: 0,
        },
        max: {
            type: Number,
            value: 0,
        },
        isDisabled: {
            type: Boolean,
            value: 0,
        },
        quota: {
            type: Number,
            value: 0,
        },
        least: {
            type: Number,
            value: 0,
            observer(newValue) {
                if (newValue) {
                    this.setData({
                        value: newValue
                    })
                }
            }
        }
    },

    methods: {
        onChange(ev) {
            const { type } = ev.currentTarget.dataset;

            let { value: inputValue } = ev.detail;
            let { value, postId, skuId, max, isDisabled, quota, least } = this.data;

            if (isDisabled) {
                return;
            }

            const isDecrease = type === 'decrease';
            const isAdd = type === 'add';
            const isInput = type === 'input';


            if (isDecrease) {
                value--;
            }
            if (isAdd) {
                value++;
            }
            if (isInput) {
                console.log(inputValue, '90');
                value = inputValue;
            }
            // if (isInput) {

            // }


            if (value < 1) {
                wx.showModal({
                    title: '温馨提示',
                    content: '数量不能小于1',
                    showCancel: false,
                });
                value = 1;
            }

            if (value > max) {
                wx.showModal({
                    title: '温馨提示',
                    content: '库存不足，请重新选择',
                    showCancel: false,
                });
                value = max;
            }

            if (quota > 0 && value > quota) {
                wx.showModal({
                    title: '温馨提示',
                    content: `每人限购${quota}件`,
                    showCancel: false,
                });
                value = quota;
            }

            if (least > 0 && least > value) {
                wx.showModal({
                    title: '温馨提示',
                    content: `每人最低起购${least}件`,
                    showCancel: false,
                });
                value = least;
            }

            const updateData = {
                value,
                postId,
                skuId,
            };
            this.setData({ value });
            this.triggerEvent('quantityChangeEvent', updateData);
        },
    },
});
