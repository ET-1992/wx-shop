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
	},

	methods: {
		onChange(ev) {
			const { type } = ev.currentTarget.dataset;
			const { value, postId, skuId, max, isDisabled, quota } = this.data;

			if (isDisabled) {
				return;
			}

			const isDecrease = type === 'decrease';
			const isAdd = type === 'add';
			if (isDecrease && !(value > 1)) {
				wx.showModal({
					title: '温馨提示',
					content: '数量不能小于1',
					showCancel: false,
				});
				console.log(this.data);
				return;
			}

			if (isAdd && value >= max) {
				wx.showModal({
					title: '温馨提示',
					content: '库存不足，请重新选择',
					showCancel: false,
				});
				return;
			}

			if (isAdd && value >= quota) {
				wx.showModal({
					title: '温馨提示',
					content: `每人限购${quota}件`,
					showCancel: false,
				});
				return;
			}

			const addNum = isDecrease ? -1 : 1;
			const updateData = {
				value: value + addNum,
				postId,
				skuId,
			};
			this.setData({ value: value + addNum });
			this.triggerEvent('quantityChangeEvent', updateData);
		},
	},
});
