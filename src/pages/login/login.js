import login from 'utils/login';
import { login as wxpLogin } from 'utils/wxp';
import reloadCurrentPage from 'utils/reloadCurrentPage';

Page({
	data: {
		code: null,
	},

	async onShow() {
		const { code } = await wxpLogin();
		this.setData({ code });
	},

	async onConfirm(ev) {
		const { encryptedData, iv } = ev.detail;
		const { code } = this.data;
		try {
			const { isForceRegister } = this.options;
			const user = await login({ encryptedData, iv, code });
			if (user) {

				if (isForceRegister) {
					wx.redirectTo({ url: '/pages/register/register' });
				}
				else {
					wx.navigateBack({
						success: async () => {
							await reloadCurrentPage();
						},
					});
				}
			}
			else {
				throw new Error('login error');
			}
		}
		catch (err) {
			console.log('onConfirm error: ', err);
		}
	},
	onCancel() {
		wx.navigateBack();
	},
});
