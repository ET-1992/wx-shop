import { PRODUCT_LIST_STYLE } from 'constants/index';

const app = getApp();

Component({
	properties: {
		products: {
			type: Array,
			value: [],
		},
		modules:{
			type: Object,
			value: {},
		},
		productListStyle: {
			type: String,
			value: PRODUCT_LIST_STYLE[0],
		},
		nextCursor: {
			type: Number,
			value: 0,
			observer(newVal) {
				console.log(newVal);
			}
		},
	},
	data: {
		nowTS: Date.now() / 1000,
	}
});
