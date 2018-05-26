// import { HAS_PROFILE_KEY } from 'constants/index';
import getToken from 'utils/getToken';
import getUserInfo from 'utils/getUserInfo';
import { showModal } from 'utils/wxp';

export default async (params = {}) => {
	const { isForceToken, isForceUserInfo } = params;
	const token = getToken();
	const user = getUserInfo();
	const isNeedLogin = (isForceToken && !token) || (isForceUserInfo && !user);

	let isPermit = true;

	if (!isNeedLogin) { return isPermit; }

	if (isNeedLogin) {
		const { confirm } = await showModal({
			title: '请先登录',
			content: '该操作需用户登录后继续',
			confirmText: '前往登录',
		});

		isPermit = false;

		if (confirm) {
			const loginUrl = '/pages/login/login';
			wx.navigateTo({ url: loginUrl });
		}
	}

	return isPermit;
};
