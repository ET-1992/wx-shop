import getToken from 'utils/getToken';
import checkPermission from 'utils/checkPermission';
import { showModal } from 'utils/wxp';

const onRequestSuccess = async (resolve, reject, res) => {
	const { data, statusCode, errMsg } = res;
	const { errcode, errmsg } = data;
	if (statusCode.toString().slice(0, 2) !== '20' || errcode) {
		const err = {
			errMsg: errmsg || errMsg,
			code: errcode || statusCode,
		};
		if (errcode === 'bad_authentication' || errcode === 'illegal_access_token') {
			await showModal({
				title: '用户认证失败',
				content: '认证信息失效，请重新登录',
				showCancel: false,
				confirmText: '前往登录',
			});
			wx.navigateTo({ url: '/pages/login/login?isForce=true' });
		}
		console.error(err);
		return reject(err);
	}
	else {
		return resolve(data);
	}
};

export default async (path, data, options = {}) => {
	const {
		method = 'GET',
		header = {},
		isForceToken,
		isForceUserInfo,
		pathParam,
		requestType = 'request',
		tokenKey = 'access_token',
	} = options;

	const isPermit = await checkPermission({ isForceToken, isForceUserInfo });
	if (!isPermit) { return; }

	header['Content-Type'] = 'application/x-www-form-urlencoded';
	const token = await getToken();
	let url = path;
	let restParams = {
		header,
		data,
	};

	if (pathParam) {
		url = url + `/${pathParam}`;
	}

	if (token) {
		const hasQuery = url.indexOf('?') >= 0;
		const joinSymbol = hasQuery ? '&' : '?';
		url = url + `${joinSymbol}${tokenKey}=${token}`;
	}

	if (requestType === 'uploadFile') {
		restParams = {
			filePath: data.filePath,
			name: 'media',
			header,
		};
	}

	return new Promise((resolve, reject) => {
		wx[requestType]({
			url,
			success: (res) => onRequestSuccess(resolve, reject, res),
			fail: reject,
			method,
			...restParams,
		});
	});
};
