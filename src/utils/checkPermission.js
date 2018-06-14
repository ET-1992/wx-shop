// import { HAS_PROFILE_KEY } from 'constants/index';
import { showModal } from 'utils/wxp';
import { getToken, getUserInfo, getAgainTokenForInvalid, getAgainUserForInvalid } from 'utils/util';

export default async (params = {}) => {
	const { isForceToken, isForceUserInfo } = params;
	let token = getToken();
	let isPermit = true;

	if (isForceToken && !token) {
		console.log('token失效');
		token = await getAgainTokenForInvalid();
		console.log(token, '重新获取token');
		isPermit = !!token;
	}

	return isPermit;
};
