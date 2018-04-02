export const chooseImage = (options) => new Promise((resolve, reject) => {
	wx.chooseImage({ success: resolve, fail: reject, ...options });
});

export const getUserInfo = () => new Promise((resolve, reject) => {
	wx.getUserInfo({ success: resolve, fail: reject });
});

export const login = () => new Promise((resolve, reject) => {
	wx.login({ success: resolve, fail: reject });
});

export const request = () => new Promise((resolve, reject) => {
	wx.request({ success: resolve, fail: reject });
});

export const setClipboardData = (options) => new Promise((resolve, reject) => {
	wx.setClipboardData({ success: resolve, fail: reject, ...options });
});

export const showActionSheet = (options) => new Promise((resolve, reject) => {
	wx.showActionSheet({ success: resolve, fail: reject, ...options });
});

export const showModal = (options) => new Promise((resolve, reject) => {
	wx.showModal({ success: resolve, fail: reject, ...options });
});

export const showToast = (options) => new Promise((resolve, reject) => {
	wx.showToast({ success: resolve, fail: reject, ...options });
});

export const chooseAddress = (options) => new Promise((resolve, reject) => {
	wx.chooseAddress({ success: resolve, fail: reject, ...options });
});

export const requestPayment = (options) => new Promise((resolve, reject) => {
	wx.requestPayment({
		success: resolve,
		fail: reject,
		complete: (res) => {
			console.log('complete res', res);
			const { platform } = wx.getSystemInfoSync();

			const isAndroid = platform === 'android';
			const isError = res.errMsg.indexOf('cancel') >= 0;
			if (isError && isAndroid) {
				reject(res);
			}
		},
		...options,
	});
});

export const openSetting = (options) => new Promise((resolve, reject) => {
	wx.openSetting({ success: resolve, fail: reject, ...options });
});

export const getSetting = (options) => new Promise((resolve, reject) => {
	wx.getSetting({ success: resolve, fail: reject, ...options });
});

// export const getSetting = (options) => new Promise((resolve, reject) => {
// 	wx.getSetting({ success: resolve, fail: reject, ...options });
// });


//

// 仅能对wx API中，有success, fail方法的API进行Promise化，若没有，请直接使用wx, 不能使用wxp, 否则无法成功调用API

// export default new Proxy(wx, {
// 	get(target, name) {
// 		return (options) => {
// 			if (wx.canIUse(`${name}.success`)) {
// 				return new Promise((resolve, reject) => {
// 					wx[name]({ success: resolve, fail: reject, ...options });
// 				});
// 			}
// 			else {
// 				return wx[name];
// 			}
// 		};
// 	}
// });
