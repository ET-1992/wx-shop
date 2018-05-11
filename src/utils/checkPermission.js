import { HAS_PROFILE_KEY } from 'constants/index';
import getToken from 'utils/getToken';
import { showModal } from 'utils/wxp';

export default async (params = {}) => {
	const { isForceToken, isForceRegister } = params;
	const isNeedToken = isForceToken || isForceRegister;
	let isPermit = true;

	if (!isNeedToken) { return isPermit; }

	const hasProfile = wx.getStorageSync(HAS_PROFILE_KEY);
	const token = getToken();

	if (isNeedToken && !token) {
		const { confirm } = await showModal({
			title: '请先登录',
			content: '该操作需用户登录后继续',
			confirmText: '前往登录',
		});

		isPermit = false;

		if (confirm) {
			let loginUrl = '/pages/login/login';
			if (isForceRegister) {
				loginUrl = loginUrl + '&isForceRegister=true';
			}
			wx.navigateTo({ url: loginUrl });
		}
	}
	else if (isForceRegister && !hasProfile) {
		isPermit = false;
		wx.navigateTo({ url: '/pages/register/register' });
	}
	return isPermit;
};
