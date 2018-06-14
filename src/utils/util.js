import { TOKEN_KEY, EXPIRED_KEY, USER_KEY } from 'constants/index';
import api from 'utils/api';
import { login, checkSession } from 'utils/wxp';

function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return [year, month, day]
		.map(formatNumber)
		.join('-') + ' ' +
			[hour, minute, second].map(formatNumber).join(':')
	;
}


export async function getAgainTokenForInvalid() {
	console.log('获取code');
	const { code } = await login();
	console.log('获取token');
	const { user, access_token, expired_in } = await api.hei.silentLogin({ code });
	const expiredTime = expired_in * 1000 + Date.now();
	wx.setStorageSync(USER_KEY, user);
	wx.setStorageSync(TOKEN_KEY, access_token);
	wx.setStorageSync(EXPIRED_KEY, expiredTime);
	return access_token;
}

export async function getAgainUserForInvalid({encryptedData, iv }) {
	const data = await api.hei.getUserInfo({
		encrypted_data: encryptedData,
		iv,
	});
	if (data) {
		wx.setStorageSync(USER_KEY, data.user);
		return data.user;
	}
	return null;
}

export function getToken() {
	let token = wx.getStorageSync(TOKEN_KEY);
	const expiredTime = wx.getStorageSync(EXPIRED_KEY);
	if (!token || expiredTime <= Date.now()) {
		token = null;
	}
	return token;
}

export function getUserInfo() {
	let user = wx.getStorageSync(USER_KEY);
	const { expired, openid } = user;
	if (expired || !openid) {
		user = null;
	}
	return user;
}