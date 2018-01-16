import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';

// const app = getApp()

Page({

	data: {
		categories: [],

		selectedIndex: 0,
	},

	async onLoad() {
		const data = await api.hei.fetchCategory();

		data.categories.forEach((category) => {
			const { children = [] } = category;
			children.unshift({
				id: category.id,
				thumbnail: category.thumbnail,
				name: '全部'
			});
		});

		this.setData(data);
	},

	onMainCategoryItemClick(ev) {
		const { index } = ev.currentTarget.dataset;
		this.setData({ selectedIndex: index });
	},
	onShareAppMessage: onDefaultShareAppMessage,
});
