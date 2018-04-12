import login from 'utils/login';
// import getToken from 'utils/getToken';

App({
	onLaunch() {
		const { windowWidth, pixelRatio, screenWidth } = wx.getSystemInfoSync();
		this.systemInfo = { windowWidth, ratio: pixelRatio, screenWidth };
	},

	async onShow(options) {
		
		const { query = {} } = options;
		if (query.vendor) {
			this.globalData.vendor = query.vendor;
		}
		console.log(this.globalData);
		// await login();
		if(options.referrerInfo) {
			this.globalData.extraData = options.referrerInfo.extraData
		}
		console.log(this.globalData);
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
