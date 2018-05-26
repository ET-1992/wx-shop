import { TOKEN_KEY, EXPIRED_KEY } from 'constants/index';

export default () => {
	let token = wx.getStorageSync(TOKEN_KEY);
	const expiredTime = wx.getStorageSync(EXPIRED_KEY);
	if (!token || expiredTime <= Date.now()) {
		token = null;
	}
	return token;
};
