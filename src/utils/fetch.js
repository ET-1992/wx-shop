import { authFail } from './errorHandler';
import getToken from 'utils/getToken';
import login from 'utils/login';
import { TOKEN_KEY, EXPIRED_KEY } from 'constants/index';
// 获取应用实例

const onRequestSuccess = (resolve, reject, res) => {
	const { data, statusCode, errMsg } = res;
	const { errcode, errmsg } = data;
	if (errcode === 'illegal_access_token') {
		wx.removeStorageSync(TOKEN_KEY);
		wx.removeStorageSync(EXPIRED_KEY);
		login();
	}
	else if (statusCode !== 200 || errcode) {
		const err = {
			errMsg: errmsg || errMsg,
			code: errcode || statusCode
		};
		console.error(err);
		return reject(err);
	}
	else {
		return resolve(data);
	}
};

export default async (path, data, options = {}) => {
	const { method = 'GET', header = {}, isForceToken, requestType = 'request', pathParam } = options;
	header['Content-Type'] = 'application/x-www-form-urlencoded';
	let url = path;
	// let wxMethod = 'request';
	let restParams = {
		header,
		data
	};

	if (isForceToken && !getToken()) {
		await login();
	}

	const token = getToken();

	if (pathParam) {
		url = url + `/${pathParam}`;
	}

	if (token) {
		const hasQuery = url.indexOf('?') >= 0;
		const joinSymbol = hasQuery ? '&' : '?';
		url = url + `${joinSymbol}access_token=${token}`;
	}
	if (requestType === 'uploadFile') {
		// header['Content-Type'] = 'multipart/form-data';
		restParams = {
			// formData: {
			// 	access_token: token,
			// },
			filePath: data.filePath,
			name: 'media',
			header
		};
	}
	return new Promise((resolve, reject) => {
		wx[requestType]({
			url,
			success: (res) => onRequestSuccess(resolve, reject, res),
			fail: reject,
			method,
			...restParams
		});
	});
};
