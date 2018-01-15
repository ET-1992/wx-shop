import login from 'utils/login';
// import getToken from 'utils/getToken';

App({
	onLaunch() {
		const { windowWidth, pixelRatio, screenWidth } = wx.getSystemInfoSync();
		this.systemInfo = { windowWidth, ratio: pixelRatio, screenWidth };
	},

	async onShow(options) {
		console.log('App On Show: ', options);
		const { query = {} } = options;
		if (query.vendor) {
			this.globalData.vendor = query.vendor;
		}
		// await login();
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
