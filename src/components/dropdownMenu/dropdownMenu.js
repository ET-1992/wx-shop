Component({
	properties: {
		title: {
			type: String,
			value: 'DropdownMenu Component',
		},
		typeArray: {
			type: Object,
			value: {}
		},
	},
	data: {
		typeIndex: 0, // 类型索引
		dateIndex: '', // 时间索引
	},
	methods: {
		// 改变类型或者时间picker框
		onPickerChange: function (e) {
			let { detail: { value }, currentTarget: { dataset: { name }}} = e;
			if (value === this.data[name]) return;
			// name包括typeIndex、dateIndex
			this.setData({
				[name]: value,
			});
			console.log('picker发送选择改变，携带值为', value);
			let pickerChangeDetail = { name, value };
			this.triggerEvent('pickerChange', pickerChangeDetail);
		},

		// 重置类型或者时间picker框
		onPickerCancel: function (e) {
			let { name } = e.currentTarget.dataset;
			let value;
			if (name === 'dateIndex') {
				value = '';  // 全部时间
			} else {
				value = 0;  // 全部类型
			}
			this.setData({
				[name]: value,
			});
			let pickerChangeDetail = { name, value };
			this.triggerEvent('pickerChange', pickerChangeDetail);
		},
	},
});

