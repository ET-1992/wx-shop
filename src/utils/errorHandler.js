import { autoNavigate } from 'utils/util';
export const accessDeny = () => {
    wx.showModal({
        title: '授权登录失败',
        content: '请允许微信授权后再试，若已拒绝请等待重新授权，',
        showCancel: false,
        confirmText: '返回首页',
        success: ({ confirm }) => {
            if (confirm) {
                autoNavigate('/pages/home/home');
            }
        }
    });
};


export const authFail = async () => {
    wx.showModal({
        title: '未登录',
        confirmText: '重新登录',
        showCancel: false,
        success: async ({ confirm }) => {
            if (confirm) {
                const data = await getApp().login();
                console.log(data);
                if (data) {
                    if (wx.canIUse('reLaunch')) {
                        wx.reLaunch({ url: '/pages/home/home' });
                    }
                }
            }
        },
    });
};
