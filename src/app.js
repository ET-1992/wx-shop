import { login as wxLogin } from 'utils/wxp';
import api from 'utils/api';

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

		const { code } = await wxLogin();
		console.log(code);
		const res = await api.hei.silentLogin({ code });
		console.log(res);
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
