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
	},

	methods: {
		onChange(ev) {
			const { type } = ev.currentTarget.dataset;
			const { value, postId, skuId, max } = this.data;
			const isDecrease = type === 'decrease';

			if (isDecrease && !(value > 1)) {
				wx.showModal({
					title: '温馨提示',
					content: '数量不能小于1',
					showCancel: false,
				});
				return;
			}

			if (value >= max) {
				wx.showModal({
					title: '温馨提示',
					// content: `不能超过最大值${max}`,
					content: `库存不足，不能超过最大值${max}`,
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

		// onInputChange(ev) {
		// 	const { value } = ev.detail;
		// 	const { postId, skuId, max, value: exValue } = this.data;

		// 	console.log('Number', value === 0);
		// 	console.log(value);
		// 	if (+value === 0) {
		// 		this.setData({ value: 1 });
		// 		return;
		// 	}

		// 	if (+value > max) {
		// 		wx.showModal({
		// 			title: '温馨提示',
		// 			content: `不能超过最大值${max}`,
		// 			showCancel: false,
		// 		});
		// 		this.setData({ value: exValue });
		// 		return;
		// 	}

		// 	this.setData({ value });
		// 	this.triggerEvent('quantityChangeEvent', {
		// 		value,
		// 		postId,
		// 		skuId
		// 	});
		// }
	}
});
