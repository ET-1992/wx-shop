App({
	onLaunch() {
		const { windowWidth, pixelRatio, screenWidth, model } = wx.getSystemInfoSync();
		this.systemInfo = {
			windowWidth,
			ratio: pixelRatio,
			screenWidth,
			isIphoneX: model.indexOf('iPhone X') >= 0,
		};

		const extConfig = wx.getExtConfigSync() || {};
		// const extConfig = { primaryColor: 'red', secondaryColor: 'blue' };
		const { primaryColor, secondaryColor } = extConfig;
		this.globalData.themeColor = { primaryColor, secondaryColor };
	},

	async onShow(options) {
		const { query = {} } = options;
		if (query.vendor) {
			this.globalData.vendor = query.vendor;
		}
		if (options.referrerInfo) {
			this.globalData.extraData = options.referrerInfo.extraData;
		}
	},

	onError(err) {
		console.error('[APP ERROR]', err);
	},

	globalData: {
		vendor: '',
		currentOrder: {
			items: [],
		},
		orderDetail: {
			items: []
		},
	},

	systemInfo: {},
});
