import { TOKEN_KEY, EXPIRED_KEY } from 'constants/index';

//测试当使用中token过期是否会自动登录 和各种登录情况
export default () => {

	let token = wx.getStorageSync(TOKEN_KEY);
	const expiredTime = wx.getStorageSync(EXPIRED_KEY);
	if (!token || expiredTime <= new Date()) {
		token = null;
	}
	return token;
};
