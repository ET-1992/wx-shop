import api from 'utils/api';

Page({
    data: {
        title: 'shareApply',
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    async joinShareUser() {
        try {
            const data = await api.hei.joinShareUser();
            await wx.showToast({
                title: '申请成功',
                icon: 'success',
                complete: () => {
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/share/shareCenter/shareCenter'
                        });
                    }, 1000);
                }
            });
        } catch (e) {
            wx.showToast({
                title: '申请失败',
                icon: 'none'
            });
        }
    }
});
