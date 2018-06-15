import getToken from 'utils/getToken';
import checkPermission from 'utils/checkPermission';
import { getAgainTokenForInvalid } from 'utils/util';
import { showModal } from 'utils/wxp';
import { login, checkSession } from 'utils/wxp';

const onRequestSuccess = async (resolve, reject, res, wxRequest, reTryTime) => {
	const { data, statusCode, errMsg } = res;
	const { errcode, errmsg } = data;
	if (statusCode.toString().slice(0, 2) !== '20' || errcode) {
		const err = {
			errMsg: errmsg || errMsg,
			code: errcode || statusCode,
		};
		if (errcode === 'bad_authentication' || errcode === 'illegal_access_token') {
			if (reTryTime < 3) {
				console.log('token失效');
				try {
					await getAgainTokenForInvalid();
					const newData = await wxRequest();
					console.log('重新请求结束');
					return resolve(newData);
				} catch (e) {
					console.log(e)
					return reject(e);
				}
			} else {
				return reject(err);
			}
		}
		return reject(err);
	}
	else {
		return resolve(data);
	}
};

export default async (path, data, options = {}) => {
	let  reTryTime = 0;
	 const wxRequest = () => {
		 return new Promise(async (resolve, reject) => {
			const {
				method = 'GET',
				header = {},
				isForceToken,
				isForceUserInfo,
				pathParam,
				requestType = 'request',
				tokenKey = 'access_token',
			} = options;
		
			const isPermit = await checkPermission({ isForceToken,   });
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
			reTryTime++;
			wx[requestType]({
				url,
				success: (res) => onRequestSuccess(resolve, reject, res, wxRequest, reTryTime),
				fail: reject,
				method,
				...restParams,
			});
		});
	 }
	return wxRequest();
};
